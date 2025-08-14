let pluginMappings = {};
let currentPluginName = null;
let currentPluginMapping = null;

let presetNextNote = null;
let presetPrevNote = null;

function notifyMappingChange(pluginName) {
    if (pluginName) {
        host.showPopupNotification(`Controller mapping switched to: ${pluginName}`);
    } else {
        host.showPopupNotification(`No mapping for current device`);
    }
}

function applyMappingForPlugin(name) {
    currentPluginName = name || null;
    currentPluginMapping = pluginMappings[name] || null;

    if (currentPluginMapping) {
        presetNextNote = currentPluginMapping.presetNext || null;
        presetPrevNote = currentPluginMapping.presetPrev || null;
    } else {
        presetNextNote = null;
        presetPrevNote = null;
    }
    notifyMappingChange(currentPluginMapping ? currentPluginName : null);
}

function switchToNextPreset(pluginName) {
    host.showPopupNotification(`Next preset requested for ${pluginName}`);
    // TODO: Implement plugin-specific sysex or MIDI CC to switch presets
}

function switchToPrevPreset(pluginName) {
    host.showPopupNotification(`Previous preset requested for ${pluginName}`);
    // TODO: Implement plugin-specific sysex or MIDI CC to switch presets
}