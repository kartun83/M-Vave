// Robust Blink Manager Class for Bitwig API
// Works with one-shot scheduleTask (no cancelTask available)
function BlinkManager() {
    this.blinkStates = {};
    this.activeBlinking = {}; // Track which notes are actively blinking
    
    this.startBlinking = function(noteNumber, intervalMs, channel) {
        channel = channel || 0;
        var key = noteNumber + '_' + channel;
        
        // Stop if already blinking
        this.stopBlinking(noteNumber, channel);
        
        // Mark as active and set initial state
        this.activeBlinking[key] = true;
        this.blinkStates[key] = true;
        sendNoteOn(channel, noteNumber, 127);
        
        var self = this;
        
        function blinkCallback() {
            // Check if this blink task should still be running
            if (!self.activeBlinking[key]) {
                return; // Stop execution if blinking was stopped
            }
            
            // Toggle state and send MIDI
            self.blinkStates[key] = !self.blinkStates[key];
            sendNoteOn(channel, noteNumber, self.blinkStates[key] ? 127 : 0);
            
            // Schedule next blink (one-shot, so we manually reschedule)
            host.scheduleTask(blinkCallback, intervalMs);
        }
        
        // Start the blinking cycle
        host.scheduleTask(blinkCallback, intervalMs);
    };
    
    this.stopBlinking = function(noteNumber, channel) {
        channel = channel || 0;
        var key = noteNumber + '_' + channel;
        
        if (this.activeBlinking[key]) {
            printDebugInfo(`Stopping blink for key ${key}`);
            // Mark as inactive (the running task will check this and stop)
            this.activeBlinking[key] = false;
            delete this.activeBlinking[key];
            delete this.blinkStates[key];
            // Ensure LED is off
            sendNoteOn(channel, noteNumber, 0);
        } else {
            println(`BlinkTask for ${key} not found or already stopped`);
        }
    };
    
    this.stopAll = function() {
        for (var key in this.activeBlinking) {
            if (this.activeBlinking.hasOwnProperty(key)) {
                var parts = key.split('_');
                this.stopBlinking(parseInt(parts[0]), parseInt(parts[1]));
            }
        }
    };
    
    this.isBlinking = function(noteNumber, channel) {
        channel = channel || 0;
        var key = noteNumber + '_' + channel;
        return !!this.activeBlinking[key];
    };
}