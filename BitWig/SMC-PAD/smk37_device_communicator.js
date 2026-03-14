load("text_to_byte.js");
load("smk37_colors.js");

class DeviceCommunicator {
    static MASTER_PORT_NAME = PLUGIN_SETTINGS.BOARD_SETTINGS.INS.master.name;
    static SCREEN_ADDRESS = 0x40;
    static KNOB_NAME_BASE = 0x20;
    static KNOB_VOLUME_BASE = 0x30;
    static PAD_NAME_BASE = 0x00;
    static FADER_NAME_BASE = 0x41;
    static FADER_VALUE_BASE = 0x49;

    constructor(context) {
        this.context = context;
        this.midiOutMain = context.getOut(this.MASTER_PORT_NAME);
        if (!this.midiOutMain) {
          printDebugInfo(`Port ${this.MASTER_PORT_NAME} of ${context.boardName} of  is not available`, true);
        }
        this.connected = true;
        this.padLightStates = {};
    }

    _sendMidi(status, data1, data2) {
        if (!this.connected) return;
        if (!this.midiOutMain) { displayErrorPopup(`Port ${this.MASTER_PORT_NAME} of ${context.boardName} of  is not available`)} else {
            this.midiOutMain.sendMidi(status, data1, data2);
        }
    }

    _sendSysex(data) {
        if (!this.connected) return;
        if (!this.midiOutMain) { displayErrorPopup(`Port ${this.MASTER_PORT_NAME} of ${context.boardName} of  is not available`)} else {
            this.midiOutMain.sendSysex(
                toHex(data)
            );
        }
    }

    // _sendSysexToPrivate(data) {
    //     // Possible command for board preset preset setup
    //     // host.getMidiOutPort(1).sendSysex([0xF0, 0x00, 0x32, 0x01, 0x08, 0x00, 0x00, 0x00, 0x00, 0x7F, 0x01, 0xF7]);
    //     // host.getMidiOutPort(1).sendSysex([0xF0, 0x00, 0x32, 0x0d, 0x61, 0x06, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x40, 0x0C, 0x00, 0x00, 0x06, 0x02, 0x04, 0x08, 0xF7]);
    //     if (!this.connected) return;
    //     if (!this.midiOutPrivate) { displayErrorPopup(`Port ${this.MASTER_PORT_NAME} of ${context.boardName} of  is not available`)} else {
    //         this.midiOutPrivate.sendSysex(
    //             toHex(data);
    //         );
    //     }
    // }

    setPadLight(padIndex, color, effect = EFFECTS.EFFECT_SOLID) {
        const key = `${color}:${effect}`;
        if (this.padLightStates[padIndex] === key) return;

        this._sendSysexLight(padIndex, color, effect);
        this.padLightStates[padIndex] = key;
    }

    setPadFlashing(padIndex, color1, color2) {

        // Alternate between given colors
        // Tested
        this.setPadLight(padIndex, color1, color2);
    }

    sendPadString(padIndex, text) {
        if (padIndex < 0 || padIndex > 31) return;
        this.sendStringMessage(text, DeviceCommunicator.PAD_NAME_BASE + padIndex);
    };

    setPadLightOff(padIndex) {
        this.setPadLight(padIndex, Palette.OFF);
    }

    switchBank(bank) {
        if (!this.midiOutMain) { displayErrorPopup(`Port ${this.MASTER_PORT_NAME} of ${context.boardName} of  is not available`)} else {
            this._sendSysex([0xF0, 0x35, 0x36, 0x00, bank, 0xF7]);
            this._sendSysex([0xF0, 0x35, 0x36, 0x01, bank, 0xF7]);
        }
    }

    sendStringMessage(text, targetId = DeviceCommunicator.SCREEN_ADDRESS) {
        const bytes = textToBytes(text).slice(0, 255);
        const sysex = [
            0xF0, 0x35, 0x37, targetId,
            bytes.length,
            ...bytes,
            0xF7
        ];
        //if (!this.midiOutMain) { displayErrorPopup(`Port ${this.MASTER_PORT_NAME} of ${context.boardName} of  is not available`)} else {
            //this.midiOutMain.sendSysex(toHex(sysex));
            this._sendSysex(sysex);
        //}
    }

