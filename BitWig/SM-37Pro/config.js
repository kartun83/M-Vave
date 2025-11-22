const PLUGIN_SETTINGS = {
    VERSION: '0.4',
    VENDOR: 'M-Vave',
    BOARD: 'SMK-37Pro',
    AUTHOR: 'kartun83',
    UUID: 'cc250360-a340-4e07-b3d8-39af6708613c',
    SUPPORT: 'https://github.com/kartun83/M-Vave',
    BOARD_SETTINGS: {
        INS: 2,
        OUTS: 1,
        KNOBS: 8,
        FADERS: 4
    }
}

// Shared configuration for SMK-37Pro controller scripts
const CONFIG = {
    DEBUG: true,
    // KNOBS_RANGE_HI: 55,
    // CC_RANGE_LO: 48,
    MIDI_CHANNEL_PADS: 10,
    MIDI_CHANNEL_KEYS: 1,
    LOG_MIDI_MESSAGES: true,
    // SHOW_STATUS: true,
    BLINK_INTERVAL: 250,
    SHOW_STATUS: true,
    numSendPages: 5,
};

const led_state = {
    off: 0,
    on: 127,
}

const MODES = {
    REC: "8 Track Rec",
    ARRANGE: "Arrangement",
    // PERFORM: "Perform",
};


const MESSAGE_TYPES = {
    0x80: "Note Off",
    0x90: "Note On",
    0xA0: "Poly Pressure",
    0xB0: "CC",
    0xC0: "Program Change",
    0xD0: "Channel Pressure",
    0xE0: "Pitch Bend"
};

// Debug controls for GUI
// let debugControls = null;

// Simple console debug toggle function
// function toggleDebug() {
//     CONFIG.DEBUG = !CONFIG.DEBUG;
//     println("Debug mode: " + (CONFIG.DEBUG ? "ON" : "OFF"));
// }

function toggleMidiLogging() {
    CONFIG.LOG_MIDI_MESSAGES = !CONFIG.LOG_MIDI_MESSAGES;
    println("MIDI logging: " + (CONFIG.LOG_MIDI_MESSAGES ? "ON" : "OFF"));
}

// Helper function to log MIDI messages
function logMidiMessage(port, status, data1, data2, opt="") {
    if (!CONFIG.LOG_MIDI_MESSAGES) return;

    const channel = (status & 0x0F) + 1;
    const messageType = status & 0xF0;
    const messageTypeStr = MESSAGE_TYPES[messageType] || "Unknown";

    // if (!opt) {opt = "";}

    println(`[MIDI ${port}] Ch:${channel} Type:${messageTypeStr}, ${messageType}; Data1:${data1} Data2:${data2} ${opt}`);
}

// Status display function
function showStatus() {
    if (!CONFIG.SHOW_STATUS) return;

    println("=== SMK-37Pro Controller Status ===");
    println("Debug Mode: " + (CONFIG.DEBUG ? "ON" : "OFF"));
    println("MIDI Message Logging: " + (CONFIG.LOG_MIDI_MESSAGES ? "ON" : "OFF"));
    println("Status Display: " + (CONFIG.SHOW_STATUS ? "ON" : "OFF"));
    println("MIDI Channel Pads: " + CONFIG.MIDI_CHANNEL_PADS);
    println("MIDI Channel Keys: " + CONFIG.MIDI_CHANNEL_KEYS);
    // println("CC Range: " + CONFIG.CC_RANGE_LO + " - " + CONFIG.CC_RANGE_HI);
    println("Platform: " + host.getPlatformType().toString());
    println("API Version: " + host.getHostApiVersion());
    println("Product: " + host.getHostProduct() + " " + host.getHostVersion());
    println("===================================");
}

function printDebugInfo(text, show_popup = false) {
    if (CONFIG.DEBUG){
        println(text);
    }

    if (show_popup) {
        host.showPopupNotification(text);
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// function createDebugControls() {
//     if (debugControls) return debugControls;
//
//     try {
//         // Create user controls for debug settings
//         debugControls = host.createUserControls(5);
//
//         // Debug toggle
//         const debugToggle = debugControls.getControl(0);
//         debugToggle.setLabel("Debug Mode");
//         debugToggle.setValueRange(0, 1, 1); // 0 or 1, step 1
//
//         // MIDI Message Logging
//         const midiLogging = debugControls.getControl(1);
//         midiLogging.setLabel("Log MIDI Messages");
//         midiLogging.setValueRange(0, 1, 1);
//
//         // Show Status
//         const showStatus = debugControls.getControl(2);
//         showStatus.setLabel("Show Status");
//         showStatus.setValueRange(0, 1, 1);
//
//         // MIDI Channel Pads
//         const midiChannelPads = debugControls.getControl(3);
//         midiChannelPads.setLabel("MIDI Channel Pads");
//         midiChannelPads.setValueRange(1, 16, 1);
//
//         // MIDI Channel Keys
//         const midiChannelKeys = debugControls.getControl(4);
//         midiChannelKeys.setLabel("MIDI Channel Keys");
//         midiChannelKeys.setValueRange(1, 16, 1);
//
//         // Set up value change callbacks
//         debugToggle.addValueObserver(function(value) {
//             CONFIG.DEBUG = (value === 1);
//             if (CONFIG.DEBUG) {
//                 println("Debug mode enabled");
//             } else {
//                 println("Debug mode disabled");
//             }
//         });
//
//         midiLogging.addValueObserver(function(value) {
//             CONFIG.LOG_MIDI_MESSAGES = (value === 1);
//             if (CONFIG.DEBUG) {
//                 println("MIDI message logging: " + (CONFIG.LOG_MIDI_MESSAGES ? "enabled" : "disabled"));
//             }
//         });
//
//         showStatus.addValueObserver(function(value) {
//             CONFIG.SHOW_STATUS = (value === 1);
//             if (CONFIG.DEBUG) {
//                 println("Status display: " + (CONFIG.SHOW_STATUS ? "enabled" : "disabled"));
//             }
//         });
//
//         midiChannelPads.addValueObserver(function(value) {
//             CONFIG.MIDI_CHANNEL_PADS = Math.floor(value);
//             if (CONFIG.DEBUG) {
//                 println("MIDI Channel Pads changed to: " + CONFIG.MIDI_CHANNEL_PADS);
//             }
//         });
//
//         midiChannelKeys.addValueObserver(function(value) {
//             CONFIG.MIDI_CHANNEL_KEYS = Math.floor(value);
//             if (CONFIG.DEBUG) {
//                 println("MIDI Channel Keys changed to: " + CONFIG.MIDI_CHANNEL_KEYS);
//             }
//         });
//
//         println("Debug controls created successfully");
//
//     } catch (error) {
//         println("Error creating debug controls: " + error.message);
//         println("Using console-only debug mode. Call toggleDebug() to switch debug on/off");
//         // Fallback to console-only debug
//         CONFIG.DEBUG = true;
//     }
//
//     return debugControls;
// }



