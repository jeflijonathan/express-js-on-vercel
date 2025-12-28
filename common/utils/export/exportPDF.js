"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportPdf = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const exportPdf = (res, title, headers, rows) => {
    const doc = new pdfkit_1.default();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${title}.pdf"`);
    doc.pipe(res);
    doc.fontSize(16).text(title, { align: "center" }).moveDown();
    headers.forEach((header, i) => {
        doc
            .font("Helvetica-Bold")
            .text(header, { continued: i < headers.length - 1 });
    });
    doc.moveDown();
    rows.forEach((row) => {
        row.forEach((cell, i) => {
            doc
                .font("Helvetica")
                .text(String(cell), { continued: i < row.length - 1 });
        });
        doc.moveDown();
    });
    doc.end();
};
exports.exportPdf = exportPdf;
