-- Controller_SMK37Pro.lua
-- Custom REAPER Controller Script for SMK37-Pro (Lua)
-- Transport + knobs/faders + shift layer + undo/redo
-- Multi-port support (PRIVATE + MASTER input, THIRD output)

-- Load mapping & utils
local info = debug.getinfo(1,'S')
local script_path = info.source:match([[^@?(.*[\/])]]) -- folder of this script
local mapping = dofile(script_path .. "mapping_SMK37PRO.lua")
if not mapping then return reaper.ShowConsoleMsg("ERROR: Could not load mapping_SMK37PRO.lua\n") end
local utils   = dofile(script_path .. "utils.lua")
if not utils then return reaper.ShowConsoleMsg("ERROR: Could not load utils.lua\n") end

-- Set debug
utils.DEBUG = mapping.DEBUG

-- Find ports
local PORT_PRIVATE = utils.findMIDIPort(mapping.MIDI_PORTS.PRIVATE)
local PORT_MASTER  = utils.findMIDIPort(mapping.MIDI_PORTS.MASTER)
local PORT_THIRD   = utils.findMIDIPort(mapping.MIDI_PORTS.THIRD)

if PORT_PRIVATE == nil or PORT_MASTER == nil then
    reaper.ShowMessageBox(mapping.NAME.." required ports not found!", "Error", 0)
    return
end

-- Get names safely
local _, privateName = reaper.GetMIDIInputName(PORT_PRIVATE, "")
local _, masterName  = reaper.GetMIDIInputName(PORT_MASTER, "")
local thirdName = "N/A"
if PORT_THIRD then
    local _, n = reaper.GetMIDIInputName(PORT_THIRD, "")
    thirdName = n
end

utils.log("Ports loaded: Private="..privateName
          ..", Master="..masterName
          ..", Third="..thirdName)

-- State
local shiftHeld = false
local lastCC = {}

-- -----------------------------
-- Mapping helpers
-- -----------------------------

local padActions = {
    [mapping.SHIFT.KEY] = function(vel) shiftHeld = (vel > 0); utils.log("Shift "..(shiftHeld and "ON" or "OFF")) end,
    [mapping.PADS.UNDO]  = function(vel)
        if vel > 0 then
            if shiftHeld then
                reaper.Main_OnCommand(40030, 0) -- Redo
                utils.log("Redo")
            else
                reaper.Main_OnCommand(40029, 0) -- Undo
                utils.log("Undo")
            end
        end
    end,
    [mapping.PADS.PLAY]  = function(vel) if vel>0 then reaper.Main_OnCommand(1007,0); utils.log("Play") end end,
    --[mapping.PADS.STOP]  = function(vel) if vel>0 then reaper.Main_OnCommand(1016,0); utils.log("Stop") end end,
    [mapping.PADS.RECORD]   = function(vel) if vel>0 then reaper.Main_OnCommand(1013,0); utils.log("Record") end end,
    [mapping.PADS.PAUSE] = function(vel) if vel>0 then reaper.Main_OnCommand(1008,0); utils.log("Pause") end end,
}

-- Pad handler
local function handlePad(note, vel)
    local fn = padActions[note]
    if fn then fn(vel) end
end

-- Fader mapping
local function mapFader(trackIndex, val, shifted)
    local track = reaper.GetTrack(0, trackIndex)
    if not track then return end

    if shifted then
        local trim = (val/127)*24 - 12
        reaper.SetMediaTrackInfo_Value(track,"D_PANLAW", trim) -- placeholder
        utils.log(("Shift Fader %d → Track %d Trim=%.2f dB"):format(trackIndex+1, trackIndex+1, trim))
    else
        local vol = val/127
        reaper.SetMediaTrackInfo_Value(track,"D_VOL", vol)
        utils.log(("Fader %d → Track %d Volume=%.2f"):format(trackIndex+1, trackIndex+1, vol))
    end
end

-- Knob mapping
local function mapKnob(index, val, shifted)
    local trackIndex = (index-1)%8
    local track = reaper.GetTrack(0, trackIndex)
    if not track then return end

    if not shifted then
        if index<=8 then
            local pan = (val-64)/64
            reaper.SetMediaTrackInfo_Value(track,"D_PAN",pan)
            utils.log(("Knob %d → Track %d Pan=%.2f"):format(index, trackIndex+1, pan))
        else
            local sendVol = val/127
            reaper.SetTrackSendInfo_Value(track,0,0,"D_VOL",sendVol)
            utils.log(("Knob %d → Track %d Send1=%.2f"):format(index, trackIndex+1, sendVol))
        end
    else
        local sendVol = val/127
        if index<=8 then
            reaper.SetTrackSendInfo_Value(track,0,1,"D_VOL",sendVol)
            utils.log(("Shift Knob %d → Track %d Send2=%.2f"):format(index, trackIndex+1, sendVol))
        else
            reaper.SetTrackSendInfo_Value(track,0,2,"D_VOL",sendVol)
            utils.log(("Shift Knob %d → Track %d Send3=%.2f"):format(index, trackIndex+1, sendVol))
        end
    end
end

-- Handle CC messages
local function handleCC(cc, val)
    for i,num in ipairs(mapping.CC_FADERS) do
        if cc==num then mapFader(i-1,val,shiftHeld); return end
    end
    for i,num in ipairs(mapping.CC_KNOBS) do
        if cc==num then mapKnob(i,val,shiftHeld); return end
    end
end

-- -----------------------------
-- MIDI polling
-- -----------------------------
local function pollPort(port)
  
    if not port then utils.log('Tried to pollPort without value') return end
    --utils.log('Polling' .. port )
    local ok, msg = reaper.MIDI_GetRecentInputEvent(port)
  --if ok then
    --utils.log('msg:' .. msg)
  --end
  if ok and msg and #msg >= 3 then
      local status = msg:byte(1)
      local data1  = msg:byte(2)
      local data2  = msg:byte(3)
      local typ    = status >> 4
      utils.log(("Port %d: status=0x%X data1=%d data2=%d"):format(port,status,data1,data2))

      if typ == 0xB then
    if lastCC[data1] ~= data2 then
        lastCC[data1] = data2
        handleCC(data1, data2)
    end
      elseif typ == 0x9 or typ == 0x8 then
    handlePad(data1, data2)
      end
  end
end

-- Main loop
local function main()
    pollPort(PORT_PRIVATE)
    pollPort(PORT_MASTER)
    reaper.defer(main)
end

-- Init
if mapping.DEBUG then reaper.ShowConsoleMsg("Controller Script "..mapping.NAME.." running...\n") end
main()

