# name=M-Vave SMK37-Pro
# supportedDevices=SMK37 Pro-Master, SMK37 Pro-Private
# url=https://forum.image-line.com/viewtopic.php?f=1914&t=277142

import time
import midi
import ui
import sys
import mixer
import transport
import channels
import playlist
import patterns
import plugins
import device
import general
import utils
import os
import json

class SMK37ProApp:
	def __init__(self, debug=True):
		self.debug_enabled = debug
		self.config = {}
		self.transport_map = {}
		self.arming_map = {}
		self.shift_pressed = False
		self.load_mapping()
		self.bind_mapping_to_actions()
		self.debug(f"Linked output device: {device.getName()} (Port {device.getPortNumber()})")
		# Try channel 0
		#device.midiOutMsg(0x90 | (94 << 8) | (127 << 16))
		# Try channel 10
		#device.midiOutMsg(0x99 | (94 << 8) | (127 << 16))
		#led_off(94)


	def debug(self, msg):
		"""Helper for debug output."""
		if self.debug_enabled:
			print(f"[DEBUG] {msg}")

	def load_mapping(self):
		path = './smk37pro_mapping.json'
		try:
			with open(path, "r") as f:
				self.config = json.load(f)
				self.debug(f"Mapping loaded: {self.config.keys()}")
		except Exception as e:
			print("Failed to load smk37pro_mapping.json:", e)
			self.config = {}

	def bind_mapping_to_actions(self):
		if not self.config:
			self.debug("Config is empty, cannot bind actions.")
			return

		pads = self.config.get("PADS", {})

		self.transport_map = {
			pads.get("PLAY"): lambda: (
				transport.start(),
				led_on(pads.get("PLAY"))  # LED ON
			),
			pads.get("PAUSE"): lambda: (
				transport.stop(),
				led_off(pads.get("PLAY")) 	# LED OFF
			),
			pads.get("RECORD"): lambda: (
				transport.record(),
				led_on(pads.get("RECORD"), 127 if transport.isRecording() else 0)
			),
			pads.get("REWIND"):	   lambda: transport.rewind(2),
			pads.get("FASTFORWARD"):  lambda: transport.fastForward(2),
			pads.get("NEXT_MARKER"): lambda: self.handle_marker_action(pads.get("NEXT_MARKER")),
			pads.get("PREV_MARKER"): lambda: self.handle_marker_action(pads.get("PREV_MARKER")),
			pads.get("UNDO"):		 lambda: general.undo(),
		}
		
		self.debug(f"Transport map keys: {list(self.transport_map.keys())}")

		arm = pads.get("ARM", {})
		low, high = arm.get("LOW"), arm.get("HIGH")

		if low is not None and high is not None:
			self.arming_map = {
				note: (lambda idx=i: channels.armTrack(idx))
				for i, note in enumerate(range(low, high + 1))
			}

		self.debug("Action maps bound")

	def handle_noteon(self, event):
		# Process only note on events
		if event.controlVal == 127:
			self.handle_transport(event)
			if not event.handled:
				self.handle_arming(event)

	def handle_transport(self, event):
		self.debug(f"Processing transport with event {event}")
		pads = self.config.get("PADS", {})
		self.debug(pads)
		if event.status == pads.get("STATUS"):
			action = self.transport_map.get(event.note)
			if action:
				action()
				event.handled = True
			else:
				self.debug(f"No action bound to note={event.note} in transport")
		else:
			self.debug(f"No action for status={event.status} in transport")

	def handle_arming(self, event):
		self.debug(f"Processing arming with event {event}")
		action = self.arming_map.get(event.note)
		if action:
			action()
			event.handled = True
	def handle_marker_action(self, note: int):
		"""Handle marker button actions with optional shift modifier"""
		pads = self.config.get("PADS", {})
		self.debug(f"Shift: {self.shift_pressed}")
		match (note, self.shift_pressed):
			case (n, True) if n == pads.get("NEXT_MARKER"):
				transport.setMarker()
				self.debug('Set new marker')
			case (n, True) if n == pads.get("PREV_MARKER"):
				transport.deleteMarker()
				self.debug('Delete marker')
			case (n, False) if n == pads.get("NEXT_MARKER"):
				transport.markerJumpJog(+1)
				self.debug('Move to next marker')
			case (n, False) if n == pads.get("PREV_MARKER"):
				transport.markerJumpJog(-1)		
				self.debug('Move to prev marker')

	def handle_cc(self, event):
		self.debug(f"Handling CC status={event.status}, channel={event.midiChan+1} CC={event.controlNum}")
		match (event.status):
			case _ if event.status == self.config["FADERS"]["STATUS"]:
				    self.handle_faders(event)
			case _ if event.status == self.config["PADS"]["STATUS"]:
			    self.handle_transport(event)
			case _:
			    self.debug(f"no handler for {event.status}")
		
	def handle_faders(self, event):
	# Handle shift pad
		self.check_shift(event)
		self.debug(f"Processing fader event {event}")
		faders = self.config.get("FADERS", {})
		if not faders:
			return

		if event.status == faders.get("STATUS") and event.midiChan + 1 == faders.get("CHANNEL"):
			base = faders["BASE_CC"]
			size = faders["SIZE"]
			if base <= event.controlNum < base + (size * faders["BANKS"]):
				idx = event.controlNum - base
				track = idx + 1
				volume = max(0.0, min(1.0, event.controlVal / 127.0))
				mixer.setTrackVolume(track, volume)
				event.handled = True
				self.debug(f"Fader {idx+1} -> Track {track} volume {volume:.2f}")
			else:
				self.debug(f"No handler for CC {event.controlNum}")
		else:
			self.debug(f"No handler for status={event.status}, channel={event.midiChan+1}")

	def handle_note_off(self, event):
		note = event.note
		ch   = event.midiChan

		# Release shift pad
		if ch == self.config["SHIFT"]["CHANNEL"] and note == self.config["SHIFT"]["KEY"]:
			self.debug('Shift released')
			self.shift_pressed = False
			event.handled = True

	def check_shift(self, event):
		if event.midiChan+1 == self.config["SHIFT"]["CHANNEL"] and event.note == self.config["SHIFT"]["KEY"]:
			
			self.shift_pressed = event.controlVal == 127
			self.debug(f'Shift status : {self.shift_pressed}')
			event.handled = True
			return	

	def handle_refresh(self, flags):
	# Sync play LED
	# HW_Dirty_LEDs	256	various changes in FL which require update of controller leds
	# update status leds (play/stop/record/active window/.....) on this flag
		self.debug('handle refresh')
