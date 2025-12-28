import {
  StatusInternalServerError,
  StatusOk,
} from "@common/consts/statusCodes";
import { ErrorType } from "@common/types";
import { Response, Router } from "express";

export default class BaseController {
  router = Router();

  getRouter() {
    return this.router;
  }

  handleSuccess<T>(
    res: Response,
    data: T = {} as T,
    message: String = "Success",
    statusCode: number = StatusOk
  ) {
    const result =
      data && typeof data === "object" && "data" in data
        ? { ...data }
        : { data };

    res.status(statusCode).json({
      status: "Success",
      statusCode: statusCode,
      message,
      ...result,
    });
  }

  handleError(res: Response, error: ErrorType) {
    const {
      statusCode = StatusInternalServerError,
      message = "Internal Server Error",
      details = null,
    } = error;

    res.status(statusCode).json({
      status: "Error",
      statusCode: statusCode,
      message,
      details,
    });
  }
}
