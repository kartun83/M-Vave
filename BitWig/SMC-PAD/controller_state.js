class ControllerState {
    constructor() {
        //this.mode = MODES.PRODUCTION;
        this.isShiftPressed = false;
        this.padBank = 0;
        this.knobBank = 0;

        this._listeners = [];
    }

    // setMode(mode) {
    //     if (this.mode === mode) return;
    //     this.mode = mode;
    //     this._notify();
    // }

    setShift(pressed) {
        if (this.isShiftPressed === pressed) return;
        this.isShiftPressed = pressed;
        this._notify();
    }

    onChange(cb) {
        this._listeners.push(cb);
    }

    _notify() {
        for (const l of this._listeners) l(this);
    }
}
