const PLUGIN_SETTINGS = {
    VERSION: '0.4',
    VENDOR: 'M-Vave',
    BOARD: 'SMC-PAD',
    AUTHOR: 'kartun83',
    UUID: '83e1e25f-e682-4c02-8826-da5a0e4cb9c9',
    SUPPORT: 'https://github.com/kartun83/M-Vave',
    BOARD_SETTINGS: {
        NAME: "SMC-PAD",
        SCREEN_ADDRESS: 0x40,
        //MIDI_INS_COUNT: 3,
        //MIDI_OUTS_COUNT: 3,
        INS: {
            midi_ports_count: 3,
            master: {
                index: 0,
                enabled: true,
                name: "master"
            },
            private: {
                index: 1,
                enabled: false,   // 👈 disable noisy port
                name: "private"
            },
            port3: {
                index: 2,
                enabled: false,
                name: "unknown"
            }
        },

        OUTS: {
            midi_ports_count: 3,
            master: {
                index: 0,
                enabled: true
            },
            private: {
                index: 1,
                enabled: true
            },
            port3: {
                index: 2,
                enabled: true
            }
        },
        KNOBS: 8,
        FADERS: 0
    }
}

// Shared configuration for SMK-37Pro controller scripts
const CONFIG = {
    DEBUG: true,
    // KNOBS_RANGE_HI: 55,
    // CC_RANGE_LO: 48,
    // Max amount value, for proper RAW->Param scaling
    PARAM_RESOLUTION: 128,
    FINE_SCALING: 0.2,
    MIDI_CHANNEL_PADS: 10,
    MIDI_CHANNEL_KEYS: 1,
    LOG_MIDI_MESSAGES: true,
    // SHOW_STATUS: true,
    BLINK_INTERVAL: 250,
    SHOW_STATUS: true,
    numSendPages: 4,
    TRACK_BANK_SIZE: 8,
    CUE_BANK_SIZE: 7, // 7 pads + shift
    rewindAmount: 4.0,
    // Amount of knobs reserved for controlling selected device parameters
    numKnobParams: 6,
    cycleThroughParams: true,
    PROFILE: true
};

const led_state = {
    off: 0,
    on: 127,
}

const MODES = {
    PRODUCTION: "Production",
    //ARRANGE: "Arrangement",
    PERFORM: "Perform",
    DEVICE: "Device management",
};

const PADS =
    {
        CHANNEL: 10,
        REWIND:
            {
                note: 91,
                index: 28
            },
        FASTFORWARD:
            {
                note: 92,
                index: 29
            },
        PAUSE: {
            note: 28,
            index: 26
        },
        PLAY: {
            note: 27,
            index: 25
        },
        RECORD: {
            note: 29,
            index: 27
        },
        PREV_MARKER:
            {
                note: 25,
                index: 30
            },
        NEXT_MARKER:
            {
                note: 26,
                index: 31
            },
        UNDO: {
            note: 76,
            index: 32
        },
        ARM:
            {
                note: 64,
                index: 17
            },
        PREROLL: {
            note: 65,
            index: 18
        },
        PAD_19: {
            note: 66,
            index: 19
        },
        QUANTIZATION: {
            note: 67,
            index: 20
        },
        PAD_21: {
            note: 68,
            index: 21
        },
        PAD_22: {
            note: 69,
            index: 22
        },
        PAD_23: {
            note: 70,
            index: 23
        },
        // ARM:{
        //     LOW: 64,
        //     HIGH: 70,
        // }
    };

const SHIFT = {
    CHANNEL: 10,
    // KEY: '90 48 7F 90 07 7F 90 07 00 90 48 00',
    KEY: 71,
    index: 24,
}

const FADERS = {
    TYPE: 0xB0, // CC
    CHANNEL: 1,
    // SIZE: 4,
    // BASE_CC: 64,
    // BANKS: 2,
    FADER_5 : {
        note: 68,
        index: 5,
    },
    FADER_6 : {
        note: 69,
        index: 6,
    },
    FADER_7 : {
        note: 70,
        index: 7,
    },
    FADER_8 : {
        note: 71,
        index: 8,
    },
}

const KNOBS = {
    CHANNEL: 6,        // your hardware sends on channel 6
    //SIZE: 8,           // 8 knobs per bank
    //BASE_CC: 56,       // first CC for BANK_1
    LEFT: 0x00,
    RIGHT: 0x7F,

    KNOB_1  : {
        note: 48,
        index: 1
    },
    KNOB_2  : {
        note: 49,
        index: 2
    },
    KNOB_3  : {
        note: 50,
        index: 3
    },
    KNOB_4  : {
        note: 51,
        index: 4
    },
    KNOB_5  : {
        note: 52,
        index: 5
    },
    KNOB_6  : {
        note: 53,
        index: 6
    },
    KNOB_7  : {
        note: 54,
        index: 7
    },
    KNOB_8  : {
        note: 55,
        index: 8
    },
    KNOB_9  : {
        note: 56,
        index: 9
    },
    KNOB_10 : {
        note: 57,
        index: 10
    },
    KNOB_11	: {
        note: 58,
        index: 11
    },
    KNOB_12 : {
        note: 59,
        index: 12
    },
    KNOB_13 : {
        note: 60,
        index: 13
    },
    KNOB_14	: {
        note: 61,
        index: 14
    },
    KNOB_15 : {
        note: 62,
        index: 15
    },
    KNOB_16 : {
        note: 63,
        index: 16
    }



    //BANKS: 2,           // how many banks total
    //MASTER_CC: 63,
};

