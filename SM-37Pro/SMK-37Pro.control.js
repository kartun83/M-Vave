loadAPI(24);

load("config.js");
load("smk37_pads.js");
load("smk37_keys.js");
load("smk37_keybindings.js");
load("smk37_lcd.js");
load("smk37_observers.js");
load("blink_manager.js")

// Remove this if you want to be able to use deprecated methods without causing script to stop.
// This is useful during development.
host.setShouldFailOnDeprecatedUse(true);

host.defineController("M-Vave", "SMK-37Pro", "0.1", "cc250360-a340-4e07-b3d8-39af6708613c", "Kartun");

host.defineMidiPorts(2, 1);

// Define the range of our CCs (now from config)
// const CC_RANGE_HI = CONFIG.CC_RANGE_HI;
// const CC_RANGE_LO = CONFIG.CC_RANGE_LO;

const platformString = host.getPlatformType().toString();

var blinkManager = new BlinkManager();

// println(`platform string: "${platformString}"`);

// Use the PlatformType enum directly
switch (platformString) {
   case "WINDOWS":
      println("Windows platform detected");
      break;
   case "MAC":
      println("Mac platform detected");
      break;
   case "LINUX":
      println("Linux platform detected");
      break;
   default:
      println(`!!Unknown platform detected: "${platformString}"`);
      break;
}

// Global variables
let noteInput;
let padInput;
let transport;

// Initialize the controller
function init() {
   printDebugInfo('Starting init');
   // Create debug controls for GUI
   //createDebugControls();
   application = host.createApplication();
   // cursorDevice = host.createCursorDevice();
	// cursorTrack = host.createCursorTrackDevice();
    // Create popup browser for devices, show 8 results, with preview
    var browser = host.createPopupBrowser();

   // 1. Get the cursor track and device (Tracking VST)
   const cursorTrack = host.createCursorTrack(0, 0);
   const cursorDevice = cursorTrack.createCursorDevice();
   
    // Input for keys
   const midiInPort = host.getMidiInPort(0);
   printDebugInfo('Opened Keys MIDI Port');
   // Imput for PADS
   const midiInPort2 = host.getMidiInPort(1);
   printDebugInfo('Opened Pads commands MIDI Port');
   
   // Set up MIDI callback
   midiInPort.setMidiCallback(onMidiPortKeysMessage);
   midiInPort2.setMidiCallback(onMidiPortPadMessage);
   
   //Sends Notes to Bitwig, with no input filters.
   noteInput = midiInPort.createNoteInput("Notes");
   noteInput.setShouldConsumeEvents(false);

   padsInput = midiInPort.createNoteInput("Pads");
   padsInput.setShouldConsumeEvents(false);

   transport = host.createTransport();
   // Set up transport observers
   setupTransportObservers();
   setupPluginsObservers(cursorTrack, cursorDevice);

   // Show initial status
   // clearLCD();
   showStatus();
}

// Handle MIDI messages


// Flush output to controller
function flush() {
   // TODO: Flush any output to your controller here.
   // println("Flush called");
}

// Cleanup when controller is disconnected
function exit() {
   blinkManager.stopAll();
   println("SMK-37Pro disconnected!");
}