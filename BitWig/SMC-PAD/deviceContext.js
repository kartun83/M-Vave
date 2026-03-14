load("shift_state.js")

class DeviceContext {
    constructor(host, boardSettings) {
        this.midiOuts = {};
        this.midiIns = {};
        this.boardName = boardSettings.NAME;

        // --- MIDI OUTS ---
        for (const name in boardSettings.OUTS) {
            const cfg = boardSettings.OUTS[name];
            if (!cfg.enabled) {
                printDebugInfo(`OUT '${name}' disabled`);
                continue;
            }

            const index = cfg.index;
            this.midiOuts[name] = host.getMidiOutPort(index);
            printDebugInfo(`Added OUT port '${name}' → index ${index}`);
        }

        // --- MIDI INS ---
        for (const name in boardSettings.INS) {
            const cfg = boardSettings.INS[name];
            if (!cfg.enabled) {
                printDebugInfo(`IN '${name}' disabled`);
                continue;
            }

            const index = cfg.index;
            this.midiIns[name] = host.getMidiInPort(index);
            printDebugInfo(`Added IN port '${name}' → index ${index}`);
            const noteInputKeys = this.midiIns[name].createNoteInput("Notes");
            noteInputKeys.setShouldConsumeEvents(false);

            const noteInputPads = this.midiIns[name].createNoteInput("Pads");
            noteInputPads.setShouldConsumeEvents(false);
        }

        // Global device state
        //this.shiftState = new ShiftState();

        // Host objects
        //this.trackBank = host.createMainTrackBank(8, 0, 0, true);
    }

    // --- Safe getters ---
    getIn(name = "master") {
        const port = this.midiIns[name];
        if (!port) {
            printDebugInfo(`[WARN] MIDI IN Port'${name}' not available`);
        }
        return port;
    }

    getOut(name = "master") {
        const port = this.midiOuts[name];
        if (!port) {
            printDebugInfo(`[WARN] MIDI OUT Port '${name}' not available`);
        }
        return port;
    }

    isEnabled(name) {
        printDebugInfo(`[CHECK] MIDI ENABLED for ${name} : ${this.midiIns[name] !== undefined}`);
        return this.midiIns[name] !== undefined;
    }

    setupTitles(knobs, knob_titles, pads, pads_titles, mode) {
        //this._setup_knobs_titles(knobs, knob_titles, mode);
    }
}

function setupShiftButton(surface, port, state){
    // Define a hardware button for Shift (note 71 on channel 10)
    printDebugInfo(`Setting up SHIFT button for ${surface} to ${port}`);
    shiftButton = surface.createHardwareButton("SHIFT");  // channel 10 → index 9
    shiftButton.isPressed().markInterested();
    printDebugInfo(`Setup shift button: ${shiftButton.isPressed().get()}`);
    shiftButton.pressedAction().setActionMatcher(port.createCCActionMatcher(SHIFT.CHANNEL-1, SHIFT.KEY, led_state.on));
    shiftButton.releasedAction().setActionMatcher(port.createCCActionMatcher(SHIFT.CHANNEL-1, SHIFT.KEY, led_state.off));

    shiftButton.setLabel("Shift");
    shiftButton.isPressed().addValueObserver(function(on){
        state.setShift(on);
        //globalState.isShiftPressed = on;
        printDebugInfo(`Shift state: ${on} - ${state.isShiftPressed}`);
    })
}