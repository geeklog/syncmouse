const reverseMap = (map) => {
  const reversed = {};
  for (const k in map) {
    reversed[map[k]] = k;
  }
  return reversed;
};

const keymap = {
  "1": 2,
  "2": 3,
  "3": 4,
  "4": 5,
  "5": 6,
  "6": 7,
  "7": 8,
  "8": 9,
  "9": 10,
  "0": 11,
  "-": 12,
  "=": 13,
  "q": 16,
  "w": 17,
  "e": 18,
  "r": 19,
  "t": 20,
  "y": 21,
  "u": 22,
  "i": 23,
  "o": 24,
  "p": 25,
  "[": 26,
  "]": 27,
  "a": 30,
  "s": 31,
  "d": 32,
  "f": 33,
  "g": 34,
  "h": 35,
  "j": 36,
  "k": 37,
  "l": 38,
  ";": 39,
  "'": 40,
  "`": 41,
  "\\": 43,
  "z": 44,
  "x": 45,
  "c": 46,
  "v": 47,
  "b": 48,
  "n": 49,
  "m": 50,
  ",": 51,
  ".": 52,
  "/": 53,
  "enter": 28,
  "shift": 42,
  "ctrl": 29,
  "meta": 3675,
  "backspace": 14,
};

exports.charKeys = keymap;
exports.keyChars = reverseMap(keymap);
