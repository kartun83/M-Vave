# name=M-Vave SMK37-Pro
# supportedDevices=SMK37 Pro-Master, SMK37 Pro-Private
# url=https://forum.image-line.com/viewtopic.php?f=1914&t=277142

from smk37pro_app import SMK37ProApp

import device

app = SMK37ProApp(debug=True)

# --- FL Studio Hooks ---
def OnInit():    	    
    device.setHasMeters()
    print("Controller initialized")

def OnDeInit():
    print("Controller de-initialized")

def OnFirstConnect():
    print("SMK37-Pro connected for the first time")

def OnMidiMsg(event):
    app.debug(f"MIDI Msg: status={event.status}, chan={event.midiChan}, note={event.note}, cc={event.controlNum}, val={event.controlVal}")

def OnNoteOn(event):
    app.debug(f"NoteOn {event}")
    app.debug(f"NoteOn {event} val={event.velocity if hasattr(event, 'velocity') else event.controlVal}")
    app.handle_noteon(event)
    
def OnRefresh(flags):    
    app.handle_refresh(flags)

def OnControlChange(event):
    app.debug(f"ControlChange {event}")
    app.handle_cc(event)
