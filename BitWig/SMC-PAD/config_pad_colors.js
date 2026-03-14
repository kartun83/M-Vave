const PADS_LAYERS = {
    BASE: 'base',
    SHIFT: 'shift',
}

const PAD_COLOR_RULES = {
    [MODES.PRODUCTION]: [
        /* ─────────────────────────────
           RECORD PAD - Browser
        ────────────────────────────── */
        {
            // Browser visible
            pad: PADS.PLAY,
            priority: 200,
            when: (ctx) => ctx.browser.browserActive,
            selector: (ctx) => true,
            on: { color: Palette.GREEN_BLUE_BRIGHT, effect: EFFECTS.EFFECT_BREATHING }
        },
        {
            // Live preview available, but not enabled
            pad: PADS.PLAY,
            priority: 190,
            when: (ctx) => ctx.browser.browserActive,
            selector: (ctx) => !ctx.browser.shouldAudition && ctx.browser.canAudition,
            on: { color: Palette.GREEN_PALE, effect: EFFECTS.EFFECT_BREATHING }
        },
        {
            // Live preview enabled
            pad: PADS.PLAY,
            priority: 180,
            when: (ctx) => ctx.browser.browserActive,
            selector: (ctx) => ctx.browser.shouldAudition && ctx.browser.canAudition,
            on: { color: Palette.LIME_BRIGHT, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            // Live preview unavailable
            pad: PADS.PLAY,
            priority: 150,
            when: (ctx) => ctx.browser.browserActive,
            selector: (ctx) => !ctx.browser.canAudition,
            on: { color: Palette.OFF, effect: EFFECTS.EFFECT_SOLID }
        },
        /* ─────────────────────────────
           RECORD PAD - Normal
        ────────────────────────────── */
        {
            pad: PADS.PLAY,
            priority: 100,
            when: () => true,
            selector: (ctx) => ctx.transport.isRecording,
            on: { color: Palette.RED_DIM, effect: EFFECTS.EFFECT_BREATHING }
        },
        {
            pad: PADS.PLAY,
            priority: 50,
            when: () => true,
            selector: (ctx) => ctx.transport.isPlaying,
            on: { color: Palette.GREEN_PALE, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            pad: PADS.PLAY,
            priority: 10,
            when: () => true,
            selector: () => true,
            on: { color: Palette.OFF, effect: EFFECTS.EFFECT_SOLID }
        },
        /* ─────────────────────────────
           RECORD PAD
        ────────────────────────────── */

        {
            pad: PADS.RECORD,
            priority: 100,
            when: (ctx) => true, //ctx.global.isShiftPressed,
            selector: (ctx) => ctx.transport.isArrangerOverdubEnabled,
            on: { color: Palette.FUCHSIA, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            pad: PADS.RECORD,
            priority: 100,
            when: (ctx) => ctx.global.isShiftPressed,
            selector: (ctx) => ctx.transport.isArrangerOverdubEnabled,
            on: { color: Palette.FUCHSIA, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            pad: PADS.RECORD,
            priority: 50,
            when: () => true,
            selector: (ctx) => ctx.transport.isArrangerRecordEnabled,
            on: { color: Palette.RED_DIM, effect: EFFECTS.EFFECT_BREATHING }
        },
        {
            pad: PADS.RECORD,
            priority: 0,
            when: () => true,
            selector: () => true,
            on: { color: Palette.OFF, effect: EFFECTS.EFFECT_SOLID }
        },

        /* ─────────────────────────────
           UNDO PAD
        ────────────────────────────── */

        {
            // Can DO REDO
            pad: PADS.UNDO,
            priority: 100,
            when: (ctx) => ctx.global.isShiftPressed,
            selector: (ctx) => ctx.application.canRedo,
            on: { color: Palette.FUCHSIA, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            // Can not do REDO - turn off
            pad: PADS.UNDO,
            priority: 95,
            when: (ctx) => ctx.global.isShiftPressed,
            selector: (ctx) => !ctx.application.canRedo,
            on: { color: Palette.OFF, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            // CAN Undo
            pad: PADS.UNDO,
            priority: 90,
            when: (ctx) => !ctx.global.isShiftPressed,
            selector: (ctx) => ctx.application.canUndo,
            on: { color: Palette.GREEN_BLUE_BRIGHT, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            // Can not do UNDO - turn off
            pad: PADS.UNDO,
            priority: 85,
            when: (ctx) => ctx.global.isShiftPressed,
            selector: (ctx) => !ctx.application.canUndo,
            on: { color: Palette.OFF, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            // Turn off by default
            pad: PADS.UNDO,
            priority: 0,
            when: () => true,
            selector: () => true,
            on: { color: Palette.OFF, effect: EFFECTS.EFFECT_SOLID }
        },

        /* ─────────────────────────────
           AUTOMATION WRITE (PAD_19)
        ────────────────────────────── */

        {
            pad: PADS.PAD_19,
            priority: 100,
            when: (ctx) => ctx.global.isShiftPressed,
            selector: (ctx) => ctx.transport.automationWriteMode !== '',
            on: { color: Palette.YELLOW_BRIGHT3, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            pad: PADS.PAD_19,
            priority: 50,
            when: () => true,
            selector: (ctx) => ctx.transport.isArrangerAutomationWriteEnabled,
            on: { color: Palette.YELLOW_PALE, effect: EFFECTS.EFFECT_SOLID }
        },


        /* ─────────────────────────────
           QUANTIZATION
        ────────────────────────────── */

        {
            pad: PADS.QUANTIZATION,
            priority: 100,
            when: (ctx) => ctx.global.isShiftPressed,
            selector: (ctx) => !!ctx.application.recordQuantizationGrid,
            on: { color: Palette.BLUE_PALE, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            pad: PADS.QUANTIZATION,
            priority: 50,
            when: () => true,
            selector: (ctx) => ctx.application.recordQuantizeNoteLength,
            on: { color: Palette.GREEN_PALE, effect: EFFECTS.EFFECT_SOLID }
        },


        /* ─────────────────────────────
           PREROLL / METRONOME
        ────────────────────────────── */

        {
            pad: PADS.PREROLL,
            priority: 100,
            when: (ctx) => ctx.global.isShiftPressed,
            selector: (ctx) => ctx.transport.isMetronomeEnabled,
            on: { color: Palette.BLUE_PALE, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            pad: PADS.PREROLL,
            priority: 50,
            when: () => true,
            selector: (ctx) => ctx.transport.preroll !== '',
            on: { color: Palette.YELLOW_PALE, effect: EFFECTS.EFFECT_SOLID }
        },


        /* ─────────────────────────────
           ARM / SOLO
        ────────────────────────────── */

        {
            pad: PADS.ARM,
            priority: 200,
            when: (ctx) => ctx.track.arm,
            selector: (ctx) => ctx.track.mute,
            on: { color: Palette.WHITE_CYAN_TINT, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            pad: PADS.ARM,
            priority: 100,
            when: (ctx) => ctx.global.isShiftPressed,
            selector: (ctx) => ctx.track.mute,
            on: { color: Palette.BLUE_BRIGHT, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            pad: PADS.ARM,
            priority: 75,
            when: (ctx) => true,
            selector: (ctx) => ctx.track.mute,
            on: { color: Palette.BLUE_BRIGHT, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            pad: PADS.ARM,
            priority: 75,
            when: (ctx) => true,
            selector: (ctx) => ctx.track.solo,
            on: { color: Palette.PINK, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            pad: PADS.ARM,
            priority: 50,
            when: () => true,
            selector: (ctx) => ctx.track.arm,
            on: { color: Palette.RED_DIM2, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            pad: PADS.ARM,
            priority: 1,
            when: () => true,
            selector: () => true,
            on: { color: Palette.OFF, effect: EFFECTS.EFFECT_SOLID }
        },

        /* ─────────────────────────────
           MARKERS
        ────────────────────────────── */

        {
            pad: PADS.NEXT_MARKER,
            priority: 100,
            when: (ctx) => ctx.global.isShiftPressed,
            selector: () => true,
            on: { color: Palette.GREEN_PALE, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            pad: PADS.PREV_MARKER,
            priority: 50,
            when: () => true,
            selector: () => true,
            on: { color: Palette.BLUE_PALE, effect: EFFECTS.EFFECT_SOLID }
        },


        /* ─────────────────────────────
           REWIND / FAST FORWARD
        ────────────────────────────── */

        {
            pad: PADS.REWIND,
            priority: 50,
            when: () => true,
            selector: () => true,
            on: { color: Palette.YELLOW_DIM2, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            pad: PADS.FASTFORWARD,
            priority: 50,
            when: () => true,
            selector: () => true,
            on: { color: Palette.YELLOW_DIM2, effect: EFFECTS.EFFECT_SOLID }
        },

        /* ─────────────────────────────
           PAD22: Browser
        ────────────────────────────── */

        {
            // Open browser for track
            pad: PADS.PAD_22,
            priority: 100,
            when: (ctx) => !ctx.global.isShiftPressed,
            selector: (ctx) => !ctx.browser.browserActive,
            on: { color: Palette.PINK_LIGHT, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            // Open browser for device
            pad: PADS.PAD_22,
            priority: 99,
            when: (ctx) => ctx.global.isShiftPressed,
            selector: (ctx) => !ctx.browser.browserActive,
            on: { color: Palette.WHITE_CYAN_TINT, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            // Confirm browser
            pad: PADS.PAD_22,
            priority: 95,
            when: (ctx) => !ctx.global.isShiftPressed,
            selector: (ctx) => ctx.browser.browserActive,
            on: { color: Palette.LIME_BRIGHT, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            // Cancel browser
            pad: PADS.PAD_22,
            priority: 94,
            when: (ctx) => ctx.global.isShiftPressed,
            selector: (ctx) => ctx.browser.browserActive,
            on: { color: Palette.YELLOW_MID, effect: EFFECTS.EFFECT_SOLID }
        },
        {
            pad: PADS.PAD_22,
            priority: 50,
            when: () => true,
            selector: () => true,
            on: { color: Palette.YELLOW_DIM2, effect: EFFECTS.EFFECT_SOLID }
        },
    ],

    [MODES.PERFORM]: [
        {
            pad: PADS.PLAY,
            layer: PADS_LAYERS.BASE,
            selector: (ctx) => ctx.transport.isPlaying,
            on: {
                color: Palette.GREEN_PALE,
                effect: EFFECTS.EFFECT_SOLID
            },
            off: {
                color: Palette.OFF,
                effect: EFFECTS.EFFECT_SOLID
            }
        },
    ]
};
