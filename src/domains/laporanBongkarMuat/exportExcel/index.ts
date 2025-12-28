import { NextFunction, Request, Response } from "express";
import ExcelLaporanBongkarMuatService from "./service";
import ExcelJS from "exceljs";
import BaseController from "@common/base/baseController";

class ExportExcelLaporanBongkarMuat extends BaseController {
    constructor() {
        super();
        this.stevedoringReportRequest();
    }

    stevedoringReportRequest() {
        this.router.get(
            "/:id",
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    res.setHeader(
                        "Content-Type",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    );

                    res.setHeader(
                        "Content-Disposition",
                        "attachment; filename=laporan_bongkar_muat.xlsx"
                    );

                    const workbook = new ExcelJS.Workbook();
                    const service = new ExcelLaporanBongkarMuatService();

                    const buffer = await service.handleExportReport(req, workbook);

                    res.send(buffer);
                } catch (error) {
                    console.error("Error generating Excel report:", error);
                    next(error);
                }
            }
        );
    }
}

export default ExportExcelLaporanBongkarMuat;
