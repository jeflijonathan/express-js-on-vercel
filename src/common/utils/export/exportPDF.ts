import PDFDocument from "pdfkit";
import { Response } from "express";

export const exportPdf = (
  res: Response,
  title: string,
  headers: string[],
  rows: (string | number)[][]
) => {
  const doc = new PDFDocument();
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
