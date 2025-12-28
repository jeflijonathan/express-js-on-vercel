import { catchError } from "@common/handler/errors/catchError";
import { NextFunction, Request, Response } from "express";
import { QueryParsed } from "@common/QueryParsed";
import CommonOptionsServices from "./commonOption.service";
import {
  CategoryItemModel,
  OptionsReponseModel,
  RoleModel,
  TimResponseModel,
  TransportMethodModel,
} from "./type/index";
import BaseController from "@common/base/baseController";
import { authenticateToken, authorizeRoles } from "@middlewares/auth";

export default class CommonOptionsController extends BaseController {
  CommonOptionService = new CommonOptionsServices();

  constructor() {
    super();
    this.getRoleOptions();
    this.getTransportMethodOptions();
    this.getCategoryItemOptions();
    this.getEmployeeOptions();
    this.getGroupTimOptions();
    this.getTradeTypeOptions();
    this.getContainerSizeOptions();
    this.getStatusBongkarMuat();
  }

  getRoleOptions() {
    this.router.get(
      `/role`,
      authenticateToken,
      authorizeRoles("MANAJER", "SPV"),
      async (req: Request, res: Response, next: NextFunction) => {
        const params = QueryParsed(req);

        const [error, result] = await catchError<RoleModel[]>(
          this.CommonOptionService.findRole(params)
        );

        if (error) {
          this.handleError(res, error);
          next(error);
        }

        return this.handleSuccess<RoleModel[]>(
          res,
          result,
          "Successfully fetched Role",
          200
        );
      }
    );
  }

  getTransportMethodOptions() {
    this.router.get(
      `/transport-method`,
      authenticateToken,
      async (req: Request, res: Response, next: NextFunction) => {
        const params = QueryParsed(req);

        const [error, result] = await catchError<TransportMethodModel[]>(
          this.CommonOptionService.findTransportMethod(params)
        );

        if (error) {
          this.handleError(res, error);
          next(error);
        }

        return this.handleSuccess<TransportMethodModel[]>(
          res,
          result,
          "Successfully fetched Transport Method"
        );
      }
    );
  }

  getCategoryItemOptions() {
    this.router.get(
      `/category-item`,
      authenticateToken,
      async (req: Request, res: Response, next: NextFunction) => {
        const params = QueryParsed(req);

        const [error, result] = await catchError<CategoryItemModel[]>(
          this.CommonOptionService.findCategoryItem(params)
        );

        if (error) {
          this.handleError(res, error);
          next(error);
        }

        return this.handleSuccess<CategoryItemModel[]>(
          res,
          result,
          "Successfully fetched Category Item"
        );
      }
    );
  }

  getEmployeeOptions() {
    this.router.get(
      `/employee`,
      authenticateToken,
      async (req: Request, res: Response, next: NextFunction) => {
        const params = QueryParsed(req);

        const [error, result] = await catchError(
          this.CommonOptionService.findEmployee(params)
        );

        if (error) {
          return this.handleError(res, error);
        }

        return this.handleSuccess(res, result, "Successfully fetched employee");
      }
    );
  }

  getGroupTimOptions() {
    this.router.get(
      `/group-tim`,
      authenticateToken,
      async (req: Request, res: Response, next: NextFunction) => {
        const params = QueryParsed(req);

        const [error, result] = await catchError<TimResponseModel[]>(
          this.CommonOptionService.findGroupTim(params)
        );

        if (error) {
          next(error);
        }

        return this.handleSuccess<TimResponseModel[]>(
          res,
          result,
          "Successfully fetched group tim"
        );
      }
    );
  }

  getTradeTypeOptions() {
    this.router.get(
      `/trade-type`,
      authenticateToken,
      async (req: Request, res: Response, next: NextFunction) => {
        const params = QueryParsed(req);
        const [error, result] = await catchError<OptionsReponseModel[]>(
          this.CommonOptionService.findTradeType(params)
        );

        if (error) {
          return next(error);
        }
        return this.handleSuccess(
          res,
          result,
          "Successfully fetched Trade Type"
        );
      }
    );
  }

  getContainerSizeOptions() {
    this.router.get(
      `/container-size`,
      authenticateToken,
      async (req: Request, res: Response, next: NextFunction) => {
        const params = QueryParsed(req);
        const [error, result] = await catchError<OptionsReponseModel[]>(
          this.CommonOptionService.findContainerSize(params)
        );

        if (error) {
          next(error);
        }

        return this.handleSuccess<OptionsReponseModel[]>(
          res,
          result,
          "Successfully fetched Pegawai"
        );
      }
    );
  }

  getStatusBongkarMuat() {
    this.router.get("/status-bongkar", authenticateToken, async (req, res) => {
      try {
        const result = await this.CommonOptionService.findStatusBongkar();

        this.handleSuccess(res, result, "Successfully fetched status bongkar");
      } catch (err: any) {
        this.handleError(res, err);
      }
    });
  }
}
