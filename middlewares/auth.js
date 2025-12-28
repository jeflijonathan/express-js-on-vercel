"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("src/config/database/client");
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const userPayload = req.user;
            if (!(userPayload === null || userPayload === void 0 ? void 0 : userPayload.id)) {
                throw {
                    statusCode: 401,
                    message: "User not authenticated",
                };
            }
            const user = yield client_1.prisma.user.findUnique({
                where: { id: userPayload.id },
                include: { employee: { include: { role: true } } },
            });
            if (!((_a = user === null || user === void 0 ? void 0 : user.employee) === null || _a === void 0 ? void 0 : _a.role) ||
                !allowedRoles.includes(user.employee.role.name)) {
                throw {
                    statusCode: 403,
                    message: "Forbidden: You do not have access",
                };
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.authorizeRoles = authorizeRoles;
const authenticateToken = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
        if (!token) {
            throw {
                statusCode: 400,
                message: "Access token missing",
            };
        }
        const payload = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (payload.sessionId) {
            const session = yield client_1.prisma.refreshToken.findFirst({
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
        req.user = payload;
        next();
    }
    catch (err) {
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            next({
                statusCode: 401,
                message: "Invalid or expired token",
            });
        }
        else {
            next(err);
        }
    }
});
exports.authenticateToken = authenticateToken;
