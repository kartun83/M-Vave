class HostEnum {
    constructor(settableEnumValue) {
        this._value = settableEnumValue;

        const def = settableEnumValue.enumDefinition();
        const count = def.getValueCount();

        this._ids = [];
        this._indexMap = {};

        for (let i = 0; i < count; i++) {
            const id = def.valueDefinitionAt(i).getId();
            this._ids.push(id);
            this._indexMap[id] = i;
        }
    }

    // ----- definition -----

    get ids() {
        return this._ids.slice();
    }

    count() {
        return this._ids.length;
    }

    has(id) {
        return this._indexMap[id] !== undefined;
    }

    indexOf(id) {
        return this._indexMap[id];
    }

    idAt(index) {
        return this._ids[index];
    }

    // ----- dynamic state -----

    getCurrent() {
        return this._value.get();
    }

    set(id) {
        this._value.set(id);
    }

    cycle(direction = 1, externalCurrent = null) {
        const current =
            externalCurrent !== null
                ? externalCurrent
                : this._value.get();

        const idx = this._indexMap[current];
        if (idx === undefined) return;

        const nextIndex =
            (idx + direction + this._ids.length) % this._ids.length;

        this._value.set(this._ids[nextIndex]);
    }

    cycleForward(current = null) {
        this.cycle(1, current);
    }

    cycleBackward(current = null) {
        this.cycle(-1, current);
    }
}

function initDomains(hostObjects) {
    return {
            transportDomain: {
                preroll: new HostEnum(
                    hostObjects.transport.preRoll()
                ),
                automationWriteMode: new HostEnum(
                    hostObjects.transport.automationWriteMode()
                )
            },
            applicationDomain: {
                record_quantization: new HostEnum(
                    hostObjects.application.recordQuantizationGrid()
                )
            },
            deviceDomain: {
                // audio-effect,note-effect,instrument,note-detector
                deviceType: new HostEnum(
                    hostObjects.cursorDevice.deviceType()
                )
            },
            // browserDomain: {
            //     contentType: new HostEnum(
            //         hostObjects.browser.contentTypeNames()
            //     )
            // }
    };
}