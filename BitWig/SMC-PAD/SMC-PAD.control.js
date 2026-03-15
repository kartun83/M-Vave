loadAPI(25);

load("config.js");
load("smk37_hostsetup.js");
load("smk37_observers.js")
load("blink_manager.js");
load("smk37_device_communicator.js");
load("statusPanel.js");
load("bitwig_ui.js");
load("deviceContext.js")
load("statusPanel.js");
load("profiler.js");
load("host_enum.js");
load("controller_state.js");
load("bitwig_states.js");
load("label_renderer.js");
load("pad_color_renderer.js");

load("port_router.js")
load("input_router.js")

// Remove this if you want to be able to use deprecated methods without causing script to stop.
// This is useful during development.
host.setShouldFailOnDeprecatedUse(true);

host.defineController(PLUGIN_SETTINGS.VENDOR,
    PLUGIN_SETTINGS.BOARD,
    PLUGIN_SETTINGS.VERSION,
    PLUGIN_SETTINGS.UUID,
    PLUGIN_SETTINGS.AUTHOR);
host.setErrorReportingEMail(PLUGIN_SETTINGS.SUPPORT);

//host.defineMidiPorts(PLUGIN_SETTINGS.BOARD_SETTINGS.MIDI_INS_COUNT, PLUGIN_SETTINGS.BOARD_SETTINGS.MIDI_OUTS_COUNT);
// println(`ins: ${PLUGIN_SETTINGS.BOARD_SETTINGS.INS.midi_ports_count}`);
// println(`outs: ${PLUGIN_SETTINGS.BOARD_SETTINGS.OUTS.midi_ports_count}`);
host.defineMidiPorts(PLUGIN_SETTINGS.BOARD_SETTINGS.INS.midi_ports_count, PLUGIN_SETTINGS.BOARD_SETTINGS.OUTS.midi_ports_count);

const platformString = host.getPlatformType().toString();

let blinkManager = new BlinkManager();
let deviceCommunicator;
let bitwig_domains;
let profiler;

// Use the PlatformType enum directly
switch (platformString) {
   case "WINDOWS":
      printDebugInfo(`"${platformString}" platform detected`);
      host.addDeviceNameBasedDiscoveryPair(["SINCO SMC-PAD-Master", "SINCO SMC-PAD-Private", "Port 3"],
          ["SMK-37 Elite Master", "SMK-37 Elite Private", "Port 3"]);
      break;
   case "MAC":
      printDebugInfo(`"${platformString}" platform detected`);
      host.addDeviceNameBasedDiscoveryPair(["SINCO SMC-PAD-Master", "SINCO SMC-PAD-Private", "Port 3"],
                                           ["SINCO SMC-PAD-Master", "SINCO SMC-PAD-Private", "Port 3"]);
      host.addDeviceNameBasedDiscoveryPair(["SMC-PAD Bluetooth","",""],["SMC-PAD Bluetooth","",""]);
      break;
   case "LINUX":
      printDebugInfo(`"${platformString}" platform detected`);
      break;
   default:
      println(`!!Unknown platform detected: "${platformString}"`);
      break;
}

// Global variables
let hostObjects = {};
let noteInput;
let globalState = {
   isShiftPressed: false,
   modeSetting: null,
}

let controllerState;
let deviceState;
// let sendState;
// let trackState;
// let masterTrackState;
// let transportState;
// let applicationState;
let controllerRenderer;
let padRenderer;

