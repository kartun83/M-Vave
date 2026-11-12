// function onMidiPortFaderMessage(status, data1, data2){
//     const channel = (status & 0x0F) + 1;
//
//     if (channel === FADERS.CHANNEL) {
//         const fader = _resolveFader(status, data1);
//         printDebugInfo(`Faders bank:${fader.bank}, index:${fader.index}`);
//         switch (applicationState.modeSetting) {
//             case MODES.PRODUCTION:
//                 onMidiFader8TrackMessage(fader, data2);
//                 break;
//             case MODES.PERFORM:
//                 onMidiFaderArrangeMessage(fader, data2);
//                 break;
//             default:
//                 printDebugInfo(`Unsupported mode for fader: ${applicationState.modeSetting}`, true);
//
//         }
//     } else {
//         printDebugInfo(`Received data for FADERS in ${channel}, but in config it should be ${FADERS.CHANNEL}. Leaving unprocessed`);
//     }
// }
//
// function onMidiFader8TrackMessage(fader, data2){
//     _adjust_volume_fader(fader, data2);
// }
//
// function _adjust_volume_fader(fader, value){
//     printDebugInfo(`Processing KNOB bank: ${fader.bank}, index:${fader.index} with value ${value}`);
//     const track = hostObjects.trackBank.getItemAt(fader.index + fader.bank*FADERS.SIZE);
//     if (!track) {printDebugInfo('No track selected !!!'); return;}
//     printDebugInfo(`Processsing track: ${track}, volume:${value}`);
//
//     // scale 0–127 → 0.0–1.0
//     // const scaled = value / 127.0;
//     // set volume
//     // track.volume().setImmediately(scaled);
//     track.volume().set(value, CONFIG.PARAM_RESOLUTION);
//     // track.volume().inc(0.1);
// }
//
// function onMidiFaderArrangeMessage(status, data1, data2, data3){
//     host.showPopupNotification(`Not implemented yet`);
// }
//
// function _resolveFader(channel, cc) {
//     // normalize channel (Bitwig API is 0-based)
//     let _channel = channel & 0x0F;
//     if (_channel !== FADERS.CHANNEL - 1) return null;
//
//
//     const offset = cc - FADERS.BASE_CC;
//     if (offset < 0 || offset >= FADERS.SIZE * FADERS.BANKS) return null;
//
//     const bankIndex = Math.floor(offset / FADERS.SIZE);  // 0, 1, ...
//     const faderIndex = offset % FADERS.SIZE;              // 0–7
//
//     return { bank: bankIndex, index: faderIndex, cc: cc };
// }