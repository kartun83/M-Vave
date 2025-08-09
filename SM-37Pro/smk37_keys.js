function onMidiPortKeysMessage(status, data1, data2) {
    // Use the new logging function
    logMidiMessage("Keys", status, data1, data2);
    
    if (CONFIG.DEBUG) {
        println("Key MIDI Message processed");
    }
}