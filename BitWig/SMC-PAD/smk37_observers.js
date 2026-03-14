// Transport observers for SMK-37Pro controller
// This file contains observer setup functions for transport state changes

// let playbackPosition;
function setupTransportObservers(transport_obj) {
   // Observer for recording state changes
    transport_obj.isArrangerRecordEnabled().addValueObserver(function(on){
        // transportInfo.isRecording = on;
        transportState.update("isArrangerRecordEnabled", on)

      // println('Enabling record pad !!!!!');
      // sendNoteOn(0, PADS.RECORD.note, on ? led_state.on : led_state.off);
   });
   
   // Observer for play/pause state changes
    transport_obj.isPlaying().addValueObserver(function(on){
      // transportInfo.isPlaying = on;
       transportState.update("isPlaying", on)
   });

    transport_obj.isArrangerOverdubEnabled().addValueObserver(function(on){
      // transportInfo.isArrangerOverdubEnabled = on;
       transportState.update("isArrangerOverdubEnabled", on)
   });

    transport_obj.isArrangerLoopEnabled().addValueObserver(function(on){
      // transportInfo.isArrangerLoopEnabled = on;
       transportState.update("isArrangerLoopEnabled", on)
   });

    transport_obj.isPunchInEnabled().addValueObserver(function(on){
      // transportInfo.isPunchInEnabled = on;
       transportState.update("isPunchInEnabled", on)
   });

    transport_obj.isPunchOutEnabled().addValueObserver(function(on){
      // transportInfo.isPunchOutEnabled = on;
       transportState.update("isPunchOutEnabled", on)
   });



   // Observer for play/pause position
    transport_obj.getPosition().addValueObserver(function(position){
        transportState.update("playbackPosition", position)
      // transportInfo.playbackPosition = position;
    //   println('Playback pos:' + transportInfo.playbackPosition);
    // sendNoteOn(0, TRANSPORT.PLAY, on ? 127 : 0);
  //   sendNoteOn(0, TRANSPORT.PAUSE, on ? 0 : 127);
 });



    transport_obj.isMetronomeEnabled().addValueObserver(function(on){
        // transportInfo.isMetronomeEnabled = on;
        transportState.update("isMetronomeEnabled", on)
    });

    transport_obj.isMetronomeTickPlaybackEnabled().addValueObserver(function(on){
        // transportInfo.isMetronomeTickPlaybackEnabled = on;
        transportState.update("isMetronomeTickPlaybackEnabled", on)
    });

    transport_obj.isFillModeActive().addValueObserver(function(on){
        // transportInfo.isFillModeActive = on;
        transportState.update("isFillModeActive", on)
    });

    transport_obj.preRoll().addValueObserver(function(value){
        transportState.update("preroll", value)
        // transportInfo.preroll = value;
        //   println('Playback pos:' + transportInfo.playbackPosition);
        // sendNoteOn(0, TRANSPORT.PLAY, on ? 127 : 0);
        //   sendNoteOn(0, TRANSPORT.PAUSE, on ? 0 : 127);
    });


    transport_obj.tempo().displayedValue().addValueObserver(function(value){
        // transportInfo.tempo = value;
        transportState.update("tempo", value)
        //   println('Playback pos:' + transportInfo.playbackPosition);
        // sendNoteOn(0, TRANSPORT.PLAY, on ? 127 : 0);
        //   sendNoteOn(0, TRANSPORT.PAUSE, on ? 0 : 127);
    });

    transport_obj.timeSignature().addValueObserver(function(value){
        // transportInfo.timeSignature = value;
        transportState.update("timeSignature", value)
    });

    transport_obj.timeSignature().numerator().addValueObserver(function(value){
        // transportInfo.tsNumerator = value;
        transportState.update("tsNumerator", value)
    });

    transport_obj.timeSignature().denominator().addValueObserver(function(value){
        // transportInfo.tsDenominator = value;
        transportState.update("tsDenominator", value)
    });

    transport_obj.isArrangerAutomationWriteEnabled().addValueObserver(function(on){
        // transportInfo.isArrangerAutomationWriteEnabled = on;
        transportState.update("isArrangerAutomationWriteEnabled", on)
    });

    transport_obj.playStartPosition().addValueObserver(function(position){
        // transportInfo.playStartPosition = position;
        transportState.update("playStartPosition", position)
    });

    transport_obj.automationWriteMode().addValueObserver(function(mode){
        // transportInfo.automationWriteMode = mode;
        transportState.update("automationWriteMode", mode)
    });

    transport_obj.isMetronomeAudibleDuringPreRoll().addValueObserver(function(on){
        transportState.update("isMetronomeAudibleDuringPreRoll", on)
    });

}


