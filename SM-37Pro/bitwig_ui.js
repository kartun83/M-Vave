function setup_ui(document, preferences) {
    _setup_general_settings(preferences);
    _setuo_floating_wingow(document);
}

function _setup_general_settings(preferences){
    const debugSetting = preferences.getBooleanSetting("Enable Debug Logging", "General", false);
    debugSetting.addValueObserver((newValue) => {
        CONFIG.DEBUG = newValue;
        host.println(`Debug mode is now ${CONFIG.DEBUG ? "ON" : "OFF"}`);
    });
}

function _setuo_floating_wingow(document){
    const modeSetting = document.getEnumSetting(
        "Controller Mode", "Mode Switching",
        [MODES.REC, MODES.ARRANGE, MODES.PERFORM], MODES.REC
    );
    // modeSetting.addValueObserver((newValue) => {
    //     currentMode = newValue;
    //     host.showPopupNotification(`Mode: ${currentMode}`);
    //     log(`--- Switched to mode: ${currentMode} ---`);
    // });
}