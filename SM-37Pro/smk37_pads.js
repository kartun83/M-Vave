let shiftButton = null;

function onMidiPortPadMessage(status, data1, data2) {
    // Use the new logging function
    logMidiMessage("Pads", status, data1, data2, `Shift state: ${globalState.isShiftPressed}`);

   // println(`ShiftState: ${globalState.isShiftPressed}, ${shiftButton.isPressed().get()}`);
}

function setupShiftButton(surface, port){
    // Define a hardware button for Shift (note 71 on channel 10)
    shiftButton = surface.createHardwareButton("SHIFT"); //createNoteOnButton(71, 9); // channel 10 → index 9
    shiftButton.isPressed().markInterested();
    println(`Setup shift button: ${shiftButton.isPressed().get()}`);
     shiftButton.pressedAction().setActionMatcher(port.createCCActionMatcher(SHIFT.CHANNEL-1, SHIFT.KEY, led_state.on));
     shiftButton.releasedAction().setActionMatcher(port.createCCActionMatcher(SHIFT.CHANNEL-1, SHIFT.KEY, led_state.off));

    shiftButton.setLabel("Shift");
    shiftButton.isPressed().addValueObserver(function(){
        globalState.isShiftPressed = shiftButton.isPressed().getAsBoolean();
        printDebugInfo(`Shift state: ${globalState.isShiftPressed}`);
    })
}

function _pads_8track(status, data1, data2){

}

function _pads_arranger(status, data1, data2){
// Check button presses (but not releases) in here
    // All pads toggling implemented in observers
    if (data2 > 0){
        // Cancel blinking if not in paused state
        if (!transportInfo.isPaused) {
            blinkManager.stopBlinking(PADS.PAUSE);
        }
        switch (data1) {
            case PADS.PLAY: // Play
                            // isPlaying = transport.isPlaying();
                            // println('Playing:', isPlaying);
                            // sendNoteOn(0, TRANSPORT.PLAY, isPlaying ? 127 : 0);
                            // sendNoteOn(0, TRANSPORT.STOP, isPlaying ? 0 : 127);
                transport.togglePlay();
                // transportInfo.isPaused = !transportInfo.isPlaying;

                break;
            case PADS.PAUSE: // Pause
                // transport.stop();
                // pos = transport.getPosition().get();
                // println('Position:' + pos);
                // transport.setPosition();
                transportInfo.isPaused = !transportInfo.isPaused;
                if (transportInfo.isPaused){
                    // startBlinking(TRANSPORT.PAUSE, CONFIG.BLINK_INTERVAL);
                    blinkManager.startBlinking(PADS.PAUSE, CONFIG.BLINK_INTERVAL);
                }
                else{
                    // stopBlinking(TRANSPORT.PAUSE);
                    blinkManager.stopBlinking(PADS.PAUSE);
                }
                transport.continuePlayback();
                break;
            case PADS.RECORD: // Record
                // isRecording = transport.isArrangerRecordEnabled().get();
                // f(0, TRANSPORT.RECORD, on ? 127 : 0);
                if (!transportInfo.isRecording)
                {
                    printDebugInfo('Starting recording');
                    transport.record();
                    // sendNoteOn(0, PADS.RECORD, led_state.on);
                    // transportInfo.isPaused = !transportInfo.isPlaying;
                }
                else
                {
                    printDebugInfo('Stopping recording');
                    transport.stop();
                }
                break;
            case PADS.REWIND: // Back (rewind)
                transport.rewind();
                break;
            case PADS.FASTFORWARD: // Forward (fast-forward)
                transport.fastForward();
                break;
            case PADS.PREV_MARKER: // Previous (clip/marker)
                transport.jumpToPreviousCueMarker();
                break;
            case PADS.NEXT_MARKER: // Next (clip/marker)
                transport.jumpToNextCueMarker();
                break;
            case PADS.UNDO:
                if (hostObjects.application.canUndo()) {
                    printDebugInfo("trying to sysex");
                    //sendSysex("F0 00 32 09 59 00 00 40 02 4D 5E 04 00 30 00 00 00 00 00 7C 5F 07 F7");
                    //sendSysex("F0 00 32 09 59 00 00 40 02 4D 5E 04 00 30 00 00 00 00 7E 03 58 07 F7");
                    // const SYSEX_HDR = "f0 00 00 66 14";
                    // for ( var i = 0; i < 8; i++)
                    // {
                    //     //sendChannelPressure(0, 0 + (i << 4)); // resets the leds (and vu-meters on the display?)
                    //     sendSysex(SYSEX_HDR + "20 0" + i + "01 f7");
                    // }
                    printDebugInfo('Doing undo');
                    hostObjects.application.undo();
                }
                else{
                    host.showPopupNotification('Nothing to undo');
                }
        }
        printDebugInfo("Pad MIDI Message processed");
    }
    else
    {
        printDebugInfo(`Ignoring keyrelease ${status}, ${data1}`)
    }
}

