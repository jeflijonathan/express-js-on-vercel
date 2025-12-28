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
const client_1 = require("src/config/database/client");
const sigleSearch_1 = require("@common/filter/sigleSearch/sigleSearch");
const dateFilter_1 = require("@common/filter/dateFilter/dateFilter");
class CommonOptionsServices {
    constructor() {
        this.findCategoryItem = (params) => __awaiter(this, void 0, void 0, function* () {
            const search = (0, sigleSearch_1.buildSingleSearch)("name", params.value);
            const where = Object.assign(Object.assign({}, (params.value ? search : {})), { status: true });
            if (params.filter === "true") {
                where.name = {
                    not: "ALL",
                };
            }
            const data = yield client_1.prisma.barang.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                },
                orderBy: {
                    name: "asc",
                },
            });
            return data;
        });
        this.findEmployee = (...args_1) => __awaiter(this, [...args_1], void 0, function* (params = {}) {
            const { role, value } = params;
            let roleCondition = {};
            if (Array.isArray(role)) {
                roleCondition = {
                    role: {
                        name: {
                            in: role,
                        },
                    },
                };
            }
            const whereQuery = Object.assign(Object.assign({ status: true }, (value ? (0, sigleSearch_1.buildSingleSearch)("namaLengkap", value) : {})), roleCondition);
            return yield client_1.prisma.employee.findMany({
                where: whereQuery,
                select: {
                    id: true,
                    namaLengkap: true,
                    role: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
        });
    }
    findRole(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const search = (0, sigleSearch_1.buildSingleSearch)("name", params.value);
            console.log("dataRole", params.role);
            let rolesArray;
            if (params.role == null) {
                rolesArray = undefined;
            }
            else if (Array.isArray(params.role)) {
                rolesArray = params.role.map(String);
            }
            else if (typeof params.role === "string") {
                try {
                    const parsed = JSON.parse(params.role);
                    rolesArray = Array.isArray(parsed)
                        ? parsed.map(String)
                        : [String(parsed)];
                }
                catch (_a) {
                    rolesArray = params.role
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                }
            }
            else {
                rolesArray = [String(params.role)];
            }
            const where = Object.assign(Object.assign({}, (params.value ? search : {})), (rolesArray && rolesArray.length ? { name: { in: rolesArray } } : {}));
            const roles = yield client_1.prisma.role.findMany({
                where: where,
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: {
                    name: "asc",
                },
            });
            return roles;
        });
    }
    findTransportMethod(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const search = (0, sigleSearch_1.buildSingleSearch)("name", params.value);
            const where = params.value ? search : {};
            if (params.filter === "true") {
                where.name = {
                    not: "ALL",
                };
            }
            const data = yield client_1.prisma.angkut.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                },
                orderBy: {
                    name: "asc",
                },
            });
            return data;
        });
    }
    findGroupTim(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const stringUsername = (0, sigleSearch_1.buildSingleSearch)("username", params.value);
            const dateOrderBy = (0, dateFilter_1.buildDateFilter)(params);
            const orderBy = [];
            if (dateOrderBy)
                orderBy.push(dateOrderBy);
            const matchedTims = yield client_1.prisma.team.findMany({
                where: {
                    employee: Object.assign({}, stringUsername),
                },
                select: {
                    idGroupTeam: true,
                },
            });
            const groupTimIds = [...new Set(matchedTims.map((tim) => tim.idGroupTeam))];
            if (groupTimIds.length === 0) {
                return { data: [], total: 0 };
            }
            const groupTimList = yield client_1.prisma.groupTeam.findMany({
                where: {
                    id: {
                        in: groupTimIds,
                    },
                    status: true,
                },
                orderBy: orderBy,
                include: {
                    team: {
                        include: {
                            employee: true,
                        },
                    },
                },
            });
            const mappedData = groupTimList.map((group) => ({
                idGroupTeam: group.id,
                GroupTeam: {
                    status: group.status,
                    createdAt: group.createdAt,
                    updatedAt: group.updatedAt,
                },
                ListTeam: group.team.map((item) => ({
                    id: item.id,
                    namaLengkap: item.employee.namaLengkap,
                })),
            }));
            return mappedData;
        });
    }
    findContainerSize() {
        return __awaiter(this, arguments, void 0, function* (params = {}) {
            const where = {};
            if (params.filter === "true") {
                where.name = { not: "ALL" };
            }
            return yield client_1.prisma.containerSize.findMany({ where });
        });
    }
    findTradeType() {
        return __awaiter(this, arguments, void 0, function* (params = {}) {
            const where = {};
            if (params.filter === "true") {
                where.name = { not: "ALL" };
            }
            return yield client_1.prisma.tradeType.findMany({ where });
        });
    }
    findTim() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield client_1.prisma.team.findMany();
        });
    }
    findStatusBongkar() {
        return __awaiter(this, void 0, void 0, function* () {
            return client_1.prisma.statusBongkar.findMany();
        });
    }
}
exports.default = CommonOptionsServices;
