load("config_pad_colors.js")

class PadColorRenderer {
    constructor(transportState, applicationState, trackState, browserState, communicator) {
        //this.globalState = globalState;
        this.transport = transportState;
        this.application = applicationState;
        this.trackState = trackState;
        this.browserState = browserState;
        this.comm = communicator;

        this._padCache = {};
        this._rulesByPad = this.buildRuleIndex();


        // CHECK :: Fix, doesn't handle ARM/Solo/Mute properly
        applicationState.onChange((key) => {
            if (key === "mode") {
                this._rulesByPad = this.buildRuleIndex();
            }
            this.renderAll();
        });
        // globalState.onChange((key) => { this._rulesByPad = this.buildRuleIndex(); this.renderAll(); });
        transportState.onChange(() => this.renderAll());
        applicationState.onChange(() => this.renderAll());
        trackState.onChange(() => this.renderAll());
    }

    // renderAll() {
    //     const mode = this.globalState.mode;
    //     const rules = PAD_COLOR_RULES[mode];
    //     if (!rules) return;
    //
    //     for (const rule of rules) {
    //         const value = this.resolveState(rule.state);
    //         const color = value ? rule.on : rule.off;
    //
    //         this.renderPad(rule.pad, color);
    //     }
    // }

    renderAll() {
        const ctx = {
            transport: this.transport,
            application: this.application,
            //global: this.applicationState,
            track: this.trackState,
            browser: this.browserState,
        };

        for (const padIndex in this._rulesByPad) {
            const rules = this._rulesByPad[padIndex];

            const resolved = this.resolvePad(rules, ctx);

            if (!resolved) {
                this.renderPad(padIndex, Palette.OFF, EFFECTS.EFFECT_SOLID);
                continue;
            }

            this.renderPad(
                padIndex,
                resolved.color,
                resolved.effect
            );
        }
    }



    renderPad(pad_index, color, effect = EFFECTS.EFFECT_SOLID) {
        const cached = this._padCache[pad_index];

        if (cached &&
            cached.color === color &&
            cached.effect === effect) {
            return;
        }

        this._padCache[pad_index] = { color, effect };

        if (color === Palette.OFF) {
            this.comm?.setPadLightOff(pad_index-1);
        } else {
            this.comm?.setPadLight(pad_index-1, color, effect);
        }
    }

    buildRuleIndex() {
        const index = {};
        const modeRules = PAD_COLOR_RULES[this.application.mode] || [];

        for (const rule of modeRules) {
            const padIndex = rule.pad.index;

            if (!index[padIndex]) index[padIndex] = [];
            index[padIndex].push(rule);
        }

        return index;
    }

    resolvePad(rules, ctx) {
        const activeCandidates = [];
        for (const rule of rules) {
            if (rule.when && !rule.when(ctx)) continue;
            if (!rule.selector) continue;
            const active = !!rule.selector(ctx);
            const state = active ? rule.on : rule.off;
            if (!state) continue;
            activeCandidates.push({
                priority: rule.priority || 0,
                state
            });
        }

        if (activeCandidates.length === 0) return null;
        activeCandidates.sort((a, b) => b.priority - a.priority);
        return activeCandidates[0].state;
    }



}
