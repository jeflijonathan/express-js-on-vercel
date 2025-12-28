import { Request, Response } from "express";
import { PaginationType, WithPaginations } from "@common/types";
import { catchError } from "@common/handler/errors/catchError";
import { QueryParsed } from "@common/QueryParsed";
import BaseController from "@common/base/baseController";
import { StatusCreated } from "@common/consts/statusCodes";
import { authenticateToken, authorizeRoles } from "@middlewares/auth";
import UserService from "./User.service";
import { UserFilterParams, UserModel } from "./User.type";

class UserController extends BaseController {
  private userService = new UserService();

  constructor() {
    super();
    this.getAll();
    this.getById();
    this.createUserWithEmployeeId();
    this.createUserAndEmployee();
    this.update();
  }

  getAll() {
    this.router.get(
      "/users",
      authenticateToken,
      authorizeRoles("MANAJER"),
      async (req: Request, res: Response) => {
        const params: UserFilterParams = QueryParsed(req);

        const [error, result] = await catchError<{
          data: UserModel[];
          pagination: PaginationType;
        }>(this.userService.findAllUser(params));

        if (error) return this.handleError(res, error);

        return this.handleSuccess<WithPaginations<UserModel[]>>(
          res,
          {
            data: result?.data || [],
            pagination: result?.pagination || {},
          },
          "Successfully fetched users"
        );
      });
  }

  getById() {
    this.router.get(
      "/users/:id",
      authenticateToken,
      authorizeRoles("MANAJER", "SPV", "ADMIN"),
      async (req: Request, res: Response) => {
        const [error, result] = await catchError<UserModel[]>(
          this.userService.findUserById(req.params.id)
        );

        if (error) return this.handleError(res, error);

        this.handleSuccess<UserModel[]>(
          res,
          result,
          "Successfully fetched user"
        );
      }
    );
  }

  createUserWithEmployeeId() {
    this.router.post(
      "/users/create/user-with-employee-id",
      authenticateToken,
      authorizeRoles("MANAJER"),
      async (req: Request, res: Response) => {
        const [error, result] = await catchError<UserModel[]>(
          this.userService.handleCreateUserWithEmployeeId(req.body)
        );

        if (error) return this.handleError(res, error);

        return this.handleSuccess(
          res,
          result,
          "User created successfully",
          StatusCreated
        );
      }
    );
  }

  createUserAndEmployee() {
    this.router.post(
      "/users/create/user-employee",
      authenticateToken,
      authorizeRoles("MANAJER"),
      async (req: Request, res: Response) => {
        const [error, result] = await catchError<UserModel[]>(
          this.userService.handleCreateUserAndEmployee(req.body)
        );

        if (error) return this.handleError(res, error);

        return this.handleSuccess(
          res,
          result,
          "User created successfully",
          StatusCreated
        );
      }
    );
  }

  update() {
    this.router.put(
      "/users/:id",
      authenticateToken,
      authorizeRoles("MANAJER"),
      async (req: Request, res: Response) => {
        const userId = req.params.id;

        const [error, result] = await catchError<UserModel[]>(
          this.userService.updateUser(userId, req.body)
        );

        if (error) return this.handleError(res, error);

        return this.handleSuccess(res, result, "User updated successfully");
      });
  }
}
export default UserController;
