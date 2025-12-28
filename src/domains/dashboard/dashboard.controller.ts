import BaseController from "@common/base/baseController";
import { Request, Response } from "express";
import DashboardService from "./dashboard.service";
import { catchError } from "@common/handler/errors/catchError";
import { authenticateToken, authorizeRoles } from "@middlewares/auth";

export default class DashboardController extends BaseController {
    service: DashboardService;

    constructor() {
        super();
        this.service = new DashboardService();
        this.getStats();
    }

    getStats() {
        this.router.get("/dashboard/stats", authenticateToken, authorizeRoles("MANAJER", "SPV"), async (req: Request, res: Response) => {
            const { year, tradeType } = req.query;
            const [error, result] = await catchError(
                this.service.getStats(
                    year ? Number(year) : undefined,
                    tradeType ? String(tradeType) : undefined
                )
            );

            if (error) return this.handleError(res, error);

            return this.handleSuccess(res, result, "Success get dashboard stats");
        });
    }
}
