class ObservableState {
    constructor() {
        this._listeners = [];
    }

    onChange(cb) {
        this._listeners.push(cb);
    }

    _notify(scope) {
        for (const l of this._listeners) l(scope);
    }

    _merge(target, patch) {
        let changed = false;

        for (const key in patch) {
            if (target[key] !== patch[key]) {
                target[key] = patch[key];
                changed = true;
            }
        }

        return changed;
    }
}

class BaseState extends ObservableState {
    constructor(initialState = {}) {
        super();
        Object.assign(this, initialState);
    }

    update(key, value) {
        if (!(key in this)) return;

        if (this[key] !== value) {
            this[key] = value;
            this._notify(key);
        }
    }
}

class CollectionState extends ObservableState {
    constructor(size, factory) {
        super();
        this.items = Array.from({ length: size }, factory);
    }

    update(index, patch) {
        const target = this.items[index];
        if (!target) return;

        if (this._merge(target, patch)) {
            this._notify(index);
        }
    }

    get(index) {
        return this.items[index];
    }
}

class DeviceState extends ObservableState {
    constructor(size) {
        super();

        this.page = 0;

        this.params = Array.from({ length: size }, () => ({
            name: "",
            valueText: "",
            valueNorm: 0
        }));
    }

    setPage(index) {
        if (this.page === index) return;
        this.page = index;
        this._notify("page");
    }

    update(index, patch) {
        const target = this.params[index];
        if (!target) return;

        if (this._merge(target, patch)) {
            this._notify(index);
        }
    }
}

const sendState = new CollectionState(
    // sendBank.getSizeOfBank(),
    CONFIG.numKnobParams,
    () => ({
        name: "",
        valueNorm: 0,
        valueText: "",
        exists: false
    })
);

class TrackState extends ObservableState {
    constructor() {
        super();

        this.volume = {
            valueNorm: 0,
            valueText: ""
        };

        this.pan = {
            valueNorm: 0,
            valueText: ""
        };

        this.arm = false;
        this.solo = false;
        this.mute = false;
        this.isActivated = true;
    }

    updateSection(section, patch) {
        const target = this[section];
        if (!target) return;

        if (this._merge(target, patch)) {
            this._notify(section);
        }
    }

    update(key, value) {
        if (this[key] !== value) {
            this[key] = value;
            this._notify(key);
        }
    }
}

const applicationState = new BaseState
        ({
            canUndo: false,
            canRedo: false,
            recordQuantizeNoteLength: false,
            recordQuantizationGrid: null,
            modeSetting: null,
            // browserActive: false,
            // browserSelectedItem: null,
        });

const transportState = new BaseState
    ({
            isRecording: false,
            isPlaying: false,
            isArrangerOverdubEnabled: false,
            isPunchInEnabled: false,
            isPunchOutEnabled: false,
            isMetronomeTickPlaybackEnabled: false,
            isArrangerRecordEnabled: false,
            tempo: 0,
            tsNumerator: 4,
            tsDenominator: 4,
            playbackPosition: 0.0,
            playStartPosition: 0.0,
            isPaused: false,
            isFillModeActive: false,
            isMetronomeEnabled: false,
            metronome_ticks: false,
            preroll: '',
            isArrangerLoopEnabled: false,
            isArrangerAutomationWriteEnabled: false,
            automationWriteMode: '',
            isMetronomeAudibleDuringPreRoll: false,
        });

const browserState = new BaseState
({
    title: "",
    selectedContentTypeName: "",
    browserActive: false,
    browserSelectedItem: null,
    selectedContentTypeIndex: null,
    canAudition: false,
    shouldAudition: false,
});
