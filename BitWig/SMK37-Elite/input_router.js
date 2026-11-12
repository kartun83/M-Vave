load("channel_router.js");

class InputRouter {
    constructor(context) {
        this.context = context;
        this.channelRouter = new ChannelRouter(context);
        this.name = "[InputRouter]";
        printDebugInfo("InputRouter initialized");
    }

    onMidi(status, data1, data2) {
        // const h = this.inputs[port];
        // if (!h) {
        //     println(`[WARN] No MIDI handler for port ${port}`);
        //     return;
        // }
        // h.onMidi(status, data1, data2);
        printDebugInfo(`[INFO] ${this.name} onMidi: port - status: ${status}, ${data1}, ${data2}`);
        const type = status & 0xF0;
        const channel = (status & 0x0F) + 1; // Bitwig: 0–15 → MIDI 1–16

        logMidiMessage(this.name, status, data1, data2);
        printDebugInfo(`${this.name} onMidi: status: ${status} type: ${type} channel: ${channel}`);
        this.channelRouter.route_midi(type, channel, data1, data2);
    }

    onSysex(port, data) {
        this.channelRouter.route_sysex(port, data);
        // const h = this.inputs[port];
        // if (!h || !h.onSysex) return;
        // h.onSysex(data);
    }
}


class InputRouterPrivate  {
    constructor(context) {
        this.context = context;

        this.my_input = context.getIn("private");
    }

    onMidi(port, status, data1, data2) {
        logMidiMessage(port, status, data1, data2, "PRIVATE !!!!" )
        // const h = this.handlers[port];
        // if (!h) {
        //     println(`[WARN] No MIDI handler for port ${port}`);
        //     return;
        // }
        // h.onMidi(status, data1, data2);
    }

    onSysex(port, data) {
        logSysexMessage(port, data, "PRIVATE !!!!" )
        // const h = this.handlers[port];
        // if (!h || !h.onSysex) return;
        // h.onSysex(data);
    }
}
