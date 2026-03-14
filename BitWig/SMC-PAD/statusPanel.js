function createStatusPanel(host) {
    const status = host.createUserControls(3);
    status.getControl(0).setLabel("Fader Page");
    status.getControl(1).setLabel("Knob Page");
    status.getControl(2).setLabel("Pad Page");

    return {
        setFaderPage(name) {
            status.getControl(0).setLabel(`Fader: ${name}`);
        },
        setKnobPage(name) {
            status.getControl(1).setLabel(`Knob: ${name}`);
        },
        setPadPage(name) {
            status.getControl(2).setLabel(`Pad: ${name}`);
        }
    };
}

function createStatusPanel2(host) {
    var Knobs1 = [7, 74, 71, 76, 77, 93, 73, 75];
    var Knobs2 = [114, 18, 19, 16, 17, 91, 79, 72];
    uControl = host.createUserControls(16);

    //setIndications("track");

    for (var i = 0; i < 8; i++) {
        uControl.getControl(i).setLabel("CC " + Knobs1[i])
        uControl.getControl(i + 8).setLabel("CC " + Knobs2[i])
    }
}