// Transport observers for SMK-37Pro controller
// This file contains observer setup functions for transport state changes

const transportInfo = {
    isRecording: false,
    isPlaying: false,
    isPaused: false,
    isMetronomeEnabled: false,
    metronome_ticks: false,
    isPrerollEnabled: false,
    playbackPosition: 0.0
};

const appInfo = {
    canUndo: false,
    canRedo: false,
}

// let playbackPosition;
function setupTransportObservers(transport_obj) {
   // Observer for recording state changes
    transport_obj.isArrangerRecordEnabled().addValueObserver(function(on){
      transportInfo.isRecording = on;
      // println('Enabling record pad !!!!!');
      sendNoteOn(0, PADS.RECORD, on ? led_state.on : led_state.off);
   });
   
   // Observer for play/pause state changes
    transport_obj.isPlaying().addValueObserver(function(on){
      transportInfo.isPlaying = on;
       println('Enabling playing pad');
      sendNoteOn(0, PADS.PLAY, on ? led_state.on : led_state.off);
    //   sendNoteOn(0, TRANSPORT.PAUSE, on ? 0 : 127);
   });

   // Observer for play/pause position
    transport_obj.getPosition().addValueObserver(function(position){
      transportInfo.playbackPosition = position;
    //   println('Playback pos:' + transportInfo.playbackPosition);
    // sendNoteOn(0, TRANSPORT.PLAY, on ? 127 : 0);
  //   sendNoteOn(0, TRANSPORT.PAUSE, on ? 0 : 127);
 });



    transport_obj.isMetronomeEnabled().addValueObserver(function(on){
        transportInfo.isMetronomeEnabled = on;
        //   println('Playback pos:' + transportInfo.playbackPosition);
        // sendNoteOn(0, TRANSPORT.PLAY, on ? 127 : 0);
        //   sendNoteOn(0, TRANSPORT.PAUSE, on ? 0 : 127);
    });

    transport_obj.isMetronomeTickPlaybackEnabled().addValueObserver(function(on){
        transportInfo.isMetronomeEnabled = on;
        //   println('Playback pos:' + transportInfo.playbackPosition);
        // sendNoteOn(0, TRANSPORT.PLAY, on ? 127 : 0);
        //   sendNoteOn(0, TRANSPORT.PAUSE, on ? 0 : 127);
    });

    transport_obj.preRoll().addValueObserver(function(value){
        transportInfo.isPrerollEnabled = value;
        //   println('Playback pos:' + transportInfo.playbackPosition);
        // sendNoteOn(0, TRANSPORT.PLAY, on ? 127 : 0);
        //   sendNoteOn(0, TRANSPORT.PAUSE, on ? 0 : 127);
    });

    // transport.isMetronomeAudibleDuringPreRoll().addValueObserver(function(on){
    //     transportInfo.playbackPosition = on;
    //     //   println('Playback pos:' + transportInfo.playbackPosition);
    //     // sendNoteOn(0, TRANSPORT.PLAY, on ? 127 : 0);
    //     //   sendNoteOn(0, TRANSPORT.PAUSE, on ? 0 : 127);
    // });

}


function setupPluginsObservers(cursorTrack, cursorDevice){
  cursorDevice.presetName().addValueObserver(function(presetName){
        println(`Selected preset: ${presetName}`);
    });
  
  cursorTrack.addIsSelectedInEditorObserver(function(isSelected) {
      println(`Selected preset: ${isSelected}`);
      // if (isSelected) updateDeviceInfo(cursorDevice);
      println(`Device: ${cursorDevice.name()} ${cursorDevice.deviceType()}`)
  });
  
  cursorDevice.isPlugin().addValueObserver(function(isPlugin) {
      println(`Selected is plugin ${isPlugin}`);
      // updateDeviceInfo(cursorDevice);
  });
  
  cursorDevice.deviceType().addValueObserver(function(deviceType) {
      println(`Selected device type ${deviceType}`);
      // updateDeviceInfo(cursorDevice);
  });
  
  cursorDevice.name().addValueObserver(function(deviceName) {
      println(`Selected device name ${deviceName}`);
      // updateDeviceInfo(cursorDevice);
  });
  
  cursorDevice.presetName().addValueObserver(function(presetName) {
      println(`Selected preset name ${presetName}`);
      // updateDeviceInfo(cursorDevice);
  });
  
  //cursorDevice.addPresetNameObserver(46, "-", function(name)
  //{
//	writeToDisplay(DISPLAY_PAGES.DEVICE_PRESETS, 0, 0, "  preset: " + name, 56);
  //});

  //cursorDevice.presetCategory.addValueObserver(function(category)
  //{
  //	println(`Selected preset category ${category}`);
	// writeToDisplay(DISPLAY_PAGES.DEVICE_PRESETS, 1, 0, "category: " + category, 32);
  //});

  //cursorDevice.presetCreator.addValueObserver(function(creator)
  //{
//	println(`Selected preset creator ${creator}`);
	// writeToDisplay(DISPLAY_PAGES.DEVICE_PRESETS, 1, 31, " creator: " + creator, 24);
  //});  
  

}

function setupApplicationObservers(application){
    application.canUndo().addValueObserver(function(on){
        appInfo.canUndo = on;
        sendNoteOn(0, PADS.UNDO, on ? led_state.on : led_state.off);
    });

    application.canRedo().addValueObserver(function(on){
        appInfo.canRedo = on;
    });
}

// function updateDeviceInfo(device) {
//   // // Mark parameters as interested
//   // device.name().markInterested();
//   // device.deviceType().markInterested();
  
//   // Get current values
//   device.name().addValueObserver(function(name) {
//       device.deviceType().get(function(type) {
//           // Parse vendor/plugin info
//           const vendorMatch = type.match(/\((.*?)\)/);
//           const vendor = vendorMatch ? vendorMatch[1] : "Unknown";
          
//           println(`Selected Plugin: ${name} | Vendor: ${vendor}`);
//           // Send to controller display here if needed
//       });
//   });
// }
