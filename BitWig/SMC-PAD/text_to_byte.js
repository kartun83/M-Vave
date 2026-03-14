const CHAR_TO_BYTE = {
    'a': 0x00, 'b': 0x01, 'c': 0x02, 'd': 0x03, 'e': 0x04, 'f': 0x05, 'g': 0x06, 'h': 0x07,
    'i': 0x08, 'j': 0x09, 'k': 0x0A, 'l': 0x0B, 'm': 0x0C,
    'n': 0x0D, 'o': 0x0E, 'p': 0x0F, 'q': 0x10, 'r': 0x11, 's': 0x12, 't': 0x13,
    'u': 0x14, 'v': 0x15, 'w': 0x16, 'x': 0x17, 'y': 0x18, 'z': 0x19,

    'A': 0x1A, 'B': 0x1B, 'C': 0x1C, 'D': 0x1D, 'E': 0x1E, 'F': 0x1F, 'G': 0x20, 'H': 0x21,
    'I': 0x22, 'J': 0x23, 'K': 0x24, 'L': 0x25, 'M': 0x26,
    'N': 0x27, 'O': 0x28, 'P': 0x29, 'Q': 0x2A, 'R': 0x2B, 'S': 0x2C, 'T': 0x2D,
    'U': 0x2E, 'V': 0x2F, 'W': 0x30, 'X': 0x31, 'Y': 0x32, 'Z': 0x33,

    '0': 0x34, '1': 0x35, '2': 0x36, '3': 0x37, '4': 0x38,
    '5': 0x39, '6': 0x3A, '7': 0x3B, '8': 0x3C, '9': 0x3D,

    '+': 0x3E, '-': 0x3F, '*': 0x40, '/': 0x41,
    ' ': 0x42, '.': 0x43, '#': 0x44
};

/**
 * Converts a string to an array of bytes based on the CHAR_TO_BYTE mapping.
 * Unknown characters default to 0x20.
 */
function textToBytes(text) {
    // const processedText = text.replace(/%/g, 'o/0');
    // return Array.from(processedText, char => CHAR_TO_BYTE[char] ?? 0x20);
    return Array.from(text, char => CHAR_TO_BYTE[char] ?? 0x20);
}

function toHex(bytes) {

    // let result = bytes.toString(16).toUpperCase().padStart(2, "0");
    // printDebugInfo(`ToHex: ${bytes}, result: ${result}`);
    return bytes.map(b => b.toString(16).padStart(2, "0")).join(" ").toUpperCase();
    // return bytes.toString(16).toUpperCase().padStart(2, "0");
}
