// setupHost.js
function setupHostObjects(host, trackState, masterTrackState) {
    const application = host.createApplication();
    const browser = host.createPopupBrowser();
    const transport = host.createTransport();
    const notificationSettings = host.getNotificationSettings();
    const document = host.getDocumentState();
    const preferences = host.getPreferences();

    const surface = host.createHardwareSurface();


    // const cursorTrack = host.createCursorTrack(CONFIG.numSendPages, 0);
    const cursorTrack = host.createCursorTrack(CONFIG.numSendPages, 0);
    const cursorDevice = cursorTrack.createCursorDevice();
    // const primaryInstrument = cursorTrack.getPrimaryInstrument();
    const remoteControls = cursorDevice.createCursorRemoteControlsPage(CONFIG.numKnobParams);
    // const parameterBank = cursorDevice.createParameterBank(CONFIG.numKnobParams);



    const masterTrack = host.createMasterTrack(0);
    // In docs it's TrackBank createMainTrackBank(int numTracks,
    //  int numSends,
    //  int numScenes,
    //  boolean hasFlatTrackList) but it crashes with 4 params
    const trackBank = host.createMainTrackBank(CONFIG.TRACK_BANK_SIZE, CONFIG.numSendPages, 99);
    trackBank.setChannelScrollStepSize(1);

    const arranger = host.createArranger();
    const cueBank  = arranger.createCueMarkerBank(CONFIG.CUE_BANK_SIZE);
    const sendBank = cursorTrack.sendBank();

    const cursorBrowserResult = browser.resultsColumn().createCursorItem();
    const cursorBrowserCategory = browser.categoryColumn().createCursorItem();
    const cursorBrowserTag = browser.tagColumn().createCursorItem();
    const cursorBrowserCreator = browser.creatorColumn().createCursorItem();
    const cursorBrowserSmartCollection = browser.smartCollectionColumn().createCursorItem();
    const cursorBrowserDevice = browser.deviceTypeColumn().createCursorItem();

    _markTrackBankProperties(trackBank);
    _markInterestedValues(transport);
    _markCursorTrackValues(cursorTrack, trackState);
    _markMasterTrackValues(masterTrack, masterTrackState);
    _markDeviceTrackValues(cursorDevice);
    _markRemoteControls(remoteControls, CONFIG.numKnobParams);
    _markSends(sendBank);
    _markBrowser(browser, cursorBrowserResult);



    return {
        application,
        browser,
        cursorTrack,
        cursorDevice,
        transport,
        notificationSettings,
        document,
        preferences,
        surface,
        masterTrack,
        trackBank,
        arranger,
        remoteControls,
        cursorBrowserResult,
        browser_columns: {
            cursorBrowserCategory,
            cursorBrowserTag,
            cursorBrowserCreator,
            cursorBrowserSmartCollection,
            cursorBrowserDevice
        },
        cueBank

        //sendBank
        // primaryInstrument
        //parameterBank
    };
}

function _check_config(CONFIG){
    if (CONFIG.numSendPages < 4) CONFIG.numSendPages = 4;
}

// midi.js
function setupMidiPorts(host, onKeys, onOtherControls) {
    const midiInKeys = host.getMidiInPort(0);
    midiInKeys.setMidiCallback(onKeys);

    const midiInPads = host.getMidiInPort(1);
    midiInPads.setMidiCallback(onOtherControls);

    const noteInputKeys = midiInKeys.createNoteInput("Notes");
    noteInputKeys.setShouldConsumeEvents(false);

    const noteInputPads = midiInKeys.createNoteInput("Pads");
    noteInputPads.setShouldConsumeEvents(false);
    // noteInputPads.

    // const noteInputKnobs = midiInKeys.createNoteInput("Knobs");
    // noteInputKnobs.setShouldConsumeEvents(false);

    return {
        midiInKeys,
        midiInPads,
        bindKnob(cc, target) {
            midiInKeys.bindControlChange(0, cc, target);
        },
        bindPad(note, callback) {
            midiInPads.bindNoteOn(0, note, callback);
        }
    };
}