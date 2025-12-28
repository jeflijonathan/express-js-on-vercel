import BaseController from "@common/base/baseController";
import { QueryParsed } from "@common/QueryParsed";
import { Request, Response } from "express";
import { WithPaginations } from "@common/types";
import { catchError } from "@common/handler/errors/catchError";
import { getPagination } from "@common/pagination/paginations";
import { StatusCreated } from "@common/consts/statusCodes";
import GajiKuliService from "./gajiKuli.service";
import { authenticateToken, authorizeRoles } from "@middlewares/auth";

export default class GajiKuliController extends BaseController {
  private gajiKuliService = new GajiKuliService();

  constructor() {
    super();
    this.getAll();
    this.getById();
    this.create();
    this.update();
    this.delete();
    this.batchSave();
  }

  batchSave() {
    this.router.post("/gaji-kuli/batch",
      authenticateToken,
      authorizeRoles("MANAJER"),
      async (req: Request, res: Response) => {
        const [error, result] = await catchError<any>(
          this.gajiKuliService.batchSaveGajiKuli(req.body)
        );

        if (error) return this.handleError(res, error);

        return this.handleSuccess(
          res,
          result,
          "Gaji kuli batch saved successfully",
          StatusCreated
        );
      });
  }

  getAll() {
    this.router.get("/gaji-kuli",
      authenticateToken,
      authorizeRoles("MANAJER"), async (req: Request, res: Response) => {
        const params: any = QueryParsed(req);

        const { skip, take, page, limit } = getPagination({
          limit: params.limit,
          page: params.page,
        });

        const [error, result] = await catchError<{
          data: any[];
          total: number;
        }>(this.gajiKuliService.findGajiKuli(req, { ...req.query, skip, take }, params));

        if (error) return this.handleError(res, error);

        return this.handleSuccess<WithPaginations<any[]>>(
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
          "Gaji Kuli fetched successfully"
        );
      });
  }

  getById() {
    this.router.get("/gaji-kuli/:id",
      authenticateToken,
      authorizeRoles("MANAJER"), async (req: Request, res: Response) => {
        const [error, result] = await catchError<any>(
          this.gajiKuliService.findGajiKuliById(Number(req.params.id))
        );

        if (error) return this.handleError(res, error);

        this.handleSuccess<any>(
          res,
          result,
          "Successfully fetched gaji kuli"
        );
      });
  }

  create() {
    this.router.post("/gaji-kuli",
      authenticateToken,
      authorizeRoles("MANAJER"), async (req: Request, res: Response) => {
        const [error, result] = await catchError<any>(
          this.gajiKuliService.createGajiKuli(req.body)
        );

        if (error) return this.handleError(res, error);

        return this.handleSuccess(
          res,
          result,
          "Gaji kuli created successfully",
          StatusCreated
        );
      });
  }

  update() {
    this.router.put("/gaji-kuli/:id",
      authenticateToken,
      authorizeRoles("MANAJER"), async (req: Request, res: Response) => {
        const [error, result] = await catchError<any>(
          this.gajiKuliService.updateGajiKuli(Number(req.params.id), req.body)
        );

        if (error) return this.handleError(res, error);

        return this.handleSuccess(res, result, "Gaji kuli updated successfully");
      });
  }

  delete() {
    this.router.delete("/gaji-kuli/:id",
      authenticateToken,
      authorizeRoles("MANAJER"), async (req: Request, res: Response) => {
        const [error, result] = await catchError<any>(
          this.gajiKuliService.deleteGajiKuli(Number(req.params.id))
        );

        if (error) return this.handleError(res, error);

        return this.handleSuccess(res, result, "Gaji kuli deleted successfully");
      });
  }
}
