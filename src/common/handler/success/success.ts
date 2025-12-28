import { ApiResponse } from "@common/types";

export const success = <T>(props: ApiResponse<T>): void => {
  const { res, statusCode, message, data, pagination } = props;

  const response = {
    status: true,
    status_code: statusCode,
    message: message,
    data: data,
    ...(pagination ? { pagination } : {}),
  };

  res.status(statusCode).json(response);
};
