class InputHandlerFaders {
    constructor(context, bindings) {
        this.context = context;
        this.bindings = bindings;
        this.name = "Faders";
    }

    onMidi(status, data1, data2) {
        logMidiMessage(this.name, status, data1, data2);

        // if (data2 === 0) return; // ignore releases

        switch (applicationState.modeSetting) {
            case MODES.PRODUCTION:
                this.onProductionMode(data1, data2);
                break;
            case MODES.PERFORM:
                this.onPerformMode(data1, data2);
                break;
            default:
                host.println(`Unsupported pad mode: ${applicationState.modeSetting}`);
        }
    }

    // Called when a MIDI sysex message is received on MIDI input port 0.
    onSysex(data) {
        logSysexMessage(this.name , data);
        // MMC Transport Controls:
        // switch (data) {
        //     case "f07f7f0605f7":
        //         transport.rewind();
        //         break;
        //     case "f07f7f0604f7":
        //         transport.fastForward();
        //         break;
        //     case "f07f7f0601f7":
        //         transport.stop();
        //         break;
        //     case "f07f7f0602f7":
        //         transport.play();
        //         break;
        //     case "f07f7f0606f7":
        //         transport.record();
        //         break;
        // }
    }

    onPerformMode(data1, data2) {
        printDebugInfo('Not implemented');
    }

    onProductionMode(data1, data2) {
        let send_idx = 0;
        switch (data1) {
            case FADERS.FADER_5.note:
                !controllerState.isShiftPressed ?
                    hostObjects.cursorTrack.volume().set(data2, CONFIG.PARAM_RESOLUTION):
                    hostObjects.masterTrack.volume().set(data2, CONFIG.PARAM_RESOLUTION);
                break;
            case FADERS.FADER_6.note:
                hostObjects.cursorTrack.pan().set(data2, CONFIG.PARAM_RESOLUTION);
                break;
            case FADERS.FADER_7.note:
                send_idx = !controllerState.isShiftPressed ? 0 : 2
                hostObjects.cursorTrack.sendBank()?.getItemAt(send_idx).set(data2, CONFIG.PARAM_RESOLUTION);
                break;
            case FADERS.FADER_8.note:
                send_idx = !controllerState.isShiftPressed ? 1 : 3
                hostObjects.cursorTrack.sendBank()?.getItemAt(send_idx).set(data2, CONFIG.PARAM_RESOLUTION);
                break;
            default:
                printDebugInfo(`No binding for given fader: ${data1}`);
        }
    }
}