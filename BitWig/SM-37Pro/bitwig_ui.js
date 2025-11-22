function setup_ui(document, preferences) {
    _setup_general_settings(preferences);
    _setUpfloating_window(document);
}

function _setup_general_settings(preferences){
    const debugSetting = preferences.getBooleanSetting("Enable Debug Logging", "General", CONFIG.DEBUG);
    debugSetting.addValueObserver((newValue) => {
        CONFIG.DEBUG = newValue;
        host.println(`Debug mode is now ${CONFIG.DEBUG ? "ON" : "OFF"}`);
    });

    const logMidiSetting = preferences.getBooleanSetting("Log midi messages", "General", CONFIG.DEBUG);
    logMidiSetting.addValueObserver((newValue) => {
        CONFIG.LOG_MIDI_MESSAGES = newValue;
        host.println(`Midi logging mode is now ${CONFIG.LOG_MIDI_MESSAGES? "ON" : "OFF"}`);
    });
}

function _setUpfloating_window(document){
    const modeSetting = document.getEnumSetting(
        "Controller Mode", "Mode Switching",
        [MODES.REC, MODES.ARRANGE], MODES.REC
    )

    modeSetting.addValueObserver(newValue => {
        globalState.modeSetting = newValue;
        printDebugInfo(`Changed mode to ${globalState.modeSetting}`); }
    );

    // uControl = host.createUserControls(16);
    // const Knobs1 = [7, 74, 71, 76, 77, 93, 73, 75];
    // const Knobs2 = [114, 18, 19, 16, 17, 91, 79, 72];
    // for (let i = 0; i < 8; i++) {
    //     uControl.getControl(i).setLabel("CC " + Knobs1[i])
    //     uControl.getControl(i + 8).setLabel("CC " + Knobs2[i])
    // }

    // document.getSignalSetting('Debug', 'General', CONFIG.DEBUG);
    // const d2 = new SettableBooleanValue(modeSetting);
    // document.getBooleanSettingForValue('Debug', 'General', SettableBooleanValue(modeSetting));

    // for (let i = 1; i < PLUGIN_SETTINGS.BOARD_SETTINGS.KNOBS; i++) {
    //     document.getNumberSetting(`Knob ${i}`, 'KNOB', 0, 127, 1, '', 0);
    //
    // }
    // modeSetting.addValueObserver((newValue) => {
    //     currentMode = newValue;
    //     host.showPopupNotification(`Mode: ${currentMode}`);
    //     log(`--- Switched to mode: ${currentMode} ---`);
    // });
}