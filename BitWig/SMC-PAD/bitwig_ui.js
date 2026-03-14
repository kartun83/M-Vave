

function setup_ui(document, preferences) {

    _setup_general_settings(preferences);
    _setUpfloating_window(document);
    printDebugInfo("[setup_ui] : completed");
}

function _setup_general_settings(preferences){
    const debugSetting = preferences.getBooleanSetting("Enable Debug Logging", "Debug", CONFIG.DEBUG);
    debugSetting.addValueObserver((newValue) => {
        CONFIG.DEBUG = newValue;
        printDebugInfo(`Debug mode is now ${CONFIG.DEBUG ? "ON" : "OFF"}`);
    });

    const logMidiSetting = preferences.getBooleanSetting("Log midi messages", "Debug", CONFIG.DEBUG);
    logMidiSetting.addValueObserver((newValue) => {
        CONFIG.LOG_MIDI_MESSAGES = newValue;
        printDebugInfo(`Midi logging mode is now ${CONFIG.LOG_MIDI_MESSAGES? "ON" : "OFF"}`);
    });

    const enableProfiling = preferences.getBooleanSetting("Enable profiling", "Debug", CONFIG.PROFILE);
    enableProfiling.addValueObserver((newValue) => {
        CONFIG.PROFILE = newValue;
        printDebugInfo(`Midi logging mode is now ${CONFIG.PROFILE ? "ON" : "OFF"}`);
        updateProfilerEnabled(newValue);
    });

    const rewindAmount = preferences.getNumberSetting("Rewind/forward amount", "General", 0.1, 32.0, 0.1, 'beats', 4.0)
    rewindAmount.addValueObserver((newValue) => {
        CONFIG.rewindAmount = newValue;
        printDebugInfo(`Rewind amount is now ${CONFIG.rewindAmount}`);
    });

    const fineScaling = preferences.getNumberSetting("Finetune scaling factor", "General", 0.001, 0.999, 0.005, '', 0.250)
    fineScaling.addValueObserver((newValue) => {
        CONFIG.FINE_SCALING = newValue;
        printDebugInfo(`Finescaling amount is now ${CONFIG.FINE_SCALING}`);
    });

    const cycleThroughParams = preferences.getBooleanSetting("Cycle through params", "General", CONFIG.cycleThroughParams);
    cycleThroughParams.addValueObserver((newValue) => {
        CONFIG.cycleThroughParams = newValue;
        printDebugInfo(`Cycle through params is now ${CONFIG.cycleThroughParams ? "ON" : "OFF"}`);
    });
}

function _setUpfloating_window(document){
    const modeSetting = document.getEnumSetting(
        "Controller Mode", "Mode Switching",
        [MODES.PRODUCTION, MODES.PERFORM, MODES.DEVICE], MODES.PRODUCTION
    )

    modeSetting.addValueObserver(newValue => {
        //globalState.modeSetting = newValue;
        applicationState.update('modeSetting', newValue);
        //hostObjects.application.update('modeSetting', newValue);
        printDebugInfo(`Changed mode to ${applicationState.modeSetting.modeSetting}`); }
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