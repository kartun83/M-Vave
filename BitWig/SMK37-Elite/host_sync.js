class TransportHostSync {
    constructor(transport, transportState) {
        this.transport = transport;
        this.state = transportState;
    }

    declareObservables() {
        this.transport.isPlaying().markInterested();
        this.transport.isArrangerRecordEnabled().markInterested();
        this.transport.preRoll().markInterested();
    }

    bindObservers() {
        this.transport.isPlaying().addValueObserver(on => {
            this.state.setPlaying(on);
        });

        this.transport.isArrangerRecordEnabled().addValueObserver(on => {
            this.state.setRecording(on);
        });

        this.transport.preRoll().addValueObserver(value => {
            this.state.setPreroll(value);
        });
    }
}


class CursorHostSync {
    constructor(cursor, cursorState) {
        this.cursor = cursor;
        this.state = cursorState;
    }

    declareObservables() {
        cursorTrack.hasPrevious().markInterested();
        cursorTrack.hasNext().markInterested();
        cursorTrack.solo().markInterested();
        cursorTrack.mute().markInterested();
    }

    bindObservers() {
        function _markCursorTrackValues(cursorTrack) {
            cursorTrack.name().addValueObserver(function(trackName) {
                this.state.setTrackName(trackName);
                // printDebugInfo(`Selected track: ${trackName}`);
                // deviceCommunicator.sendStringMessage(trackName);
                // updateDeviceInfo(cursorDevice);
            });
        }
    }
}