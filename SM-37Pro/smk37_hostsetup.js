// setupHost.js
function setupHostObjects(host) {
    const application = host.createApplication();
    const browser = host.createPopupBrowser();

    const cursorTrack = host.createCursorTrack(0, 0);
    const cursorDevice = cursorTrack.createCursorDevice();
    const transport = host.createTransport();
    const notificationSettings = host.getNotificationSettings();

    const masterTrack = host.createMasterTrack(0);
    const trackBank = host.createMainTrackBank(8, CONFIG.numSendPages, 99);

    _markTrackBankProperties(trackBank);

    const document = host.getDocumentState();
    const preferences = host.getPreferences();

    const surface = host.createHardwareSurface();

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
    };
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
    }
}