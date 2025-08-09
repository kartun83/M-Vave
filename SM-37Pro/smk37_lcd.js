var SYSEX_HDR = "f0 00 00 66 14";
var DISPLAY_WIDTH = 56;
var COLUMN_WIDTH = 7;
var TOTAL_DISPLAY_SIZE = DISPLAY_WIDTH * 2;

// Copied from Mackie controller, doesn't work ((

function writeToLCD(row, x, text, len)
{
    printDebugInfo(`Trying to print ${text}`);
	var pos = row * 0x38 + x;
	sendSysex(SYSEX_HDR + "12" + uint7ToHex(pos) + text.toHex(len) + "f7");
}

function clearLCD()
{
    printDebugInfo('Trying to clear LCD');
	for ( var i = 0; i < 56; i++)
	{
		writeToLCD(0, 0, " ", 1);
		writeToLCD(0, 1, " ", 1);
	}
}