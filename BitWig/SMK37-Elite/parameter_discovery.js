class ParameterDiscovery {
    constructor(device) {
        this.device = device;

        this.values = {};
        this.active = false;
        this.names = {};
        this.snapshot = {};

        // Get all parameter IDs
        device.addDirectParameterIdObserver(ids => {
            this.ids = ids;
            println(`Discovered ${ids.length} parameters`);
        });

        device.addDirectParameterNameObserver(256, (id, name) => {
            this.names[id] = name;
            const INTERESTING = ["preset", "program", "patch"];

            if (INTERESTING.some(k => name.toLowerCase().includes(k))) {
                printDebugInfo(`Discovered ${name} parameter with ID : ${id}`);//return;
            }

        });

        // Observe all parameter value changes
        device.addDirectParameterNormalizedValueObserver((id, value) => {
            const prev = this.values[id];
            this.values[id] = value;

            if (!this.active) return;
            if (isNaN(value)) return;

            if (prev !== undefined && Math.abs(value - prev) > 0.01) {
                println(`Δ ${id}: ${prev?.toFixed?.(3)} → ${value.toFixed(3)}`);
            }
        });
    }

    start() {
        println("=== DISCOVERY ON ===");
        this.active = true;
    }

    stop() {
        println("=== DISCOVERY OFF ===");
        this.active = false;
    }

    captureSnapshot() {
        println(`Evaluating  ${this.names.length} parameters`);
        this.snapshot = { ...this.values };
        println("Snapshot captured");
    }

    diff() {
        let best = { id: null, diff: 0 };

        for (const id in this.values) {
            const before = this.snapshot[id] ?? 0;
            const after = this.values[id];

            const d = Math.abs(after - before);
            if (d < 0.01) continue;

            const name = this.names[id] || "???";
            println(`Changed: ${name} [${id}] Δ=${d.toFixed(3)}`);

            if (d > best.diff) {
                best = { id, diff: d };
            }
        }

        if (best.id) {
            const name = this.names[best.id] || "???";
            println(`BEST → ${name} [${best.id}] Δ=${best.diff.toFixed(3)}`);
        } else {
            println("No significant changes detected");
        }

        println(`BEST → id=${best.id}, Δ=${best.diff.toFixed(3)}`);
        return best.id;
    }
}