# 		if flags.HW_Dirty_LEDs:
		if transport.isPlaying():
			led_on(self.config["PADS"].get("PLAY"))
		else:
			led_off(self.config["PADS"].get("PLAY"))

		# Sync record LED
		if transport.isRecording():
			led_on(self.config["PADS"].get("RECORD"))
		else:
			led_off(self.config["PADS"].get("RECORD"))		

# ---- Channel ops ----
	def arm_channel(self, idx):
		channels.selectOneChannel(idx)
		rec_enabled = channels.getChannelRecordEnabled(idx)
		channels.setChannelRecordEnabled(idx, not rec_enabled)
		ui.setHintMsg(f"Channel {idx+1} {'Armed' if not rec_enabled else 'Disarmed'}")

	def toggle_mute(self, idx):
		state = channels.isChannelMuted(idx)
		channels.setChannelMute(idx, not state)
		ui.setHintMsg(f"Channel {idx+1} {'Muted' if not state else 'Unmuted'}")		
		
def led_on(note, chan=0, velocity=127):
	try:
		print(f"[DEBUG] LED On: note={note}, chan={chan}, vel={velocity}")
		
		#device.midiOutMsg(0x99 + chan, note, velocity)
		status = 0x90 | (chan & 0x0F)
		device.midiOutMsg(status | (note << 8) | (velocity << 16))
	except RuntimeError:
		print(f"[WARN] Tried to send LED note={val} but no output port linked")

def led_off(note, chan=0):
	#device.midiOutMsg(0x99 + chan, note, 0)		
	device.midiOutMsg(0x90 | (note << 8) | (0 << 16))