const WHEELS = {
    PITCH : {
        CHANNEL: 3,
        KEY : 1,
    },
    MOD : {
        CHANNEL: 4,
    }
};
const BUTTONS = {
    CHANNEL: 6,
    LEFT_BUTTON: {
        note: 125,
    },

    RIGHT_BUTTON: {
        note: 126,
    }
}

const MODE_KNOB_LABELS = {
    [MODES.PRODUCTION]: {
        normal: {
            // [KNOBS.KNOB_7.note]: "Parameter",
            [KNOBS.KNOB_8.note]: "Param page",
            [KNOBS.KNOB_9.note]: "Track",
            [KNOBS.KNOB_10.note]: "Loop length",
            [KNOBS.KNOB_11.note]: "Knob 11",
            [KNOBS.KNOB_12.note]: "Knob 12",
            [KNOBS.KNOB_13.note]: "Knob 13",
            [KNOBS.KNOB_14.note]: "Knob 14",
            [KNOBS.KNOB_15.note]: "Knob 15",
            [KNOBS.KNOB_16.note]: "Knob 16"
        },
        shift: {
            [KNOBS.KNOB_8.note]: "Device",
            [KNOBS.KNOB_9.note]: "Track",
            [KNOBS.KNOB_10.note]: "Move Loop",
        }
    }
}

const MODE_PAD_LABELS = {
    [MODES.PRODUCTION]: {
        normal: {
            [PADS.PAD_19.note]: "Arr. autom. write",
            [PADS.QUANTIZATION.note] : 'Quantization',
            [PADS.PLAY.note]: "Play",
            [PADS.PAUSE.note]: "Pause",
            [PADS.RECORD.note]: "Record",
            [PADS.REWIND.note]: "Rewind",
            [PADS.FASTFORWARD.note]: "FastForward",
            [PADS.PREV_MARKER.note]: "Prev CUE",
            [PADS.NEXT_MARKER.note]: "Next CUE",
            [PADS.UNDO.note]: "Undo",
            [PADS.PREROLL.note]: "Pre-roll",
            [PADS.ARM.note]: "Arm/Solo",
            [PADS.PAD_23.note]: "Device",
            [SHIFT.key]: "Shift",

        },
        shift: {
            [PADS.PAD_19.note]: "Arr. autom. mode",
            [PADS.QUANTIZATION.note] : 'Quant. Grid',
            [PADS.PLAY.note]: "Activate track",
            [PADS.PLAY.note]: "Loop",
            [PADS.NEXT_MARKER.note]: "Add CUE",
            [PADS.RECORD.note]: "Overdub",
            [PADS.UNDO.note]: "Redo",
            [PADS.PREROLL.note]: "Metronome",
            [PADS.ARM.note]: "Solo/Mute",
        }
    },

    [MODES.PERFORM]: {
        normal: {
            [PADS.PLAY.note]: "Play",
            [PADS.PAUSE.note]: "Stop",
            [PADS.RECORD.note]: "Overdub",
            [PADS.REWIND.note]: "Prev",
            [PADS.FASTFORWARD.note]: "Next"
        },
        shift: {}
    }
};

MOD_FADER_LABELS = {
    [MODES.PRODUCTION]: {
        normal: {
            [FADERS.FADER_5.note]: "Volume",
            [FADERS.FADER_6.note]: "Pan",
            [FADERS.FADER_7.note]: "Send 1",
            [FADERS.FADER_8.note]: "Send 2",
        },
        shift: {}
    }
}


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

function logSysexMessage(port, data, opt="") {
    if (!CONFIG.LOG_MIDI_MESSAGES) return;

    // const channel = (status & 0x0F) + 1;
    // const messageType = status & 0xF0;
    // const messageTypeStr = MESSAGE_TYPES[messageType] || "Unknown";

    // if (!opt) {opt = "";}

    // println(`[MIDI ${port}] Ch:${channel} Type:${messageTypeStr}, ${messageType}; Data1:${data1} Data2:${data2} ${opt}`);
    println(`[SysEX ${port}] Data:${data} ; ${opt}`);

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

function displayErrorPopup(text) {
    host.showPopupNotification(text);
}

function getShortHostName() {
    const product = host.getHostProduct();   // "Bitwig Studio"
    const version = host.getHostVersion();   // "6.0 Beta 13"

    // Take first word of product
    const shortProduct = product.split(" ")[0]; // "Bitwig"

    // Extract major version number
    const match = version.match(/\d+/);
    const major = match ? match[0] : "?";

    return `${shortProduct} ${major}`;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

