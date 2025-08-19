function onMidiPortFaderMessage(status, data1, data2){
    const channel = (status & 0x0F) + 1;

    if (channel === FADERS.CHANNEL) {
        const fader = _resolveFader(status, data1);
        printDebugInfo(`Faders bank:${fader.bank}, index:${fader.index}`);
        switch (globalState.modeSetting) {
            case MODES.REC:
                onMidiFader8TrackMessage(fader, data2);
                break;
            case MODES.ARRANGE:
                onMidiFaderArrangeMessage(fader, data2);
                break;
            default:
                printDebugInfo(`Unsupported mode for fader: ${globalState.modeSetting}`, true);

        }
    } else {
        printDebugInfo(`Received data for FADERS in ${channel}, but in config it should be ${FADERS.CHANNEL}. Leaving unprocessed`);
    }
    // switch (data1) {
    //     case FADERS.BANK_1.FADER_LOW: // Play
    //         println(`Fader 1`);
    //         break;
    //     case FADERS.BANK_1.FADER_LOW + 1: // Play
    //         println(`Fader 2`);
    //         break;
    //     case FADERS.BANK_1.FADER_LOW + 2: // Play
    //         println(`Fader 3`);
    //         break;
    //     case FADERS.BANK_1.FADER_LOW + 3: // Play
    //         println(`Fader 4`);
    //         break;
    //     case FADERS.BANK_2.FADER_LOW: // Play
    //         println(`Fader 5`);
    //         break;
    //     case FADERS.BANK_2.FADER_LOW + 1: // Play
    //         println(`Fader 6`);
    //         break;
    //     case FADERS.BANK_2.FADER_LOW + 2: // Play
    //         println(`Fader 7`);
    //         break;
    //     case FADERS.BANK_2.FADER_LOW + 3: // Play
    //         println(`Fader 8`);
    //         break;
    //     default:
    //         println(`Unknown FADER`);
    //
    // }
}

function onMidiFader8TrackMessage(fader, data2){
    _adjust_volume_fader(fader, data2);
}

function _adjust_volume_fader(fader, value){
    printDebugInfo(`Processing KNOB bank: ${fader.bank}, index:${fader.index} with value ${value}`);
    const track = hostObjects.trackBank.getItemAt(fader.index + fader.bank*FADERS.SIZE);
    if (!track) {printDebugInfo('No track selected !!!'); return;}
    printDebugInfo(`Processsing track: ${track}, volume:${value}`);

    // scale 0–127 → 0.0–1.0
    // const scaled = value / 127.0;
    // set volume
    // track.volume().setImmediately(scaled);
    track.volume().set(value, 128);
    // track.volume().inc(0.1);
}

function onMidiFaderArrangeMessage(status, data1, data2, data3){
    host.showPopupNotification(`Not implemented yet`);
}

function _resolveFader(channel, cc) {
    // normalize channel (Bitwig API is 0-based)
    let _channel = channel & 0x0F;
    if (_channel !== FADERS.CHANNEL - 1) return null;


    const offset = cc - FADERS.BASE_CC;
    if (offset < 0 || offset >= FADERS.SIZE * FADERS.BANKS) return null;

    const bankIndex = Math.floor(offset / FADERS.SIZE);  // 0, 1, ...
    const faderIndex = offset % FADERS.SIZE;              // 0–7

    return { bank: bankIndex, index: faderIndex, cc: cc };
}