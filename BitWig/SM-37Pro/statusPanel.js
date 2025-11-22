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