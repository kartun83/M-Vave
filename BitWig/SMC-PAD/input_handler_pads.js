let shiftButton = null;

class InputHandlerPads {
  constructor(context, bindings) {
    this.context = context;
    this.bindings = bindings;
    this.name = "[InputHandlerPads]";
    this.idx = 0;
  }

  onMidi(status, data1, data2) {
    logMidiMessage(this.name, status, data1, data2);

    if (data2 === 0) return; // ignore releases


    //switch (globalState.modeSetting) {
    switch (applicationState.modeSetting) {
      case MODES.PRODUCTION:
        printDebugInfo(`Processing PAD in ${applicationState.modeSetting} mode: ${data1}`);
        //this._onRec(data1);
          this._handleTransport(data1);
        break;
      case MODES.PERFORM:
        printDebugInfo(`Processing PAD in ${applicationState.modeSetting} mode: ${data1}`);
        this._onArrange(data1);
        break;
      default:
        printDebugInfo(`Unsupported mode selected: ${applicationState.modeSetting}`);
    }
  }


  onSysex(data) {
    logSysexMessage(this.name, data);
  }

  // _handleArm(note) {
  //   const trackIndex = note - this.bindings.ARM.LOW;
  //   const track = hostObjects.trackBank.getItemAt(trackIndex);
  //   if (!track) return;
  //
  //   if (controllerState.isShiftPressed) {
  //     _cycleTrackState(track);
  //   } else {
  //     track.arm().toggle();
  //   }
  // }

  _onArrange(data) {
    displayErrorPopup(`PAD handling for mode "${applicationState.modeSetting}" not implemented`);
  }

  _handleTransport(note) {
    this._pads_transport(0, note, 127);
  }

