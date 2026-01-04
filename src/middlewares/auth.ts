import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "src/config/database/client";

const authorizeRoles = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userPayload = (req as any).user;

      if (!userPayload?.id) {
        throw {
          statusCode: 401,
          message: "User not authenticated",
        };
      }

      const user = await prisma.user.findUnique({
        where: { id: userPayload.id },
        include: { employee: { include: { role: true } } },
      });

      if (
        !user?.employee?.role ||
        !allowedRoles.includes(user.employee.role.name)
      ) {
        throw {
          statusCode: 403,
          message: "Forbidden: You do not have access",
        };
      }

      if (!user.employee.status) {
        throw {
          statusCode: 403,
          message: "Your account is inactive. Please contact administrator.",
        };
      }

      (req as any).user.roleName = user.employee.role.name;

      next();
    } catch (error) {
      next(error);
    }
  };
};
const authenticateToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      throw {
        statusCode: 400,
        message: "Access token missing",
      };
    }

    const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

    if (payload.sessionId) {
      const session = await prisma.refreshToken.findFirst({
        where: {
          id: payload.sessionId,
          isRevoked: false,
          expiresAt: { gte: new Date() },
        },
      });

      if (!session) {
        throw {
          statusCode: 401,
          message: "Session has been revoked or expired",
        };
      }
    }

    (req as any).user = payload;
    next();
  } catch (err: any) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      next({
        statusCode: 401,
        message: "Invalid or expired token",
      });
    } else {
      next(err);
    }
  }
};
export { authenticateToken, authorizeRoles };
