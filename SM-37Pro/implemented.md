# Implemented

# Important keybinding changes
This setup tries to stick as close as possible to default mapping, but
for simplicity of code and convenience some changes have to be applied to default mapping.

* Pad 24 (on bank 2) must me remapped to Momentary with code 71. As M-Vave didn't care to 
add separate **SHIFT button** this pad is used as **SHIFT**
![shift_mapping.png](img/shift_mapping.png)

* Knobs on bank 2 (9-16) have to be mapped on channel 6 (like those on bank 1) and type "**CC**"

For your convinience you may use mapped_preset.smk37 from this repo.

## Pad BANK 2
Pads are turned off when inactive, turns on when active

* Play - Toggle Play/Stop. Resumes from "Play start" marker
* Record
* Pause - blinking led while on pause. Resumes where it was paused
* Track navigation:
	* Rewind - move play position one bar back 
	* Forward - move play position one bar forward
* Cue:
	* Next
    * Next + Shift - Add cue at current position
	* Previous 

## Pad BANK 2 - top row, 8 rec mode
* Without SHIFT - Arming Tracks 1-7 with LED output
* With SHIFT - Cycle through Solo-Mute-Nothing
