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
exports.ActivityLogService = void 0;
const client_1 = require("@config/database/client");
class ActivityLogService {
    static createLog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return client_1.prisma.activityLog.create({
                data,
            });
        });
    }
    static findAll(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const take = Number(filters.limit) || 10;
            const skip = ((Number(filters.page) || 1) - 1) * take;
            const where = {};
            if (filters.userId)
                where.userId = filters.userId;
            if (filters.action)
                where.action = filters.action;
            if (filters.search) {
                where.OR = [
                    { user: { username: { contains: filters.search } } },
                    { user: { employee: { namaLengkap: { contains: filters.search } } } },
                    { action: { contains: filters.search } },
                    { description: { contains: filters.search } },
                    { ipAddress: { contains: filters.search } },
                ];
            }
            const [data, total] = yield Promise.all([
                client_1.prisma.activityLog.findMany({
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
                client_1.prisma.activityLog.count({ where }),
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
}
exports.ActivityLogService = ActivityLogService;
