import ExcelJS from "exceljs";

const fullBorder: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

const leftRightBorder: Partial<ExcelJS.Borders> = {
  left: { style: "thin" },
  right: { style: "thin" },
};

const topBottomBorder: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
  bottom: { style: "thin" },
};

const topBorder: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
};

const bottomBorder: Partial<ExcelJS.Borders> = {
  bottom: { style: "thin" },
};

export {
  fullBorder,
  leftRightBorder,
  topBottomBorder,
  topBorder,
  bottomBorder,
};
