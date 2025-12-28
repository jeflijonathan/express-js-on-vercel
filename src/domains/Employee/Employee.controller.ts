import BaseController from "@common/base/baseController";
import { QueryParsed } from "@common/QueryParsed";
import { Request, Response } from "express";
import { WithPaginations } from "@common/types";
import { catchError } from "@common/handler/errors/catchError";
import { getPagination } from "@common/pagination/paginations";
import { StatusCreated } from "@common/consts/statusCodes";
import { authenticateToken, authorizeRoles } from "@middlewares/auth";
import EmployeeService from "./Employee.service";
import { EmployeeResponseModel } from "./Employee.model";


export default class EmployeeController extends BaseController {
  private employeeService = new EmployeeService();

  constructor() {
    super();
    this.getAll();
    this.getById();
    this.create();
    this.update();
  }

  getAll() {
    this.router.get(
      "/employee",
      authenticateToken,
      authorizeRoles("MANAJER", "SPV"),
      async (req: Request, res: Response) => {
        const params: any = QueryParsed(req);

        const { skip, take, page, limit } = getPagination({
          limit: params.limit,
          page: params.page,
        });

        const [error, result] = await catchError<{
          data: EmployeeResponseModel[];
          total: number;
        }>(this.employeeService.findAll({ ...req.query, skip, take }, params));

        if (error) return this.handleError(res, error);

        return this.handleSuccess<WithPaginations<EmployeeResponseModel[]>>(
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
          "Successfully fetched employees"
        );
      });
  }

  getById() {
    this.router.get(
      "/employee/:id",
      authenticateToken,
      async (req: Request, res: Response) => {
        const [error, result] = await catchError<EmployeeResponseModel[]>(
          this.employeeService.findById(req.params.id)
        );

        if (error) return this.handleError(res, error);

        this.handleSuccess<EmployeeResponseModel[]>(
          res,
          result,
          "Successfully fetched employees"
        );
      });
  }

  create() {
    this.router.post(
      "/employee",
      authenticateToken,
      authorizeRoles("MANAJER"),
      async (req: Request, res: Response) => {
        const [error, result] = await catchError<EmployeeResponseModel[]>(
          this.employeeService.handleCreateEmployee(req.body)
        );

        if (error) return this.handleError(res, error);

        return this.handleSuccess(
          res,
          result,
          "Employee created successfully",
          StatusCreated
        );
      });
  }

  update() {
    this.router.put(
      "/employee/:id",
      authenticateToken,
      authorizeRoles("MANAJER"),
      async (req: Request, res: Response) => {
        const userId = req.params.id;

        const [error, result] = await catchError<EmployeeResponseModel[]>(
          this.employeeService.updateEmployee(userId, req.body)
        );

        if (error) return this.handleError(res, error);

        return this.handleSuccess(res, result, "Employee updated successfully");
      });
  }
}
