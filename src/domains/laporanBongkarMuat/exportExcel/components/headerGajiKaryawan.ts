import { Worksheet } from "exceljs";


const HeaderGajiKaryawan = (ws: Worksheet,
    startCol: number,
    startRow: number,
    title: string = "Total SesiBongkar"
) => {


    let col = startCol;
    let row = startRow;

    ws.mergeCells(row, col, row + 1, col + 9);
    const titleCell = ws.getCell(row, col);
    titleCell.value = title;
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.font = { bold: true };
    row += 2;


    ws.mergeCells(row, col, row, col + 3);
    ws.getCell(row, col).value = "Import";
    ws.getCell(row, col).alignment = { horizontal: "center", vertical: "middle" };

    ws.mergeCells(row, col + 4, row + 2, col + 4);
    ws.getCell(row, col + 4).value = "LCL";
    ws.getCell(row, col + 4).alignment = { horizontal: "center", vertical: "middle" };
    ws.mergeCells(row, col + 5, row, col + 8);
    ws.getCell(row, col + 5).value = "Export";
    ws.getCell(row, col + 5).alignment = { horizontal: "center", vertical: "middle" };

    ws.mergeCells(row, col + 9, row + 2, col + 9);
    ws.getCell(row, col + 9).value = "LCL";
    ws.getCell(row, col + 9).alignment = { horizontal: "center", vertical: "middle" };
    row++;

    ws.mergeCells(row, col, row, col + 1);
    ws.getCell(row, col).value = "20 feet";
    ws.getCell(row, col).alignment = { horizontal: "center", vertical: "middle" };

    ws.mergeCells(row, col + 2, row, col + 3);
    ws.getCell(row, col + 2).value = "40 feet";
    ws.getCell(row, col + 2).alignment = { horizontal: "center", vertical: "middle" };

    ws.mergeCells(row, col + 5, row, col + 6);
    ws.getCell(row, col + 5).value = "20 feet";
    ws.getCell(row, col + 5).alignment = { horizontal: "center", vertical: "middle" };

    ws.mergeCells(row, col + 7, row, col + 8);
    ws.getCell(row, col + 7).value = "40 feet";
    ws.getCell(row, col + 7).alignment = { horizontal: "center", vertical: "middle" };
    row++;

    const methods = ["Forklift", "Manual", "Forklift", "Manual"];
    methods.forEach((m, i) => {
        ws.getCell(row, col + i).value = m;
        ws.getCell(row, col + i).alignment = { horizontal: "center", vertical: "middle" };
    });

    methods.forEach((m, i) => {
        ws.getCell(row, col + 5 + i).value = m;
        ws.getCell(row, col + 5 + i).alignment = { horizontal: "center", vertical: "middle" };
    });

    const thinBorder = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
    };

    for (let r = startRow; r <= startRow + 4; r++) {
        for (let c = startCol; c <= startCol + 9; c++) {
            ws.getCell(r, c).border = thinBorder as any;
        }
    }
}

export default HeaderGajiKaryawan;