    _sendSysexLight(padIndex, color, effect) {
        // Send SYSEX lighting message
        printDebugInfo(`Setting ${padIndex} to ${color} with effect ${effect}`);
        if (padIndex < 0 || padIndex > 33) {
            printDebugInfo(`Invalid PAD index ${padIndex}`)
        }
        else {
            if (effect === undefined) {
                printDebugInfo(`Invalid effect: ${effect}`);
                return;
            };
            this._sendSysex([0xF0, 0x35, padIndex, color, effect, 0xF7]);
        }
        //if (!this.midiOutMain) { displayErrorPopup(`Port ${this.MASTER_PORT_NAME} of ${context.boardName} of  is not available`)} else {
        //     this.midiOutMain.sendSysex(
        //         toHex()
        //     );
        // }
    }

    shutdownLights() {
        // Turn off all lights on shutdown
        for (let i = 0; i < 32; i++) {
            this.setPadLight(i, Palette.OFF, EFFECTS.EFFECT_RESTORE);
        }
        this.padLightStates = {};
    }

    // Knobs
    sendKnobNameString(knobIndex, text) {
        if (knobIndex < 0 || knobIndex > 16) return;
        this.sendStringMessage(text, DeviceCommunicator.KNOB_NAME_BASE + knobIndex);
    };

    sendKnobVolumeString(knobIndex, text) {
        if (knobIndex < 0 || knobIndex > 16) return;
        this.sendStringMessage(text, DeviceCommunicator.KNOB_VOLUME_BASE + knobIndex);
    };

    sendKnobVolumeWithValue(knobIndex, volume, dbText) {
        if (!this.connected) return;
        if (knobIndex < 0 || knobIndex > 16) return;

        const targetId = DeviceCommunicator.KNOB_VOLUME_BASE + knobIndex;
        const textBytes = textToBytes(dbText);
        let payload = [volume].concat(textBytes);

        if (payload.length > 255) payload = payload.slice(0, 255);

        const msg =
            [0xF0, 0x35, 0x37, targetId, payload.length]
                .concat(payload)
                .concat([0xF7]
        );

        this._sendSysex(msg);
    };

    // Faders

    // Knobs
    sendFaderNameString(faderIndex, text) {
        if (faderIndex < 0 || faderIndex > 8) return;
        this.sendStringMessage( text,DeviceCommunicator.FADER_NAME_BASE + faderIndex);
    };

    sendFaderVolumeString(faderIndex, text) {
        if (faderIndex < 0 || faderIndex > 8) return;
        this.sendStringMessage(text, DeviceCommunicator.FADER_VALUE_BASE + faderIndex);
    };

    clearAllStrings() {
        if (!this.connected) return;
        this._sendSysex(
            [0xF0, 0x35, 0x37, 0x7F, 0x03, 0x7F, 0x7F, 0xF7]
        );
    };

    clearModeStrings() {
        for (let i = 16; i < 32; i++) {
            this.sendPadString(i, "");
        }
    };

    sendStartupMessage() {
        this.sendStringMessage(getShortHostName(), DeviceCommunicator.SCREEN_ADDRESS);
    }

}

// Debugging colors
function probePalette(deviceComm, pad) {
    const entries = Object.entries(Palette);
    let i = 0;
    const timeout = 10000;

    function step() {
        if (i >= entries.length) {
            printDebugInfo("Palette probe finished");
            return;
        }

        const [name, value] = entries[i];
        deviceComm._sendSysexLight(pad, value, EFFECTS.EFFECT_SOLID);

        printDebugInfo(`${name} = 0x${value.toString(16)}`);
        i++;

        host.scheduleTask(step, timeout);
    }

    step();
}

function probeRawColors(deviceComm, pad) {
    const START = 0x00;
    const END   = 0x4F;   // safe upper bound; >0x50 often glitches
    const EFFECT = EFFECTS.EFFECT_SOLID;
    const DELAY_MS = 4000;

    let value = START;

    function step() {
        if (value > END) {
            printDebugInfo("Raw color probe finished");
            return;
        }

        deviceComm._sendSysexLight(pad, value, EFFECT);

        printDebugInfo(
            `RAW 0x${value.toString(16).padStart(2, "0")} (${value})`
        );

        value++;
        host.scheduleTask(step, DELAY_MS);
    }

    step();
}