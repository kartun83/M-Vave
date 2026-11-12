load("input_handler_knobs.js")
load("input_handler_pads.js")
load("input_handler_faders.js")

class ChannelRouter {
    constructor(context) {
        this.context = context;
        this.name = "[ChannelRouter]";

        this.routes = {
            [PADS.CHANNEL]: new InputHandlerPads(context, PADS),
            [FADERS.CHANNEL]: new InputHandlerFaders(context, FADERS),
            [KNOBS.CHANNEL]: new InputHandlerKnobs(context, KNOBS),
            //[WHEELS.PITCH.CHANNEL]: new PitchWheelHandler(context),
            //[WHEELS.MOD.CHANNEL]: new ModWheelHandler(context),
        };
        Object.values(this.routes).forEach(validateHandler);

        // validateHandler(this.routes[PADS.CHANNEL], "Pads");
        // validateHandler(this.routes[FADERS.CHANNEL], "Pads");
        // validateHandler(this.routes[KNOBS.CHANNEL], "Pads");
    }

    route_midi(type, channel, d1, d2) {
        printDebugInfo(`[ChannelRouter] route_midi: ${type}, channel: ${channel}`);
        logMidiMessage(this.name, channel, d1, d2);
        const handler = this.routes[channel];
        if (!handler)
        {
            printDebugInfo(`No handler found for channel ${channel}`, true);
            return;
        }
        else{
            printDebugInfo(`Handler found for channel ${channel}, type: ${handler.name}`);
        }


        handler.onMidi(type, d1, d2);
    }

    route_sysex(port, data)
    {
        printDebugInfo(`[ChannelRouter] route_sysex: ${port}, channel: ${data}`);
        const handler = this.routes[channel];
        if (!handler)
        {
            printDebugInfo(`No handler sysex port: ${port}, data: ${data}`);
            return;
        }
        handler.onSysex(port, data);
    }
}

function validateHandler(handler) {
    if (typeof handler.onMidi !== "function") {
        const error_text = `Handler '${handler.name}' must implement onMidi()`
        printDebugInfo(error_text);
        throw new Error(error_text);
    }
    if (handler.onSysex && typeof handler.onSysex !== "function") {
        const error_text = `Handler '${handler.name}' must implement onSysex()`
        printDebugInfo(error_text);
        throw new Error(`Handler '${handler.name}' has invalid onSysex()`);
    }
}
