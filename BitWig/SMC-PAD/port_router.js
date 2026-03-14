class PortRouter {
    constructor(context, boardSettings) {
        this.context = context;
        this.inputs = {};
        this.name = "[PortRouter]";

        const ins = boardSettings.INS;

        Object.keys(ins).forEach(name => {
            const cfg = ins[name];
            if (!cfg.enabled) {
                printDebugInfo(`[INFO] MIDI IN '${name}' disabled by config`);
                return;
            }

            let router;
            switch (name) {
                case "private":
                    router = new InputRouterPrivate(context);
                    break;
                default:
                    router = new InputRouter(context);
            }

            this.inputs[cfg.index] = router;
            printDebugInfo(`[INFO] MIDI IN '${name}' bound to port ${cfg.index}`);
        });
    }

    onMidi(port, status, data1, data2) {
        const handler = this.inputs[port];
        printDebugInfo(`[INFO] ${this.name} onMidi: port - ${port}, status: ${status}, ${data1}, ${data2} routing into ${handler.name}`);
        if (!handler) {
            printDebugInfo(`${this.name} no handler bound to '${port}'`);
            // return;
        } // silently ignore disabled / unknown ports
        else
        {
            printDebugInfo(`[INFO] routing onMidi for '${port}' into "${handler.name}"`);
            handler.onMidi(status, data1, data2);
        }
    }

    onSysex(port, data) {
        printDebugInfo(`[INFO] routing onSysex for '${port}'`);
        const router = this.inputs[port];
        if (!router || !router.onSysex) return;
        router.onSysex(port, data);
    }

    // onMidi(port, status, d1, d2) {
    //     const input = this.inputs[port];
    //     if (input?.onMidi) {
    //         input.onMidi(status, d1, d2);
    //     }
    //     else
    //     {
    //         printDebugInfo(`⚠️ MIDI message from unknown port ${port}`);
    //     }
    //
    // }
    //
    // onSysex(port, data) {
    //     const input = this.inputs[port];
    //     if (input?.onSysex) {
    //         input.onSysex(data);
    //     }
    //     else{
    //         printDebugInfo(`⚠️ SysEX message from unknown port ${port}`);
    //     }
    // }
}
