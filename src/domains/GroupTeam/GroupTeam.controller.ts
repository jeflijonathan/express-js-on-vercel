import { catchError } from "@common/handler/errors/catchError";
import { Request, Response } from "express";
import { QueryParsed } from "@common/QueryParsed";
import { getPagination } from "@common/pagination/paginations";
import BaseController from "@common/base/baseController";
import { WithPaginations } from "@common/types";
import { StatusCreated } from "@common/consts/statusCodes";
import GroupTeamService from "./GroupTeam.service";
import { TimResponseModel } from "./GroupTeam.model";
import { authenticateToken, authorizeRoles } from "@middlewares/auth";

export default class GroupTimController extends BaseController {
  private groupTimService = new GroupTeamService();

  constructor() {
    super();
    this.getAll();
    this.getById();
    this.create();
    this.update();
    this.delete();
  }

  async getAll() {
    this.router.get("/group-team", authenticateToken,
      authorizeRoles("MANAJER"), async (req: Request, res: Response) => {
        const params: any = QueryParsed(req);

        const { skip, take, page, limit } = getPagination({
          page: params.page,
          limit: params.limit,
        });

        const [error, result] = await catchError<{
          data: TimResponseModel[];
          total: number;
        }>(this.groupTimService.findAll({ ...req.query, skip, take }, params));

        if (error) {
          this.handleError(res, error);
          return;
        }

        return this.handleSuccess<WithPaginations<TimResponseModel[]>>(
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
          "Successfully fetched team"
        );
      });
  }

  async getById() {
    this.router.get("/group-team/:id", authenticateToken,
      authorizeRoles("MANAJER"), async (req: Request, res: Response) => {
        const { id } = req.params;

        const [error, result] = await catchError<TimResponseModel[]>(
          this.groupTimService.findById(id)
        );

        if (error) return this.handleError(res, error);

        return this.handleSuccess<TimResponseModel[]>(
          res,
          result,
          "Successfully fetched group team status"
        );
      });
  }

  async create() {
    this.router.post("/group-team", authenticateToken,
      authorizeRoles("MANAJER"), async (req: Request, res: Response) => {
        const [error, result] = await catchError<TimResponseModel[]>(
          this.groupTimService.handleCreateTimGroup(req.body)
        );

        if (error) return this.handleError(res, error);

        return this.handleSuccess<TimResponseModel[]>(
          res,
          result,
          "Team created successfully",
          StatusCreated
        );
      });
  }

  async update() {
    this.router.put("/group-team/:id",
      authenticateToken,
      authorizeRoles("MANAJER"), async (req: Request, res: Response) => {
        const [error, result] = await catchError<TimResponseModel[]>(
          this.groupTimService.handleUpdateGroupTim(req.params.id, req.body)
        );

        if (error) return this.handleError(res, error);

        return this.handleSuccess<TimResponseModel[]>(
          res,
          result,
          "Team updated successfully"
        );
      });
  }

  async delete() {
    this.router.delete(
      "/group-team/:id",
      authenticateToken,
      authorizeRoles("MANAJER"),
      async (req: Request, res: Response) => {
        const [error, result] = await catchError<TimResponseModel[]>(
          this.groupTimService.handleDeleteGroupTim(req.params.id)
        );

        if (error) return this.handleError(res, error);

        return this.handleSuccess<TimResponseModel[]>(
          res,
          result,
          "Team delete successfully"
        );
      }
    );
  }
}
