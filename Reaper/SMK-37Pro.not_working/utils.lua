-- utils.lua
-- General helper functions

local U = {}

-- Debug logging (toggleable)
U.DEBUG = true
function U.log(msg)
    if U.DEBUG then
        reaper.ShowConsoleMsg(tostring(msg) .. "\n")
    end
end

-- Clamp value to a range
function U.clamp(val, min, max)
    if val < min then return min end
    if val > max then return max end
    return val
end

-- Simple table copy
function U.copyTable(tbl)
    local t2 = {}
    for k,v in pairs(tbl) do t2[k]=v end
    return t2
end

-- MIDI port finder by substring / alias
function U.findMIDIPort(pattern)
    for i = 0, reaper.GetNumMIDIInputs()-1 do
        local _, name = reaper.GetMIDIInputName(i, "")
        if name:match(pattern) then return i end
    end
    return nil  -- explicitly return nil if not found
end

return U

