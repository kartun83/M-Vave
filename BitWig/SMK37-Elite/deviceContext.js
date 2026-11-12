load("shift_state.js")

class DeviceContext {
    constructor(host, boardSettings) {
        this.midiOuts = {};
        this.midiIns = {};
        this.boardName = boardSettings.NAME;

        // --- MIDI OUTS ---
        for (const cfg of boardSettings.OUTS.ports) {
            if (!cfg.enabled) {
                printDebugInfo(`OUT '${cfg.name}' disabled`);
                continue;}

                else {
                printDebugInfo(`OUT '${cfg.name}' enabled`);
            }

            const index = cfg.index;
            printDebugInfo(`Trying to get ${index} OUT port of the HOST`);
            this.midiOuts[cfg.name] = host.getMidiOutPort(index);
            printDebugInfo(`Added OUT port '${cfg.name}' → index ${index}`);
        }

        // --- MIDI INS ---
        for (const cfg of boardSettings.INS.ports) {
            if (!cfg.enabled) {
                printDebugInfo(`IN '${cfg.name}' disabled`);
                continue;}

            else {
                printDebugInfo(`IN '${cfg.name}' enabled`);
            }

            const index = cfg.index;
            this.midiIns[cfg.name] = host.getMidiInPort(index);
            printDebugInfo(`Added IN port '${cfg.name}' → index ${index}`);

            const noteInputKeys = this.midiIns[cfg.name].createNoteInput("Notes");
            noteInputKeys.setShouldConsumeEvents(false);

            const noteInputPads = this.midiIns[cfg.name].createNoteInput("Pads");
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
            printDebugInfo(`[WARN] [DeviceContext->getIn] MIDI IN Port'${name}' not available`);
        }
        return port;
    }

    getOut(name = "master") {
        const port = this.midiOuts[name];
        if (!port) {
            printDebugInfo(`[WARN] [DeviceContext->getOut] MIDI OUT Port '${name}' not available`);
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