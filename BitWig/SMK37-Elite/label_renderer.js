class LabelRenderer {
    constructor(controllerState, deviceState, sendState, trackState, communicator, numKnobParams) {
        this.controllerState = controllerState;
        this.deviceState = deviceState;
        this.sendState = sendState;
        this.trackState = trackState;
        this.comm = communicator;
        this.numKnobParams = numKnobParams < 1 ? 8 : numKnobParams;

        this._knobCache = Array(numKnobParams).fill(null).map(() => ({
            name: null,
            valueText: null,
            valueNorm: null,
            ready: false
        }));

        this._staticKnobCache = Array(this.numKnobParams).fill(null);
        this._staticKnobSignature = null;


        this._faderCache = Array(8).fill(null).map(() => ({
            name: null,
            valueNorm: 0,
            valueText: null,
            exists: false
        }));

        this._trackFaderCache = {
            volume: null,
            pan: null
        };


        this._pads = Object.values(PADS).filter(p => p?.note !== undefined);
        this._knobs = Object.values(KNOBS).filter(k => k?.note !== undefined);
        this._faders = Object.values(FADERS).filter(f => f?.note !== undefined);
        this._faders.sort((a, b) => a.index - b.index);



        // controllerState.onChange(() => this.render());
        controllerState.onChange((key) => {
            if (key === "mode" || key === "isShiftPressed") {
                this.render_all();
            }
            else
            {
                printDebugInfo(`Skipping full render as received ${key} from ControllerState`);
            }
        });

        deviceState.onChange((index) => this.renderDeviceKnob(index));
        sendState.onChange((index) => this.renderDynamicFader(index));
        trackState.onChange((key) => this.renderTrackFader(key));

        // deviceState.onChange((event) => this._onDeviceChange(event));
        // sendState.onChange((event) => this._onSendChange(event));
        // trackState.onChange((event) => this._onTrackChange(event));
        // controllerState.onChange((event) => this._onControllerChange(event));
    }

    render_all() {
        this.renderPads();
        this.renderStaticKnobs();
        this.renderFaders();
    }

    renderPads() {
        const modeConfig = MODE_PAD_LABELS[this.controllerState.mode];
        // printDebugInfo(`------> Rendering PADS`);
        if (!modeConfig) {
            printDebugInfo(`Can't determine pads for ${this.controllerState.mode}`);
            return;
        }

        const map = this.controllerState.isShiftPressed
            ? modeConfig.shift
            : modeConfig.normal;

        // for (const padName in PADS) {
        for (const pad of this._pads) {
            const label = map?.[pad.note] ?? "";
            this.comm.sendPadString(pad.index - 1, label);
        }

    }

    // renderKnobs() {
    //     // this.renderDeviceKnobs();
    //     this.renderStaticKnobs();
    // }


    renderDeviceKnob(i) {
        const p = this.deviceState.params[i];
        if (!p) return;

        const cached = this._knobCache[i];

        if (cached.name !== p.name) {
            this.comm.sendKnobNameString(i, p.name ?? "");
            cached.name = p.name;
        }

        if (
            cached.valueNorm !== p.valueNorm ||
            cached.valueText !== p.valueText
        ) {
            this.comm.sendKnobVolumeWithValue(
                i,
                p.valueNorm ?? 0,
                p.valueText ?? ""
            );

            cached.valueNorm = p.valueNorm;
            cached.valueText = p.valueText;
        }
        else {
            printDebugInfo(`For knob ${i} values not changed.`)
        }
    }



    renderStaticKnobs() {
        const signature = `${this.controllerState.mode}:${this.controllerState.isShiftPressed}`;

        if (this._staticKnobSignature !== signature) {
            this._staticKnobCache.fill(null);
            this._staticKnobSignature = signature;
        }

        const modeConfig = MODE_KNOB_LABELS[this.controllerState.mode];
        printDebugInfo(`[renderStaticKnobs] Rendering Knobs`);
        if (!modeConfig) {
            printDebugInfo(`Can't determine knobs for ${this.controllerState.mode}`);
            return;
        }

        const map = modeConfig
            ? (this.controllerState.isShiftPressed
                ? modeConfig.shift
                : modeConfig.normal)
            : null;



        for (const knob of this._knobs) {

            const knob_index = knob.index - 1;
            // if (!knob || typeof knob !== "object" || knob.note === undefined)
            //     continue;

            const label = map?.[knob.note] ?? "";
            printDebugInfo(`Trying to set Knob ${knob.index} to ${label}`);
            // this.comm.sendKnobNameString(knob.index-1, label);
            // const idx = knob.index - 1;
            if (this._staticKnobCache[knob_index] !== label) {
                this.comm.sendKnobNameString(knob_index, label);
                this._staticKnobCache[knob_index] = label;
            }

        }
    }

    renderFaders() {
        printDebugInfo("------> Rendering FADERS");

        for (const fader of this._faders) {

            const fader_index = fader.index - 1;

            switch (fader.index) {
                case FADERS.FADER_5.index:
                    // TODO :: Make proper
                    // this.comm.sendFaderNameString(MOD_FADER_LABELS[this.controllerState.mode][faderName])
                    this.comm.sendFaderNameString(fader_index, 'Volume');
                    this._renderFaderVolume(fader_index);
                    break;

                case FADERS.FADER_6.index:
                    // TODO :: Make proper
                    this.comm.sendFaderNameString(fader_index, 'Pan');
                    this._renderFaderPan(fader_index);
                    break;

                case FADERS.FADER_7.index:
                case FADERS.FADER_8.index:
                    this._renderSendMapped(fader.index, fader_index);
                    break;
            }
        }
    }

    renderTrackFader(key) {
        if (key === "volume") {
            const value = this.trackState.volume.valueText ?? "";
            if (this._trackFaderCache.volume !== value) {
                this.comm.sendFaderVolumeString(FADERS.FADER_5.index-1, value);
                this._trackFaderCache.volume = value;
            }
        }

        if (key === "pan") {
            const value = this.trackState.pan.valueText ?? "";
            if (this._trackFaderCache.pan !== value) {
                this.comm.sendFaderVolumeString(FADERS.FADER_6.index-1, value);
                this._trackFaderCache.pan = value;
            }
        }
    }

    _getVisibleSendSlots() {
        return this.controllerState.isShiftPressed ? [2, 3] : [0, 1];
    }



    // renderTrackFader(key) {
    //     switch (key) {
    //         case "volume": this.comm.sendFaderVolumeString(FADERS.FADER_5.index-1, this.trackState.volume.valueText);
    //                         break;
    //         case "pan": this.comm.sendFaderVolumeString(FADERS.FADER_6.index-1, this.trackState.pan.valueText);
    //                         break;
    //
    //     }
    //     // if (key === "volume") {
    //     //     this._renderVolume(4); // fader 5 → index 4
    //     //     return;
    //     // }
    //     //
    //     // if (key === "pan") {
    //     //     this._renderPan(5); // fader 6 → index 5
    //     //     return;
    //     // }
    // }


    _renderFaderVolume(index) {
        this.comm.sendFaderVolumeString(index, this.trackState.volume.valueText);
    }

    _renderFaderPan(index) {

        this.comm.sendFaderVolumeString(index, this.trackState.pan.valueText);
    }


    _renderSendMapped(faderNumber, index) {

        const sendSlot = this._getSendSlotForFader(faderNumber);
        if (sendSlot === null) return;

        const send = this.sendState?.get(sendSlot);
        const cached = this._faderCache[index];

        if (!send || !send.exists) {
            if (cached.name !== "" || cached.value !== "") {
                this.comm.sendFaderNameString(index, "");
                this.comm.sendFaderVolumeString(index, "");
                cached.name = "";
                cached.value = "";
            }
            return;
        }

        const name = send.name ?? "";
        const value = String(send.valueText ?? "");

        if (cached.name !== name) {
            this.comm.sendFaderNameString(index, name);
            cached.name = name;
        }

        if (cached.value !== value) {
            this.comm.sendFaderVolumeString(index, value);
            cached.value = value;
        }
    }



    // _renderSendMapped(faderNumber, index) {
    //     const shift = this.controllerState.isShiftPressed;
    //
    //     const sendSlot =
    //         faderNumber === 7
    //             ? (shift ? 2 : 0)
    //             : (shift ? 3 : 1);
    //
    //     const send = this.sendState?.get(sendSlot);
    //
    //     if (!send || !send.exists) {
    //         this.comm.sendFaderNameString(index, "");
    //         this.comm.sendFaderVolumeString(index, "");
    //         return;
    //     }
    //
    //     this.comm.sendFaderNameString(index, send.name ?? "");
    //     this.comm.sendFaderVolumeString(index, String(send.valueText ?? ""));
    // }

    _getSendSlotForFader(faderNumber) {
        const shift = this.controllerState.isShiftPressed;

        if (faderNumber === 7)
            return shift ? 2 : 0;

        if (faderNumber === 8)
            return shift ? 3 : 1;

        return null;
    }

    renderDynamicFader(sendIndex) {

        printDebugInfo(`renderDynamicFader ${sendIndex}`);
        const mapping = this._getVisibleSendSlots();

        const faderIndex =
            sendIndex === mapping[0] ? 6 :
                sendIndex === mapping[1] ? 7 :
                    -1;

        if (faderIndex === -1)
            return;

        this._renderSendMapped(faderIndex + 1, faderIndex);
    }


}
