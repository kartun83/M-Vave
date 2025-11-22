// function createDebugPage(host) {
//     const page = host.createUserControls(1); // 1 "fake" control
//
//     const debugToggle = page.getControl(0);
//     debugToggle.setLabel("Debug Mode");
//     debugToggle.set(0); // default OFF
//
//     debugToggle.markInterested();
//
//     // debugToggle.addValueObserver(updateDebugValue);
//
//     return page;
// }
//
// function updateDebugValue(new_value) {
//     CONFIG.DEBUG = value > 0.5;
//     println("DEBUG MODE: " + (CONFIG.DEBUG ? "ON" : "OFF"));
// }