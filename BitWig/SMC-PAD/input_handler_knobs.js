class InputHandlerKnobs {
    constructor(context, bindings) {
        this.context = context;
        this.name = "Knobs";
        this.bindings = bindings;

        this._noteToIndex = new Map();
        for (const key in bindings) {
            const entry = bindings[key];
            if (entry && entry.note !== undefined) {
                this._noteToIndex.set(entry.note, entry.index-1);
            }
        }
    }

    onMidi(status, data1, data2) {
        logMidiMessage(this.name, status, data1, data2);

        // Here we expect this to be Relative
        // So, in data2 it's the value either up or down
        //if (data2 === 0) return; // ignore releases
        // let step = 0;

        // switch (data2) {
        //     case this.bindings.LEFT:
        //         step = -1;
        //         printDebugInfo("Moving left");
        //         break;
        //     case this.bindings.RIGHT:
        //         step = +1;
        //         printDebugInfo("Moving right");
        //         break;
        //     default:
        //         printDebugInfo('Knobs are not in CW or some misconfiguration');
        // }

        let step = data2 === this.bindings.RIGHT ? +1 : -1;

        switch (applicationState.modeSetting) {
            case MODES.PRODUCTION:
                if (!browserState.browserActive)
                    this.onProduction(data1, data2, step)
                else
                    this.deviceBrowser(data1, data2, step);
                break;
            case MODES.PERFORM:
                this.onPerform(data1, data2, step);
                break;
            default:
                printDebugInfo(`Unsupported pad mode: ${applicationState.modeSetting}`);
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

    onProduction(data1, data2, direction) {
        switch (data1) {
            // case this.bindings.KNOB_1.note:
            //     hostObjects.remoteControls.getParameter(0).value().inc(direction,CONFIG.PARAM_RESOLUTION);
            //     break;
            //
            // case this.bindings.KNOB_2.note:
            //     hostObjects.remoteControls.getParameter(1).value().inc(direction, CONFIG.PARAM_RESOLUTION);
            //     break;

            case this.bindings.KNOB_8.note:
                // printDebugInfo(bitwig_domains.deviceDomain.deviceType.ids);
                if (controllerState.isShiftPressed){
                    if (data2 == this.bindings.LEFT) {
                        if (hostObjects.cursorDevice.hasPrevious().get()) {
                            hostObjects.cursorDevice.selectPrevious();
                            // if (hostObjects.remoteControls.pageCount().get() > 0) {
                            //     hostObjects.remoteControls.selectedPageIndex().set(0);
                            //hostObjects.remoteControls.selectFirst();
                            // }
                            printDebugInfo(`Preset pages: ${hostObjects.remoteControls.pageCount().get()}`);
                        }
                    } else {
                        if (hostObjects.cursorDevice.hasNext().get()) {
                            hostObjects.cursorDevice.selectNext();
                            //hostObjects.remoteControls.selectedPageIndex().set(0);
                            //hostObjects.remoteControls.selectFirst();
                            printDebugInfo(`Preset pages: ${hostObjects.remoteControls.pageCount().get()}`);
                        }
                    }
                }
                else
                {
                    if (data2 == this.bindings.LEFT) {
                        hostObjects.remoteControls.selectPreviousPage(CONFIG.cycleThroughParams)
                        // hostObjects.cursorDevice.getRemoteControls().selectPreviousPage(CONFIG.cycleThroughParams)
                        // hostObjects.cursorDevice.previousParameterPage()
                        printDebugInfo(`Selecting page: ${hostObjects.remoteControls.selectedPageIndex().get()}`)
                    } else {
                        hostObjects.remoteControls.selectNextPage(CONFIG.cycleThroughParams)
                        printDebugInfo(`Selecting page: ${hostObjects.remoteControls.selectedPageIndex().get()}`)
                        // hostObjects.cursorDevice.getRemoteControls().selectNextPage(CONFIG.cycleThroughParams)
                        // hostObjects.cursorDevice.nextParameterPage()
                    }
                }
                break;

            case this.bindings.KNOB_9.note:
            case this.bindings.KNOB_7.note:
                if (data2 == this.bindings.LEFT) {
                    if (hostObjects.cursorTrack.hasPrevious().get())
                        hostObjects.cursorTrack.selectPrevious();
                } else {
                    if (hostObjects.cursorTrack.hasNext().get())
                        hostObjects.cursorTrack.selectNext();
                }
                break;
            case this.bindings.KNOB_10.note:
                if (!controllerState.isShiftPressed) {
                    hostObjects.transport.arrangerLoopDuration().inc(direction);
                }
                else{
                    hostObjects.transport.arrangerLoopStart().inc(direction);
                }
                // printDebugInfo(`data2: ${data2}`);
                // if (data2 == this.bindings.LEFT){
                //     hostObjects.cursorTrack.zoomOut();
                //     printDebugInfo("Zoom out");
                // }
                // else {
                //     hostObjects.arranger.zoomIn();
                //     printDebugInfo("Zoom in");
                // }
                break;
            case this.bindings.KNOB_11.note:

                break;
            case this.bindings.KNOB_12.note:
                break;
            case this.bindings.KNOB_13.note:
                break;
            case this.bindings.KNOB_14.note:
                // printDebugInfo(`Selected: ${applicationState.browserSelectedItem}`);
                // hostObjects.cursorBrowserResult.selectNext();
                break;
            case this.bindings.KNOB_15.note:
                // direction === this.bindings.LEFT ?
                //     hostObjects.transport.rewind() :
                //     hostObjects.transport.fastForward()
                // if (!controllerState.isShiftPressed) {
                //     direction === 1 ?
                //         hostObjects.application.arrowKeyRight() :
                //         hostObjects.application.arrowKeyLeft();
                // }else{
                //     direction === 1 ?
                //         hostObjects.application.arrowKeyDown() :
                //         hostObjects.application.arrowKeyUp();
                // }
                break;
            case this.bindings.KNOB_16.note:
                printDebugInfo(`data2: ${data2}`);
                if (!controllerState.isShiftPressed){
                    if (data2 == this.bindings.LEFT) {
                        hostObjects.application.zoomOut();
                        printDebugInfo("Zoom out");
                    } else {
                        hostObjects.application.zoomIn();
                        printDebugInfo("Zoom in");
                    }
                }
                else
                {
                    if (data2 == this.bindings.LEFT) {
                        hostObjects.application.zoomToSelectionOrPrevious();
                        printDebugInfo("Zoom out");
                    } else {
                        hostObjects.application.zoomToSelectionOrAll();
                        printDebugInfo("Zoom in");
                    }
                }
                break;
            default:
                this._handleParam(data1, direction);
                printDebugInfo(`Unsupported KNOB mode: ${data1}`);

        }
    }

    _resolveKnobIndex(note) {
        return this._noteToIndex.get(note) ?? -1;
    }

    _handleParam(data1, step) {
        const knobIndex = this._resolveKnobIndex(data1);
        if (knobIndex === -1) return;

        printDebugInfo(`Processing ${data1} as KnobIndex: ${knobIndex} with step ${step}`);

        const param = hostObjects.remoteControls.getParameter(knobIndex);
        const discreteCount = param.discreteValueCount().get();
        const isFine = controllerState.isShiftPressed;

        // DISCRETE PARAMETERS (on/off, enum, etc.)
        if (discreteCount > 0) {
            param.inc(step, CONFIG.PARAM_RESOLUTION); // always integer
        }
        else {
            // CONTINUOUS PARAMETERS
            const multiplier = isFine ? CONFIG.FINE_SCALING : 1;
            const scaledStep = step * multiplier;

            param.inc(scaledStep, CONFIG.PARAM_RESOLUTION);
        }
    }

    deviceBrowser(data1, data2, direction){
        switch (data1){
            case this.bindings.KNOB_9.note:
                printDebugInfo(`------------ Browser active: ${browserState.browserActive}`);
                    direction === 1 ?
                        hostObjects.cursorBrowserResult.selectNext() :
                        hostObjects.cursorBrowserResult.selectPrevious();
                break;
            case this.bindings.KNOB_10.note:
                    direction === 1 ?
                        hostObjects.browser_columns.cursorBrowserCategory.selectNext() :
                        hostObjects.browser_columns.cursorBrowserCategory.selectPrevious();
                break;
            case this.bindings.KNOB_11.note:
                    direction === 1 ?
                        hostObjects.browser_columns.cursorBrowserDevice.selectNext() :
                        hostObjects.browser_columns.cursorBrowserDevice.selectPrevious();
                break;
            case this.bindings.KNOB_12.note:
                    direction === 1 ?
                        hostObjects.browser_columns.cursorBrowserSmartCollection.selectNext() :
                        hostObjects.browser_columns.cursorBrowserSmartCollection.selectPrevious();
                break;
            case this.bindings.KNOB_13.note:
                    direction === 1 ?
                        hostObjects.browser_columns.cursorBrowserTag.selectNext() :
                        hostObjects.browser_columns.cursorBrowserTag.selectPrevious();
                break;
            case this.bindings.KNOB_14.note:
                    direction === 1 ?
                        hostObjects.browser_columns.cursorBrowserCreator.selectNext() :
                        hostObjects.browser_columns.cursorBrowserCreator.selectPrevious();
                break;
            default:
        }
    }


    onPerform(data1, data2, direction) {
        displayErrorPopup(`Knob handling for mode "${applicationState.modeSetting}" not implemented`);
    }
}