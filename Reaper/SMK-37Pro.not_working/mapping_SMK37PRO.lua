-- mappings.lua
-- External configuration for MIDI controller layout

local M = {}

M.DEBUG = true
M.NAME  = 'SMK37-Pro'
---------------------------------------
-- MIDI Ports (REAPER aliases or substrings)
---------------------------------------
M.MIDI_PORTS = {
    PRIVATE = "SMK%-37 Pro%-Private",  -- faders/knobs/shift input
    MASTER  = "SMK%-37 Pro%-Master",   -- keys input, pads in normal mode
    THIRD   = "SMK%-37 Pro%-Third"     -- LEDs output, pads - transport, arming etc
}

-- Pads (transport + undo + markers + arm)
M.PADS = {
    CHANNEL = 10,
    REWIND = 91,
    FASTFORWARD = 92,
    PAUSE = 93,
    PLAY = 94,
    RECORD = 95,
    PREV_MARKER = 46,
    NEXT_MARKER = 47,
    UNDO = 76,
    ARM = {
        LOW = 64,
        HIGH = 70
    }
}

-- Shift button
M.SHIFT = {
    CHANNEL = 10,
    KEY = 71
}

-- Faders (banked, CC type)
M.FADERS = {
    TYPE = 0xB0,   -- Control Change
    CHANNEL = 1,
    SIZE = 4,      -- 4 faders per bank
    BASE_CC = 64,  -- first CC
    BANKS = 2
}

-- Knobs (banked)
M.KNOBS = {
    CHANNEL = 6,   -- knobs send on channel 6
    SIZE = 8,      -- 8 knobs per bank
    BASE_CC = 48,  -- first CC for bank 1
    BANKS = 2
    -- MASTER_CC = 63, -- optional
}

-- Wheels (pitch + mod)
M.WHEELS = {
    PITCH = {
        CHANNEL = 3,
        KEY = 1
    },
    MOD = {
        CHANNEL = 4
        -- some controllers send CC#1 for modwheel
    }
}

-- Build tables for faders and knobs
M.CC_FADERS = {}
for bank=0, M.FADERS.BANKS-1 do
    for i=0, M.FADERS.SIZE-1 do
        table.insert(M.CC_FADERS, M.FADERS.BASE_CC + i + bank*M.FADERS.SIZE)
    end
end

-- Knobs
M.CC_KNOBS = {}
for bank=0, M.KNOBS.BANKS-1 do
    for i=0, M.KNOBS.SIZE-1 do
        table.insert(M.CC_KNOBS, M.KNOBS.BASE_CC + i + bank*M.KNOBS.SIZE)
    end
end

return M

