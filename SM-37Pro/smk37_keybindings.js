const PADS =
    {
        CHANNEL: 10,
        REWIND: 91,
        FASTFORWARD: 92,
        PAUSE: 93,
        PLAY: 94,
        RECORD: 95,
        PREV_MARKER: 46,
        NEXT_MARKER: 47,
        UNDO: 76
    };

const SHIFT = {
    CHANNEL: 10,
    // KEY: '90 48 7F 90 07 7F 90 07 00 90 48 00',
    KEY: 71,
}

const FADERS = {
    BANK_1: {
        // CHANNEL: 1,
        FADER_LOW: 64,
        FADER_HIGH: 67,
    },
    BANK_2: {
        // CHANNEL: 1,
        FADER_LOW: 68,
        FADER_HIGH: 71,
    },
    // // Dirty ((
    TYPE: 0xB0, // CC
    CHANNEL: 1,
    LOW: 64,
    HIGH: 71
}

const KNOBS = {
    BANK_1 :{
        CHANNEL: 6,
        KNOB_LOW: 48,
        KNOB_HIGH: 55,
    },
    BANK_2 :{
        // By default it's bound to channel 1-8
        CHANNEL: 6,
        KNOB_LOW: 56,
        KNOB_HIGH: 63,
    }
}

const WHEELS = {
    PITCH : {
        CHANNEL: 3,
        KEY : 1,
    },
    MOD : {
        CHANNEL: 4,
    }
}