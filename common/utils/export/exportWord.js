"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportWord = void 0;
const docx_1 = require("docx");
const exportWord = (res, title, headers, rows) => __awaiter(void 0, void 0, void 0, function* () {
    const sectionChildren = [
        new docx_1.Paragraph({
            children: [new docx_1.TextRun({ text: title, bold: true, size: 28 })],
        }),
        new docx_1.Paragraph({
            children: headers.map((h) => new docx_1.TextRun({ text: h + " | ", bold: true })),
        }),
        ...rows.map((row) => new docx_1.Paragraph({
            children: row.map((cell) => new docx_1.TextRun(String(cell) + " | ")),
        })),
    ];
    const doc = new docx_1.Document({
        sections: [
            {
                properties: {},
                children: sectionChildren,
            },
        ],
    });
    const buffer = yield docx_1.Packer.toBuffer(doc);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename="${title}.docx"`);
    res.send(buffer);
});
exports.exportWord = exportWord;