function setupPluginsObservers(cursorTrack, cursorDevice){
  cursorDevice.presetName().addValueObserver(function(presetName){
      printDebugInfo(`Selected preset: ${presetName}`);
    });
  
  cursorTrack.addIsSelectedInEditorObserver(function(isSelected) {
      printDebugInfo(`Selected preset: ${isSelected}`);
      // if (isSelected) updateDeviceInfo(cursorDevice);
      printDebugInfo(`Device: ${cursorDevice.name()} ${cursorDevice.deviceType()}`)
  });
  
  cursorDevice.isPlugin().addValueObserver(function(isPlugin) {
      printDebugInfo(`Selected is plugin ${isPlugin}`);
      // updateDeviceInfo(cursorDevice);
  });
  
  cursorDevice.deviceType().addValueObserver(function(deviceType) {
      printDebugInfo(`Selected device type ${deviceType}`);
      // updateDeviceInfo(cursorDevice);
  });
  
  cursorDevice.name().addValueObserver(function(deviceName) {
      printDebugInfo(`Selected device name ${deviceName}`);
      // updateDeviceInfo(cursorDevice);
  });
  
  // cursorDevice.presetName().addValueObserver(function(presetName) {
  //     printDebugInfo(`Selected preset name ${presetName}`);
  //     // updateDeviceInfo(cursorDevice);
  // });
  
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
        // appInfo.canUndo = on;
        applicationState.update("canUndo", on);
        // sendNoteOn(0, PADS.UNDO.note, on ? led_state.on : led_state.off);
    });

    application.canRedo().addValueObserver(function(on){
        // appInfo.canRedo = on;
        applicationState.update("canRedo", on);
    });

    application.recordQuantizeNoteLength().addValueObserver(function(on){
        // appInfo.recordQuantizeNoteLength = on;
        applicationState.update("recordQuantizeNoteLength", on);
        // sendNoteOn(0, PADS.UNDO.note, on ? led_state.on : led_state.off);
    });

    application.recordQuantizationGrid().addValueObserver(function(value){
        // appInfo.recordQuantizationGrid = value;
        applicationState.update("recordQuantizationGrid", value);
        // sendNoteOn(0, PADS.UNDO.note, on ? led_state.on : led_state.off);
    });


}

function _markInterestedValues(transport_obj) {
    transport_obj.isClipLauncherOverdubEnabled().markInterested();
    transport_obj.isArrangerOverdubEnabled().markInterested();

}

function _markCursorTrackValues(cursorTrack, trackState) {
    cursorTrack.name().addValueObserver(function(trackName) {
        printDebugInfo(`Selected track: ${trackName}`);
        trackState.update("name", trackName);
    });
    cursorTrack.hasPrevious().markInterested();
    cursorTrack.hasNext().markInterested();
    cursorTrack.isPinned().markInterested();

    // _bindValueSection(cursorTrack.volume(), "volume");
    bindSectionNumeric(cursorTrack.volume(), trackState, "volume", CONFIG.PARAM_RESOLUTION);
    bindSectionNumeric(cursorTrack.pan(), trackState, "pan", CONFIG.PARAM_RESOLUTION);
    // _bindValueSection(cursorTrack.pan(), "pan");

    cursorTrack.mute().addValueObserver(function(value){
        trackState.update("mute", value)
    });

    cursorTrack.solo().addValueObserver(function(value){
        trackState.update("solo", value)
    });

    cursorTrack.arm().addValueObserver(function(value){
        trackState.update("arm", value)
    });

    cursorTrack.isActivated().addValueObserver(function(value){
        trackState.update("isActivated", value)
    });
}

function _markMasterTrackValues(masterTrack, masterTrackState) {
    masterTrack.name().addValueObserver(function(trackName) {
        printDebugInfo(`Selected mastertrack: ${trackName}`);
        // deviceCommunicator.sendStringMessage(trackName);
        masterTrackState.update("name", trackName);
        // updateDeviceInfo(cursorDevice);
    });

    bindSectionNumeric(masterTrack.volume(), masterTrackState, "volume", CONFIG.PARAM_RESOLUTION);

    masterTrack.mute().addValueObserver(function(value){
        masterTrackState.update("mute", value)
    });

    masterTrack.solo().addValueObserver(function(value){
        masterTrackState.update("solo", value)
    });

    masterTrack.arm().addValueObserver(function(value){
        masterTrackState.update("arm", value)
    });

    masterTrack.isActivated().addValueObserver(function(value){
        masterTrackState.update("isActivated", value)
    });
}

