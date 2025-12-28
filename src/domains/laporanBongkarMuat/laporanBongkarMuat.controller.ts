import BaseController from "@common/base/baseController";
import { catchError } from "@common/handler/errors/catchError";
import { getPagination } from "@common/pagination/paginations";
import { QueryParsed } from "@common/QueryParsed";
import { StatusCreated } from "@common/consts/statusCodes";
import { WithPaginations } from "@common/types";
import { Request, Response } from "express";
import LaporanBongkarMuatService from "./laporanBongkarMuat.service";
import { LaporanBongkarMuatResponseModel } from "./laporanBongkarMuat.model";
import { authenticateToken, authorizeRoles } from "@middlewares/auth";

class LaporanBongkarMuatController extends BaseController {
    private _laporanService: LaporanBongkarMuatService;

    constructor() {
        super();
        this._laporanService = new LaporanBongkarMuatService();
        this.getAll();
        this.getById();
        this.create();
        this.update();
        this.delete();
    }

    getAll() {
        this.router.get("/laporan-bongkar-muat", authenticateToken,
            authorizeRoles("MANAJER"), async (req: Request, res: Response) => {
                const params: any = QueryParsed(req);

                const { skip, take, page, limit } = getPagination({
                    page: params.page,
                    limit: params.limit,
                });

                const [error, result] = await catchError<{
                    data: LaporanBongkarMuatResponseModel[];
                    total: number;
                }>(this._laporanService.findAll({ ...req.query, skip, take }));

                if (error) {
                    this.handleError(res, error);
                    return;
                }

                return this.handleSuccess<WithPaginations<LaporanBongkarMuatResponseModel[]>>(
                    res,
                    {
                        data: result.data,
                        pagination: {
                            page,
                            limit,
                            total_items: result.total,
                            total_pages: Math.ceil(result.total / limit),
                        },
                    },
                    "Successfully fetched laporan bongkar muat"
                );
            });
    }

    getById() {
        this.router.get("/laporan-bongkar-muat/:id", authenticateToken,
            authorizeRoles("MANAJER"), async (req: Request, res: Response) => {
                const [error, result] = await catchError<LaporanBongkarMuatResponseModel>(
                    this._laporanService.findById(Number(req.params.id))
                );

                if (error) return this.handleError(res, error);

                return this.handleSuccess<LaporanBongkarMuatResponseModel>(
                    res,
                    result,
                    "Successfully fetched laporan bongkar muat"
                );
            });
    }

    create() {
        this.router.post("/laporan-bongkar-muat", authenticateToken,
            authorizeRoles("MANAJER"), async (req: Request, res: Response) => {
                const [error, result] = await catchError<LaporanBongkarMuatResponseModel>(
                    this._laporanService.create(req.body)
                );

                if (error) return this.handleError(res, error);

                return this.handleSuccess(
                    res,
                    result,
                    "Laporan bongkar muat created successfully",
                    StatusCreated
                );
            });
    }

    update() {
        this.router.put("/laporan-bongkar-muat/:id", authenticateToken,
            authorizeRoles("MANAJER"), async (req: Request, res: Response) => {
                const [error, result] = await catchError<LaporanBongkarMuatResponseModel>(
                    this._laporanService.update(Number(req.params.id), req.body)
                );

                if (error) return this.handleError(res, error);

                return this.handleSuccess(
                    res,
                    result,
                    "Laporan bongkar muat updated successfully"
                );
            });
    }

    delete() {
        this.router.delete("/laporan-bongkar-muat/:id", authenticateToken,
            authorizeRoles("MANAJER"), async (req: Request, res: Response) => {
                const [error, result] = await catchError<LaporanBongkarMuatResponseModel>(
                    this._laporanService.delete(Number(req.params.id))
                );

                if (error) return this.handleError(res, error);

                return this.handleSuccess(
                    res,
                    result,
                    "Laporan bongkar muat deleted successfully"
                );
            });
    }
}

export default LaporanBongkarMuatController;