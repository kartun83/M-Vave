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
        UNDO: 76,
        ARM:{
            LOW: 64,
            HIGH: 70,
        }
    };

const SHIFT = {
    CHANNEL: 10,
    // KEY: '90 48 7F 90 07 7F 90 07 00 90 48 00',
    KEY: 71,
}

const FADERS = {
    TYPE: 0xB0, // CC
    CHANNEL: 1,
    SIZE: 4,
    BASE_CC: 64,
    BANKS: 2,
}

const KNOBS = {
    CHANNEL: 6,        // your hardware sends on channel 6
    SIZE: 8,           // 8 knobs per bank
    BASE_CC: 48,       // first CC for BANK_1
    BANKS: 2,           // how many banks total
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
}


// // function Shift(host, channel, key) {
// //     this.channel = channel - 1; // Bitwig channels are 0-based
// //     this.key = key;
// //     this.value = host.createBooleanValue();
// // }
//
// Shift.prototype.handleMidi = function(status, data1, data2) {
//     const type = status & 0xF0;
//     const channel = status & 0x0F;
//
//     if (channel === this.channel && data1 === this.key) {
//         if (type === 0x90 && data2 > 0) {
//             this.value.set(true);
//         } else if (type === 0x80 || (type === 0x90 && data2 === 0)) {
//             this.value.set(false);
//         }
//         return true; // consumed
//     }
//     return false;
// };
//
// Shift.prototype.isHeld = function() {
//     return this.value.get();
// };