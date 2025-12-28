"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyBorderAndCenter = applyBorderAndCenter;
const borderExcel_1 = require("./borderExcel");
function applyBorderAndCenter({ worksheet, cells, vertical = "middle", horizontal = "center", }) {
    cells.forEach((addr) => {
        const cell = worksheet.getCell(addr);
        cell.alignment = { vertical: vertical, horizontal: horizontal };
        cell.border = Object.assign({}, borderExcel_1.fullBorder);
    });
}
