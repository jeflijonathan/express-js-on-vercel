"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeAndSet = mergeAndSet;
function mergeAndSet(worksheet, startCol, startRow, endCol, endRow, value) {
    worksheet.mergeCells(startRow, startCol, endRow, endCol);
    const cell = worksheet.getCell(startRow, startCol);
    cell.value = value;
    cell.alignment = {
        vertical: "middle",
        horizontal: "center",
    };
    cell.font = { bold: true };
    cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
    };
}
