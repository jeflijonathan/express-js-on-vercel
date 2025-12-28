import { Worksheet } from "exceljs";

export function mergeAndSet(
    worksheet: Worksheet,
    startCol: number,
    startRow: number,
    endCol: number,
    endRow: number,
    value: string
) {
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
