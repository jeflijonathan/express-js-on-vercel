import { Worksheet, Borders } from "exceljs";

export const thinBorder: Partial<Borders> = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};
export function applyBorderToRange(
  ws: Worksheet,
  startRow: number,
  endRow: number,
  startCol: number,
  endCol: number
) {
  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      ws.getCell(r, c).border = thinBorder;
    }
  }
}

const HeaderTarifBongkar = (
  ws: Worksheet,
  startCol: number,
  row: number,
  isBarangAll: boolean = false
) => {
  let col = startCol;

  if (isBarangAll) {
    ws.mergeCells(row, col, row + 1, col + 1);
    ws.getCell(row, col).value = "Alat Angkut";
    ws.getCell(row, col).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    ws.mergeCells(row + 2, col, row + 3, col);
    ws.getCell(row + 2, col).value = "Forklift";
    ws.getCell(row + 2, col).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    col += 1;

    ws.mergeCells(row + 2, col, row + 3, col);
    ws.getCell(row + 2, col).value = "Manual";
    ws.getCell(row + 2, col).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    col += 1;
  } else {

    ws.mergeCells(row, col, row, col + 8);
    ws.getCell(row, col).value = "Import";
    ws.getCell(row, col).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    ws.mergeCells(row + 1, col, row + 1, col + 2);
    ws.getCell(row + 1, col).value = "40 Feet";
    ws.getCell(row + 1, col).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    ws.mergeCells(row + 2, col, row + 3, col);
    ws.getCell(row + 2, col).value = "Forklift";
    ws.getCell(row + 2, col).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    ws.mergeCells(row + 2, col + 1, row + 2, col + 2);
    ws.getCell(row + 2, col + 1).value = "Manual";
    ws.getCell(row + 2, col + 1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    ws.getCell(row + 3, col + 1).value = "Mesin";
    ws.getCell(row + 3, col + 1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    ws.getCell(row + 3, col + 2).value = "lain-lain";
    ws.getCell(row + 3, col + 2).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    col += 3;

    ws.mergeCells(row + 1, col, row + 1, col + 3);
    ws.getCell(row + 1, col).value = "20 feet";
    ws.getCell(row + 1, col).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    ws.mergeCells(row + 2, col, row + 3, col);
    ws.getCell(row + 2, col).value = "Forklift";
    ws.getCell(row + 2, col).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    ws.mergeCells(row + 2, col + 1, row + 2, col + 3);
    ws.getCell(row + 2, col + 1).value = "Manual";
    ws.getCell(row + 2, col + 1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    ws.getCell(row + 3, col + 1).value = "plastik";
    ws.getCell(row + 3, col + 1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    ws.getCell(row + 3, col + 2).value = "non";
    ws.getCell(row + 3, col + 2).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    ws.getCell(row + 3, col + 3).value = "Mesin";
    ws.getCell(row + 3, col + 3).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    col += 4;


    ws.mergeCells(row + 1, col, row + 1, col + 1);
    ws.getCell(row + 1, col).value = "LCL";
    ws.getCell(row + 1, col).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    ws.mergeCells(row + 2, col, row + 3, col);
    ws.getCell(row + 2, col).value = "Hijau";
    ws.getCell(row + 2, col).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    ws.mergeCells(row + 2, col + 1, row + 3, col + 1);
    ws.getCell(row + 2, col + 1).value = "Merah";
    ws.getCell(row + 2, col + 1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    col += 2;

    ws.mergeCells(row, col, row + 3, col);
    ws.getCell(row + 1, col).value = "Jasa\nWrapping";
    ws.getCell(row + 1, col).alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };

    col += 1;

    ws.mergeCells(row, col, row, col + 4);
    ws.getCell(row, col).value = "Export";
    ws.getCell(row, col).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    ws.mergeCells(row + 1, col, row + 1, col + 1);
    ws.getCell(row + 1, col).value = "40 feet";
    ws.getCell(row + 1, col).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    ws.mergeCells(row + 2, col, row + 3, col);
    ws.getCell(row + 2, col).value = "Forklift";
    ws.getCell(row + 2, col).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    ws.mergeCells(row + 2, col + 1, row + 3, col + 1);
    ws.getCell(row + 2, col + 1).value = "Manual";
    ws.getCell(row + 2, col + 1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    col += 2;

    ws.mergeCells(row + 1, col, row + 1, col + 1);
    ws.getCell(row + 1, col).value = "20 feet";
    ws.getCell(row + 1, col).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    ws.mergeCells(row + 2, col, row + 3, col);
    ws.getCell(row + 2, col).value = "Forklift";
    ws.getCell(row + 2, col).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    ws.mergeCells(row + 2, col + 1, row + 3, col + 1);
    ws.getCell(row + 2, col + 1).value = "Manual";
    ws.getCell(row + 2, col + 1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    col += 2;

    ws.mergeCells(row + 1, col, row + 3, col);
    ws.getCell(row + 1, col).value = "LCL";
    ws.getCell(row + 1, col).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    col += 1;
  }

  const lastCol = col - 1;

  const titleRow = row - 1;

  ws.mergeCells(titleRow, startCol, titleRow, lastCol);
  ws.getCell(titleRow, startCol).value = "Bongkar Muat";
  ws.getCell(titleRow, startCol).alignment = {
    horizontal: "center",
    vertical: "middle",
  };
  ws.getCell(titleRow, startCol).font = {
    bold: true,
    size: 14,
  };

  applyBorderToRange(ws, row - 1, row + 3, startCol, lastCol);
};

export default HeaderTarifBongkar;