function init() {
   printDebugInfo(`starting init`);
   _check_config(CONFIG);
   // const transport = host.createTransport();

// States
   controllerState = new ControllerState();
   deviceState = new DeviceState( CONFIG.numKnobParams);
   // sendState = new SendState( CONFIG.numKnobParams);
   const trackState = new TrackState();
   const masterTrackState = new TrackState();
   // transportState = new TransportState();
   // applicationState = new ApplicationState();
   //

   hostObjects = setupHostObjects(host, trackState, masterTrackState);
   //const statusPanel = createStatusPanel(host);

   setup_ui(hostObjects.document, hostObjects.preferences);


   // host.getMidiInPort(0).setMidiCallback(onMidi0);
   // host.getMidiInPort(0).setSysexCallback(onSysex0);
   // host.getMidiInPort(1).setMidiCallback(onMidi1);
   // host.getMidiInPort(1).setSysexCallback(onSysex1);
   //host.getOutMidiPort(0)

   const context = new DeviceContext(
       host,
       PLUGIN_SETTINGS.BOARD_SETTINGS
   );

   showStatus();

   deviceCommunicator = new DeviceCommunicator(context);
   controllerRenderer = new LabelRenderer(controllerState, deviceState, sendState, trackState, deviceCommunicator, CONFIG.numKnobParams);
   padRenderer = new PadColorRenderer(controllerState, transportState, applicationState, trackState, deviceCommunicator);

   // Perform handlers binding

   //const inputRouter = new InputRouter(context);
   const portRouter = new PortRouter(context, PLUGIN_SETTINGS.BOARD_SETTINGS);

   // host.getMidiInPort(0).setMidiCallback((s,d1,d2) => inputRouter.onMidi(0, s,d1,d2));
   const master_short = PLUGIN_SETTINGS.BOARD_SETTINGS.INS.master;
   if (context.isEnabled(master_short.name)) {
      context.getIn(master_short.name).setMidiCallback((s,d1,d2) => portRouter.onMidi(master_short.index, s,d1,d2));
      context.getIn(master_short.name).setSysexCallback(data => portRouter.onSysex(master_short.index, data));
      setupShiftButton(hostObjects.surface, context.getIn(master_short.name), controllerState);
   }
   else
   {
      printDebugInfo(`No callbacks set for ${master_short.name} as it's disabled in configuration`);
   }

   const private_short = PLUGIN_SETTINGS.BOARD_SETTINGS.INS.private;
   if (context.isEnabled(private_short.name)) {
      // context.getIn(private_short.name)?.setMidiCallback((s, d1, d2) => portRouter.onMidi(private_short.index, s, d1, d2));
      // context.getIn(private_short.name)?.setSysexCallback(data => portRouter.onSysex(private_short.index, data));
      // context.getOut(private_short.name).sendSysex([0xF0, 0x35, 0x36, 0x00, bank, 0xF7]);
      printDebugInfo("Trying to change preset to 5");
      //host.getMidiOutPort(1).sendSysex([0xF0, 0x84, 0x00, 0x00, 0x40, 0x0C, 0x00, 0x00, 0x04, 0x02, 0x04, 0x08, 0xF7]);
      // host.getMidiOutPort(1).sendSysex(
      //     "F0 00 32 09 49 00 00 00 02 00 00 00 00 10 00 00 00 04 6A 03 F7"
      // );

      // host.getMidiOutPort(1).sendSysex([0xF0, 0x00, 0x00, 0x40, 0x0C, 0x00, 0x00, 0x04, 0x02, 0x04, 0x08, 0xF7]);
   }
   else
   {
      printDebugInfo(`No callbacks set for ${private_short.name} as it's disabled in configuration`);
   }

   // Render Controls titles
   controllerRenderer.render_all();

   // Set up transport observers
   setupTransportObservers(hostObjects.transport);
   setupPluginsObservers(hostObjects.cursorTrack, hostObjects.cursorDevice);
   setupApplicationObservers(hostObjects.application);
   _markBrowser(hostObjects.browser, hostObjects.cursorBrowserResult);

   //createStatusPanel2(host);
   //let end = new Date().getTime();

   // deviceCommunicator.sendStartupMessage();
   host.scheduleTask(() => {
      deviceCommunicator.sendStartupMessage();
   }, 200);

   //probePalette(deviceCommunicator,16);
   // probeRawColors(deviceCommunicator,16);
   // deviceCommunicator.sendPadString(16, "test1");
   // deviceCommunicator.sendPadString(17, "test2");
   //deviceCommunicator.setPadFlashing(25, Palette.BLUE_BRIGHT, Palette.GREEN_BLUE_BRIGHT);
   context.setupTitles(KNOBS, MODE_KNOB_LABELS, PADS, MODE_KNOB_LABELS);

   // let automation_modes = hostObjects.transport.automationWriteMode().enumDefinition();
   // let automation_modes_count = automation_modes.getValueCount();
   // for (let i = 0; i < automation_modes_count; i++) {
   //    printDebugInfo(`Automation modes: ${i} : ${automation_modes.valueDefinitionAt(i).getId()}`);
   // }

   bitwig_domains = initDomains(hostObjects);

   printDebugInfo(`${PLUGIN_SETTINGS.VENDOR} ${PLUGIN_SETTINGS.BOARD} initialized!`);
}

// Called when a short MIDI message is received on MIDI input port 0.
// function onMidi0(status, data1, data2) {
//    // TODO: Implement your MIDI input handling code here.
// }

// // Called when a MIDI sysex message is received on MIDI input port 0.
// function onSysex0(data) {
//    // MMC Transport Controls:
//    switch (data) {
//       case "f07f7f0605f7":
//          transport.rewind();
//          break;
//       case "f07f7f0604f7":
//          transport.fastForward();
//          break;
//       case "f07f7f0601f7":
//          transport.stop();
//          break;
//       case "f07f7f0602f7":
//          transport.play();
//          break;
//       case "f07f7f0606f7":
//          transport.record();
//          break;
//    }
// }
// // Called when a short MIDI message is received on MIDI input port 1.
// function onMidi1(status, data1, data2) {
//    // TODO: Implement your MIDI input handling code here.
// }

// // Called when a MIDI sysex message is received on MIDI input port 1.
// function onSysex1(data) {
// }

function flush() {
   // TODO: Flush any output to your controller here.
}

function exit() {
   blinkManager.stopAll();
   println("SMK37-Elite disconnected!");
}