function _markDeviceTrackValues(cursorDevice) {
    cursorDevice.name().addValueObserver(function(deviceName) {
        printDebugInfo(`Selected device: ${deviceName}`);
        deviceCommunicator.sendStringMessage(deviceName);
        // updateDeviceInfo(cursorDevice);
    });
    cursorDevice.hasPrevious().markInterested();
    cursorDevice.hasNext().markInterested();
    cursorDevice.deviceType().markInterested();
    cursorDevice.isEnabled().markInterested();
    cursorDevice.isExpanded().markInterested();
    cursorDevice.isPlugin().markInterested();
    cursorDevice.isWindowOpen().markInterested();
}

/**
 * Marks all important track properties as interested for a track bank
 * @param {TrackBank} trackBank - The Bitwig track bank
 */
function _markTrackBankProperties(trackBank) {
    const numTracks = trackBank.getSizeOfBank();
    for (let i = 0; i < numTracks; i++) {
        const track = trackBank.getItemAt(i);
        // Mark key properties as interested
        track.arm().markInterested();
        track.mute().markInterested();
        track.solo().markInterested();
        track.volume().markInterested();
        track.pan().markInterested();
        track.name().markInterested();
        track.exists().markInterested(); // useful if bank can scroll
        track.volume().setIndication(true);
        track.pan().setIndication(true);
        // track.getSend(0).setIndication(true);
        // track.getSend(1).setIndication(true);
    }
}

function _markRemoteControls(remoteControls, numKnobs) {
    printDebugInfo(`[_markRemoteControls] Marking remote controls: ${numKnobs}`);

    // remoteControls.parameterCount();
    remoteControls.pageCount().markInterested();
    remoteControls.pageNames().markInterested();
    remoteControls.selectedPageIndex().markInterested();
    // remoteControls.getParameterCount().markInterested();
    for (let i = 0; i < numKnobs; i++) {
        const param = remoteControls.getParameter(i);

        param.name().markInterested();
        param.value().markInterested();
        param.value().displayedValue().markInterested();
        param.discreteValueCount().markInterested();

        param.setIndication(true);
        param.setLabel("Knob " + (i + 1));

        param.name().addValueObserver(name => {
            deviceState.update(i, { name });
        });

        bindCollectionNumeric(param, deviceState, i, CONFIG.PARAM_RESOLUTION);
    }

    remoteControls.selectedPageIndex().addValueObserver(index => {
        deviceState.setPage(index);
    });

}

function _markSends(sendBank) {
    const size = sendBank.getSizeOfBank();

    for (let i = 0; i < size; i++) {
        const send = sendBank.getItemAt(i);

        send.name().markInterested();
        send.value().markInterested();
        send.displayedValue().markInterested();
        send.exists().markInterested();

        send.name().addValueObserver(name => {
            sendState.update(i, { name });
        });

        bindCollectionNumeric(send, sendState, i, CONFIG.PARAM_RESOLUTION);

        send.exists().addValueObserver(exists => {
            sendState.update(i, { exists });
        });
    }
}

function _markBrowser(browser, browserCursor) {
    browser.exists().addValueObserver(function(on){
        browserState.update("browserActive", on );
    });

    browser.title().addValueObserver(function(value){
        browserState.update("title", value );
    });

    browser.shouldAudition().addValueObserver(function(on){
        browserState.update("shouldAudition", on );
    });

    browser.canAudition().addValueObserver(function(on){
        browserState.update("canAudition", on );
    });

    browser.selectedContentTypeIndex().addValueObserver(function(idx){
        browserState.update("selectedContentTypeIndex", idx );
    });

    browser.selectedContentTypeName().addValueObserver(function(name){
        browserState.update("selectedContentTypeName", name );
    });

    browserCursor.name().addValueObserver(function(value){
        browserState.update("browserSelectedItem", value);
    });
}


function bindCollectionNumeric(apiObj, state, index, resolution = CONFIG.PARAM_RESOLUTION) {
    apiObj.value().addValueObserver(resolution, v =>
        state.update(index, { valueNorm: v })
    );

    apiObj.displayedValue().addValueObserver(text =>
        state.update(index, { valueText: text })
    );
}

function bindSectionNumeric(apiObj, state, section, resolution = CONFIG.PARAM_RESOLUTION) {
    apiObj.value().addValueObserver(resolution, v =>
        state.updateSection(section, { valueNorm: v })
    );

    apiObj.displayedValue().addValueObserver(text =>
        state.updateSection(section, { valueText: text })
    );
}