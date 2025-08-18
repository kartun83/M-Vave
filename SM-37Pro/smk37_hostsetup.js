// setupHost.js
function setupHostObjects(host) {
    const application = host.createApplication();
    const browser = host.createPopupBrowser();

    const cursorTrack = host.createCursorTrack(0, 0);
    const cursorDevice = cursorTrack.createCursorDevice();
    const transport = host.createTransport();
    const notificationSettings = host.getNotificationSettings();

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
