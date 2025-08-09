// Transport observers for SMK-37Pro controller
// This file contains observer setup functions for transport state changes

var transportInfo = {
    isRecording: false,
    isPlaying: false,
    isPaused: false,
    playbackPosition: 0.0
}
// let playbackPosition;
function setupTransportObservers() {
   // Observer for recording state changes
   transport.isArrangerRecordEnabled().addValueObserver(function(on){
      transportInfo.isRecording = on; 
      sendNoteOn(0, TRANSPORT.RECORD, on ? 127 : 0);
   });
   
   // Observer for play/pause state changes
   transport.isPlaying().addValueObserver(function(on){
      transportInfo.isPlaying = on; 
      sendNoteOn(0, TRANSPORT.PLAY, on ? 127 : 0);
    //   sendNoteOn(0, TRANSPORT.PAUSE, on ? 0 : 127);
   });

   // Observer for play/pause state changes
   transport.getPosition().addValueObserver(function(on){
      transportInfo.playbackPosition = on; 
    //   println('Playback pos:' + transportInfo.playbackPosition);
    // sendNoteOn(0, TRANSPORT.PLAY, on ? 127 : 0);
  //   sendNoteOn(0, TRANSPORT.PAUSE, on ? 0 : 127);
 });
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