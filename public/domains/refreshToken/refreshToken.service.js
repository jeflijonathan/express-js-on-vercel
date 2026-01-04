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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenService = void 0;
const client_1 = require("src/config/database/client");
class RefreshTokenService {
    static findAll(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            // Cleanup expired tokens
            yield client_1.prisma.refreshToken.deleteMany({
                where: { expiresAt: { lt: new Date() } },
            });
            const take = Number(filters.limit) || 10;
            const skip = ((Number(filters.page) || 1) - 1) * take;
            const where = {};
            if (filters.userId)
                where.userId = filters.userId;
            if (filters.startDate && filters.endDate) {
                where.createdAt = {
                    gte: new Date(filters.startDate),
                    lte: new Date(new Date(filters.endDate).setHours(23, 59, 59, 999)),
                };
            }
            if (filters.search) {
                where.OR = [
                    { user: { username: { contains: filters.search } } },
                    { user: { employee: { namaLengkap: { contains: filters.search } } } },
                    { ipAddress: { contains: filters.search } },
                ];
            }
            const [data, total] = yield Promise.all([
                client_1.prisma.refreshToken.findMany({
                    where,
                    include: {
                        user: {
                            include: {
                                employee: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                    take,
                    skip,
                }),
                client_1.prisma.refreshToken.count({ where }),
            ]);
            return {
                data,
                meta: {
                    total,
                    page: Number(filters.page) || 1,
                    limit: take,
                    totalPages: Math.ceil(total / take),
                },
            };
        });
    }
    static revokeToken(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return client_1.prisma.refreshToken.delete({
                where: { id },
            });
        });
    }
    static revokeAllByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return client_1.prisma.refreshToken.deleteMany({
                where: { userId },
            });
        });
    }
    static revokeBatch(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return client_1.prisma.refreshToken.deleteMany({
                where: { id: { in: ids } },
            });
        });
    }
}
exports.RefreshTokenService = RefreshTokenService;
