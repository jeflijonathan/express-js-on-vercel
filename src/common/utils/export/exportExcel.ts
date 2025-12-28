import ExcelJS from "exceljs";
import { Response } from "express";

export const exportExcel = async (
  res: Response,
  title: string,
  headers: string[],
  rows: (string | number)[][]
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(title);

  worksheet.addRow(headers);
  rows.forEach((row) => worksheet.addRow(row));

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename="${title}.xlsx"`);

  await workbook.xlsx.write(res);
  res.end();
};