  _pads_transport(status, data1, data2){
    // Check button presses (but not releases) in here
    // All pads toggling implemented in observers
    if (data2 > 0){
      // Cancel blinking if not in paused state
      // if (!transportInfo.isPaused) {
      //   blinkManager.stopBlinking(PADS.PAUSE.note);
      // }
      switch (data1) {
        case PADS.PAD_19.note:
            if (!controllerState.isShiftPressed) {
              hostObjects.transport.isArrangerAutomationWriteEnabled().toggle();
              printDebugInfo(`Setting Automation Write Enabled: ${hostObjects.transport.isArrangerAutomationWriteEnabled().get()}`);
            }
            else
            {
              bitwig_domains.transportDomain.automationWriteMode.cycleForward();
              printDebugInfo(`Set Automation Write mode ${bitwig_domains.transportDomain.automationWriteMode.getCurrent()}`);
            }
          break;
        case PADS.QUANTIZATION.note:
            if (!controllerState.isShiftPressed) {
              hostObjects.application.recordQuantizeNoteLength().toggle();
              printDebugInfo(`Setting recordQuantizeNote Enabled: ${hostObjects.application.recordQuantizeNoteLength().get()}`);
            }
            else
            {
              bitwig_domains.applicationDomain.record_quantization.cycleForward();
              printDebugInfo(`Set recordQuantizationGrid mode ${bitwig_domains.applicationDomain.record_quantization.getCurrent()}`);
            }
          break;
        case PADS.PAD_21.note:
          printDebugInfo(`Adjusting with Tap Tempo ${transportState.tempo}`);
          hostObjects.transport.tapTempo();
          break;
        case PADS.PAD_22.note:
          if (!browserState.browserActive) {
              controllerState.isShiftPressed ?
                hostObjects.cursorDevice.afterDeviceInsertionPoint().browse() :
                hostObjects.cursorTrack.afterTrackInsertionPoint().browse();
          }
          else
          {
            !controllerState.isShiftPressed ?
                hostObjects.browser.commit() :
                hostObjects.browser.cancel();
          }

          break;
        case PADS.PLAY.note: // Play
          // isPlaying = transport.isPlaying();
          // println('Playing:', isPlaying);
          // sendNoteOn(0, TRANSPORT.PLAY, isPlaying ? 127 : 0);
          // sendNoteOn(0, TRANSPORT.STOP, isPlaying ? 0 : 127);
          if (!browserState.browserActive) {
            if (!controllerState.isShiftPressed) {
              hostObjects.transport.togglePlay();
            } else {
              // printDebugInfo(`Tryng to change isActivated: ${hostObjects.cursorTrack.name()}`);
              hostObjects.cursorTrack.isActivated().toggle();
              // printDebugInfo(`Tring to change isActivated: ${hostObjects.cursorTrack.isActivated().get()}`);
            }
          }
          else
          {
            if (!controllerState.isShiftPressed) {
              hostObjects.browser.shouldAudition().toggle();
            }
          }
          // transportInfo.isPaused = !transportInfo.isPlaying;

          break;
        case PADS.PAUSE.note: // Pause
          // transport.stop();
          // pos = transport.getPosition().get();
          // println('Position:' + pos);
          // transport.setPosition();
            if (!controllerState.isShiftPressed) {
              transportState.isPaused = !transportState.isPaused;
              if (transportState.isPaused) {
                // startBlinking(TRANSPORT.PAUSE, CONFIG.BLINK_INTERVAL);
                // blinkManager.startBlinking(PADS.PAUSE.index, CONFIG.BLINK_INTERVAL);
                // deviceCommunicator.setPadLight(PADS.PAUSE.index, Palette.GREEN, EFFECTS.EFFECT_BREATHING);
              } else {
                // stopBlinking(TRANSPORT.PAUSE);
                // blinkManager.stopBlinking(PADS.PAUSE);
                // deviceCommunicator.setPadLight(PADS.PAUSE.index, Palette.GREEN, EFFECTS.EFFECT_SOLID);
              }
              hostObjects.transport.continuePlayback();
            }
            else
            {
              hostObjects.transport.isArrangerLoopEnabled().toggle();
              // printDebugInfo(`Tryng to change isActivated: ${hostObjects.cursorTrack.name()}`);
              // hostObjects.cursorTrack.isActivated().toggle();
              // printDebugInfo(`Tring to change isActivated: ${hostObjects.cursorTrack.isActivated().get()}`);
            }
          break;
        case PADS.RECORD.note: // Record
          // isRecording = transport.isArrangerRecordEnabled().get();
          // f(0, TRANSPORT.RECORD, on ? 127 : 0);

          if (!controllerState.isShiftPressed) {
            if (!transportState.isRecording) {
              printDebugInfo('Starting recording');
              hostObjects.transport.record();
              // sendNoteOn(0, PADS.RECORD, led_state.on);
              // transportInfo.isPaused = !transportInfo.isPlaying;
            } else {
              printDebugInfo('Stopping recording');
              hostObjects.transport.stop();
            }
          }
          else
          {
            hostObjects.transport.isArrangerOverdubEnabled().toggle();
            printDebugInfo(`Now overdub value: ${hostObjects.transport.isArrangerOverdubEnabled().get()}`)
          }
          break;
        case PADS.REWIND.note: // Back (rewind)
            if (!controllerState.isShiftPressed) {
              hostObjects.transport.rewind();
            }else
            {
              hostObjects.transport.incPosition(-CONFIG.rewindAmount, true);
            }
          break;
        case PADS.FASTFORWARD.note: // Forward (fast-forward)
           if (!controllerState.isShiftPressed) {
             hostObjects.transport.fastForward();
           }
           else
           {
               hostObjects.transport.incPosition(CONFIG.rewindAmount, true);
           }
          break;
        case PADS.PREV_MARKER.note: // Previous (clip/marker)
          // if (controllerState.isShiftPressed){
          //     hostObjects.transport.cue
          // }
          // else{
          //   !controllerState.isShiftPressed ?
              hostObjects.transport.jumpToPreviousCueMarker()
              // : hostObjects.application.enter();
          // }
          break;
        case PADS.NEXT_MARKER.note: // Next (clip/marker)
            printDebugInfo('Handing next marker');
          if (controllerState.isShiftPressed){
            hostObjects.transport.addCueMarkerAtPlaybackPosition();
            hostObjects.arranger.areCueMarkersVisible().set(true);
          }
          else{
            hostObjects.transport.jumpToNextCueMarker();
          }
          break;
        case PADS.UNDO.note:
          if (controllerState.isShiftPressed){
            printDebugInfo('Doing redo');
            hostObjects.application.redo();
          }else{
            printDebugInfo('Doing undo');
            hostObjects.application.undo();
          }
          break;
        case PADS.ARM.note:
            if (controllerState.isShiftPressed){
              this._cycleTrackState(hostObjects.cursorTrack, PADS.ARM.index);
            }else
            {
              hostObjects.cursorTrack.arm().toggle();
              // deviceCommunicator.setPadLight(PADS.ARM.index, Palette.RED_DIM2);
              // isActivated = !isActivated;
            }
          //   const trackIndex = note - this.bindings.ARM.LOW;
          //   const track = hostObjects.trackBank.getItemAt(trackIndex);
          //   if (!track) return;
          //
          //   if (controllerState.isShiftPressed) {
          //     _cycleTrackState(track);
          //   } else {
          //     track.arm().toggle();
          //   }
            break;
        case PADS.PAD_23.note:
          if (!controllerState.isShiftPressed) {
            hostObjects.cursorDevice.isEnabled().toggle();
          }
          else
          {
            hostObjects.cursorDevice.isWindowOpen().toggle();
            // bitwig_domains.transportDomain.preroll.cycleForward();
            printDebugInfo(`PR: ${bitwig_domains.transportDomain.preroll.getCurrent()}`);
            // deviceCommunicator.sendStringMessage(`PR - ${next}`);
          }
          break;
        case PADS.PREROLL.note:
          if (controllerState.isShiftPressed) {
              hostObjects.transport.isMetronomeEnabled().toggle();
          }
          else
          {
            bitwig_domains.transportDomain.preroll.cycleForward();
            printDebugInfo(`PR: ${bitwig_domains.transportDomain.preroll.getCurrent()}`);
            // deviceCommunicator.sendStringMessage(`PR - ${next}`);
          }
          break;
        }

      printDebugInfo("Pad MIDI Message processed");
    }
    else
    {
      printDebugInfo(`Ignoring keyrelease ${status}, ${data1}`)
    }
  }

  _cycleTrackState(track, pad) {
    const isSolo = track.solo().get();
    const isMute = track.mute().get();

    if (!isSolo && !isMute) {
      track.solo().set(true);      // first press → Solo
      //deviceCommunicator.setPadLight(pad, Palette.GREEN);
      printDebugInfo(`Set solo`);
    } else if (isSolo) {
      track.solo().set(false);
      track.mute().set(true);      // second press → Mute
      //deviceCommunicator.setPadLight(pad, Palette.BLUE_DIM);
      printDebugInfo(`Set mute`);
    } else if (isMute) {
      track.mute().set(false);     // third press → Nothing
      //deviceCommunicator.setPadLight(pad, Palette.OFF);
      printDebugInfo(`Set noting`);
    }
  }
}
