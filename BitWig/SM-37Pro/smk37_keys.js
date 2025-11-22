load("smk37_faders.js");
load("smk37_knobs.js");
load("smk37_wheels.js");

function onMidiPortKeysMessage(status, data1, data2) {
    const channel = (status & 0x0F) + 1;
    const messageType = status & 0xF0;
    // Use the new logging function
    logMidiMessage("Router", status, data1, data2);

    switch (channel) {
        case FADERS.CHANNEL:
            if (data1 >= FADERS.BASE_CC && data1 <= FADERS.BASE_CC + FADERS.SIZE * FADERS.BANKS) {
                onMidiPortFaderMessage(status, data1, data2);
                break;
            };
            break;
        case WHEELS.PITCH.CHANNEL: // fall through
        case WHEELS.MOD.CHANNEL: onMidiPortWheelMessage(status, data1, data2); break;
        case KNOBS.CHANNEL: onMidiPortKnobMessage(status, data1, data2); break;
        default:
            logMidiMessage(0, status, data1, data2);
            printDebugInfo("Something unprocessible sent to onMidiPortKeysMessage");
    }
    
    if (CONFIG.DEBUG) {
        println("Key MIDI Message processed");
    }
}