// Obsolete. Code for CC toggle mode

// const onMidiPort1Message = (status, data1, data2) => {
//     println(`MIDI Port 1 Message: ${status} ${data1} ${data2}`);
 
//    const channel = status & 0xF0; // Extract message type
//    const ccNum = data1; // CC number (pad ID)
 
//    // Handle Channel 10 messages (MCP pads)
//    if (channel === 10 && statusType === 0xB0) { // CC on Channel 10
//        handleTransportCC(data1, data2);
//     }
 
//    if (channel === 0xB0) { // CC message
//      if (data2 === 127) { // Pad pressed
//        switch (ccNum) {
//          case 20: // Pad 1
//            host.transport.record(); // Toggle recording
//            break;
//          case 21: // Pad 2
//            cursorTrack.mute().toggle(); // Mute selected track
//            break;
//          case 22: // Pad 3
//            cursorTrack.solo().toggle(); // Solo selected track
//            break;
//        }
//      }
//    }
//  };
 
//  function handleTransportCC(ccNumber, value) {
//     if (value !== 127) { println(`Transport CC:  {$ccNumber} value:  {$value}`); return; } // Only trigger on press (not release)
 
//     switch (ccNumber) {
//         case 94: // Play
//             transport.play().toggle();
//             break;
//         case 93: // Pause
//             transport.isPlaying().toggle(false);
//             break;
//         case 95: // Record
//             transport.record().toggle();
//             break;
//         case 91: // Back (rewind)
//             transport.rewind();
//             break;
//         case 92: // Forward (fast-forward)
//             transport.fastForward();
//             break;
//         case 46: // Previous (clip/marker)
//             transport.jumpToPreviousMarker();
//             break;
//         case 47: // Next (clip/marker)
//             transport.jumpToNextMarker();
//             break;
//     }
//  }

//Creates an array of user controls with the proper amount of CC#s
// userControls = host.createUserControls(CC_RANGE_HI - CC_RANGE_LO + 1);
// // Iterate over the userControls, and assign the CC# to each control. 
//  for(var i = CC_RANGE_LO; i<=CC_RANGE_HI; i ++)
// {
//    userControls.getControl(i - CC_RANGE_LO).setLabel("CC" + i);
// }

// //Creating a view onto our transport. 
//  // transport = host.createTransport();



// const hardwareSurface = host.createHardwareSurface();
// const transport = host.createTransport();

// const transportControls = [
//    {cc: 94, name: "PLAY", 
//     startAction: function() { transport.play(); },
//     stopAction: function() { transport.stop(); }},
    
//    {cc: 93, name: "PAUSE", 
//     startAction: function() { println(transport.getPosition()); transport.stop(); }},
    
//    {cc: 95, name: "REC", 
//     startAction: function() { transport.record(); },
//     stopAction: function() { transport.isArrangerRecordEnabled = false; transport.stop();}},
    
//    {cc: 91, name: "BACK", 
//     startAction: function() { transport.rewind(); }},
    
//    {cc: 92, name: "FWD", 
//     startAction: function() { transport.fastForward(); }},
    
//    {cc: 46, name: "PREV", 
//     startAction: function() { transport.jumpToPreviousCueMarker(); }},
    
//    {cc: 47, name: "NEXT", 
//     startAction: function() { transport.jumpToNextCueMarker(); }}
// ];

// // Create hardware buttons and bind actions
// transportControls.forEach(function(control) {
//    const hwButton = hardwareSurface.createHardwareButton(control.name);
   
//    // Set up MIDI matcher for START action (CC value 0)
//    hwButton.pressedAction().setActionMatcher(
//        midiInPort.createCCActionMatcher(9, control.cc, 0)
//    );
//    hwButton.pressedAction().setBinding(
//        host.createAction(
//            new java.lang.Runnable({ run: control.startAction }),
//            new java.util.function.Supplier({ get: function() { return control.name + " Start"; } })
//        )
//    );
   
//    // For controls that have stop actions (PLAY and REC)
//    if (control.stopAction) {
//        hwButton.releasedAction().setActionMatcher(
//            midiInPort.createCCActionMatcher(9, control.cc, 127)
//        );
//        hwButton.releasedAction().setBinding(
//            host.createAction(
//                new java.lang.Runnable({ run: control.stopAction }),
//                new java.util.function.Supplier({ get: function() { return control.name + " Stop"; } })
//            )
//        );
//    }
// });