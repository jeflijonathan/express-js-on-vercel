import BaseController from "@common/base/baseController";
import { QueryParsed } from "@common/QueryParsed";
import { Request, Response } from "express";
import { catchError } from "@common/handler/errors/catchError";
import { getPagination } from "@common/pagination/paginations";
import { StatusCreated } from "@common/consts/statusCodes";
import BongkarMuatService from "./tarifMuat.service";
import { TarifBongkarResponseModel } from "./tarifBongkar.model";
import { WithPaginations } from "@common/types";
import { authenticateToken, authorizeRoles } from "@middlewares/auth";

class TarifBongkarController extends BaseController {
  private bongkarMuatService = new BongkarMuatService();

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
    this.router.post("/tarif-bongkar/batch",
      authenticateToken,
      authorizeRoles("MANAJER"),
      async (req: Request, res: Response) => {
        const [error, result] = await catchError<any>(
          this.bongkarMuatService.batchSaveTarifBongkarMuat(req.body)
        );

        if (error) return this.handleError(res, error);

        return this.handleSuccess(
          res,
          result,
          "Tarif bongkar batch saved successfully",
          StatusCreated
        );
      });
  }

  getAll() {
    this.router.get("/tarif-bongkar",
      authenticateToken,
      authorizeRoles("MANAJER"),
      async (req: Request, res: Response) => {
        const queryParams: any = QueryParsed(req);

        const { skip, take, page, limit } = getPagination({
          limit: queryParams.limit,
          page: queryParams.page,
        });

        const [error, result] = await catchError<{
          data: any[];
          total: number;
        }>(this.bongkarMuatService.findTarifBongkarMuat(req, { ...req.query, skip, take }, queryParams));

        if (error) return this.handleError(res, error);

        return this.handleSuccess<WithPaginations<TarifBongkarResponseModel[]>>(
          res,
          {
            data: result.data as TarifBongkarResponseModel[],
            pagination: {
              page,
              limit,
              total_items: result.total,
              total_pages: Math.ceil(result.total / limit),
            },
          },
          "Tarif Bongkar Muat fetched successfully"
        );
      });
  }

  getById() {
    this.router.get("/tarif-bongkar/:id",
      authenticateToken,
      authorizeRoles("MANAJER"),
      async (req: Request, res: Response) => {
        const [error, result] = await catchError<any>(
          this.bongkarMuatService.findTarifBongkarMuatById(Number(req.params.id))
        );

        if (error) return this.handleError(res, error);

        this.handleSuccess<TarifBongkarResponseModel>(
          res,
          result as TarifBongkarResponseModel,
          "Successfully fetched tarif bongkar muat"
        );
      });
  }

  create() {
    this.router.post("/tarif-bongkar",
      authenticateToken,
      authorizeRoles("MANAJER"),
      async (req: Request, res: Response) => {
        const [error, result] = await catchError<any>(
          this.bongkarMuatService.createTarifBongkarMuat(req.body)
        );

        if (error) return this.handleError(res, error);

        this.handleSuccess(
          res,
          result,
          "Successfully created tarif bongkar muat",
          StatusCreated
        );
      });
  }

  update() {
    this.router.put("/tarif-bongkar/:id",
      authenticateToken,
      authorizeRoles("MANAJER"),
      async (req: Request, res: Response) => {
        const [error, result] = await catchError<any>(
          this.bongkarMuatService.updateTarifBongkarMuat(
            Number(req.params.id),
            req.body
          )
        );

        if (error) return this.handleError(res, error);

        this.handleSuccess(
          res,
          result,
          "Successfully updated tarif bongkar muat"
        );
      });
  }

  delete() {
    this.router.delete("/tarif-bongkar/:id",
      authenticateToken,
      authorizeRoles("MANAJER"),
      async (req: Request, res: Response) => {
        const [error, result] = await catchError<any>(
          this.bongkarMuatService.deleteTarifBongkarMuat(Number(req.params.id))
        );

        if (error) return this.handleError(res, error);

        this.handleSuccess(
          res,
          result,
          "Successfully deleted tarif bongkar muat"
        );
      });
  }
}

export default TarifBongkarController;
