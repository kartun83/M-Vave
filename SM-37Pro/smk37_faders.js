function onMidiPortFaderMessage(status, data1, data2){
    logMidiMessage("Faders", status, data1, data2);
    switch (data1) {
        case FADERS.BANK_1.FADER_LOW: // Play
            println(`Fader 1`);
            break;
        case FADERS.BANK_1.FADER_LOW + 1: // Play
            println(`Fader 2`);
            break;
        case FADERS.BANK_1.FADER_LOW + 2: // Play
            println(`Fader 3`);
            break;
        case FADERS.BANK_1.FADER_LOW + 3: // Play
            println(`Fader 4`);
            break;
        case FADERS.BANK_2.FADER_LOW: // Play
            println(`Fader 5`);
            break;
        case FADERS.BANK_2.FADER_LOW + 1: // Play
            println(`Fader 6`);
            break;
        case FADERS.BANK_2.FADER_LOW + 2: // Play
            println(`Fader 7`);
            break;
        case FADERS.BANK_2.FADER_LOW + 3: // Play
            println(`Fader 8`);
            break;
        default:
            println(`Unknown FADER`);

    }
}