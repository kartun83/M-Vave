# Installation

This repository contains a custom **ReaScript MIDI Controller Script** for REAPER.  
Follow the instructions below to install it on your system.  

---

## 1. Locate Your REAPER Scripts Folder

ReaScripts can be stored anywhere, but for convenience it’s best to keep them in REAPER’s **Scripts** directory:

### **Windows**
%APPDATA%\REAPER\Scripts\

Example:

> `C:\Users\<YourUser>\AppData\Roaming\REAPER\Scripts\`

#### Portable REAPER Installation (Windows)

If you are using a **portable installation of REAPER**, all files (including scripts, configs, and extensions) live inside the portable folder.  

##### Steps:

1. Locate your REAPER portable folder.  
   Example:  

> `D:\Audio\ReaperPortable\`

2. Inside it, navigate to:

> `ReaperPortable\REAPER\Scripts\`

### **macOS**
> `~/Library/Application Support/REAPER/Scripts/`

### **Linux**
`~/.config/REAPER/Scripts/`

> 💡 If the `Scripts` folder does not exist, create it manually.

#### *Portable (Linux)*
If you don't install Reaper in system and run from exacted archive you may use Scripts folder inside that location

> `<location>/REAPER/InstallData/Scripts`

## 2. Copy complete folder for selected controller
## 3. Load the Script in REAPER

1. Open REAPER.  
2. Go to **Actions → Show Action List**.  
3. Click **New action->Load ReaScript...** (bottom right).  
4. Navigate to your `Scripts/MyController/` folder and select `controller.lua`.  
5. The script will now appear in the Action List and can be run manually.

## Aliasing
### Linux  
In Linux REAPER use hardware names, script use human friendly names.
Example:

`amidi -l
Dir Device    Name
IO  hw:5,0,0  SMK-37 Pro-Private
IO  hw:5,0,1  SMK-37 Pro-Master
IO  hw:5,0,2`  
---

Find readable names

![Find actual readable names](doc/linux_mapping.jpg)

Define aliases for every port (script use aliases)
![image caption](doc/define_alias_linux.png)

For unnamed port define "SMK-37 Pro-Third"

Final result should be like this:
![image caption](doc/final_mapping_linux.png)

Do the same for MIDI output devices, and enable output to it.
** TODO ** check which one should be defined as output

## 4. Set Up as a Startup Action (Optional)

If you want the controller script to auto-run when REAPER launches:

1. Open **Actions → Show Action List**.  
2. Search for your script.  
3. Right-click → **Set as Global Startup Action**.  

---

## 5. Enable MIDI Controller Input

1. Go to **Options → Preferences → MIDI Devices**.  
2. Enable your controller as **Input** (and **Output** if you want LED feedback).  
3. Make sure it is **NOT enabled as Control Input** (to avoid REAPER’s default MIDI learn interfering).  
4. Restart the script if necessary.  
