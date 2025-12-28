import { Document, Packer, Paragraph, TextRun } from "docx";
import { Response } from "express";

export const exportWord = async (
  res: Response,
  title: string,
  headers: string[],
  rows: (string | number)[][]
) => {
  const sectionChildren = [
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, size: 28 })],
    }),

    new Paragraph({
      children: headers.map(
        (h) => new TextRun({ text: h + " | ", bold: true })
      ),
    }),
    ...rows.map(
      (row) =>
        new Paragraph({
          children: row.map((cell) => new TextRun(String(cell) + " | ")),
        })
    ),
  ];

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sectionChildren,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
  res.setHeader("Content-Disposition", `attachment; filename="${title}.docx"`);

  res.send(buffer);
};
