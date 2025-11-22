function onMidiPortKnobMessage(status, data1, data2){
    printDebugInfo(`Processing KNOBS in ${globalState.modeSetting} mode`);
    logMidiMessage("Knobs", status, data1, data2);
    const channel = (status & 0x0F) + 1;
    // Process only our preset here. user may use other keyboard preset with different mappings,
    // so try to not interfere with it
    if (channel === KNOBS.CHANNEL) {
        const knob = _resolveKnob(status, data1);
        switch (globalState.modeSetting) {
            case MODES.REC:
                onMidiKnob8TrackMessage(knob, data2);
                break;
            case MODES.ARRANGE:
                onMidiKnobArrangeMessage(knob, data2);
                break;
            default:
                printDebugInfo(`Unsupported mode for Knobs: ${globalState.modeSetting}`, true);

        }
    } else {
        printDebugInfo(`Received data for KNOBS in ${channel}, but in config it should be ${KNOBS.CHANNEL}. Leaving unprocessed`);
    }
}

function onMidiKnob8TrackMessage(knob, value){
    switch (knob.bank){
        case 0: _adjust_volume(knob,value); break;
        case 1: _adjust_pan(knob,value); break;
        default:
            printDebugInfo(`${knob.bank} is not supported`, true);
    }

}

function _adjust_volume(knob, value){
    printDebugInfo(`Processing KNOB bank: ${knob.bank}, index:${knob.index} with value ${value}`);
    const track = hostObjects.trackBank.getItemAt(knob.index);
    if (!track) {printDebugInfo('No track selected !!!'); return;}
    printDebugInfo(`Processsing track: ${track}, volume:${value}`);

    // scale 0–127 → 0.0–1.0
    // const scaled = value / 127.0;
    // set volume
    // track.volume().setImmediately(scaled);
    track.volume().set(value, 128);
    // track.volume().inc(0.1);
}

function _adjust_pan(knob, value){
    printDebugInfo(`Processing KNOB bank: ${knob.bank}, index:${knob.index} with value ${value}`);
    const track = hostObjects.trackBank.getItemAt(knob.index);
    if (!track) {printDebugInfo('No track selected !!!'); return;}
    printDebugInfo(`Processsing track: ${track}, volume:${value}`);

    // scale 0–127 → 0.0–1.0
    // const scaled = value / 127.0;
    // set volume
    // track.volume().setImmediately(scaled);
    track.pan().set(value, 128);
    // track.volume().inc(0.1);
}

function onMidiKnobArrangeMessage(status, data1, data2, data3){
    host.showPopupNotification(`Not implemented yet`);
}

function _resolveKnob(channel, cc) {
    let _channel = channel & 0x0F;
    // normalize channel (Bitwig API is 0-based)
    if (_channel !== KNOBS.CHANNEL - 1) return null;

    const offset = cc - KNOBS.BASE_CC;
    if (offset < 0 || offset >= KNOBS.SIZE * KNOBS.BANKS) return null;

    const bankIndex = Math.floor(offset / KNOBS.SIZE);  // 0, 1, ...
    const knobIndex = offset % KNOBS.SIZE;              // 0–7

    return { bank: bankIndex, index: knobIndex, cc: cc };
}