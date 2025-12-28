"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getColumnLetter(col) {
    let letter = "";
    while (col > 0) {
        const remainder = (col - 1) % 26;
        letter = String.fromCharCode(65 + remainder) + letter;
        col = Math.floor((col - 1) / 26);
    }
    return letter;
}
exports.default = getColumnLetter;
