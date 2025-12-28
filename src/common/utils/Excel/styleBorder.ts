import { fullBorder } from "./borderExcel";
import ExcelJS from "exceljs";

interface Props {
  worksheet: ExcelJS.Worksheet;
  cells: string[];
  vertical?:
    | "top"
    | "bottom"
    | "middle"
    | "distributed"
    | "justify"
    | undefined;
  horizontal?:
    | "left"
    | "right"
    | "distributed"
    | "justify"
    | "center"
    | "fill"
    | "centerContinuous"
    | undefined;
}

export function applyBorderAndCenter({
  worksheet,
  cells,
  vertical = "middle",
  horizontal = "center",
}: Props) {
  cells.forEach((addr) => {
    const cell = worksheet.getCell(addr);
    cell.alignment = { vertical: vertical, horizontal: horizontal };
    cell.border = { ...fullBorder };
  });
}
