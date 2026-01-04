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
const client_1 = require("../../config/database/client");
class DashboardService {
    getStats(year, tradeType) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const currentYear = year || new Date().getFullYear();
            const startOfYear = new Date(currentYear, 0, 1);
            const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);
            const sesiBongkarWhere = Object.assign({ createdAt: { gte: startOfYear, lte: endOfYear } }, (tradeType && tradeType !== "ALL" ? { tradeType: { name: tradeType } } : {}));
            const [userCount, containerCount, koorlapCount, timCount, revenueImportRaw, revenueExportRaw, chartDataRaw,] = yield Promise.all([
                client_1.prisma.user.count(),
                client_1.prisma.sesiBongkar.count({
                    where: sesiBongkarWhere,
                }),
                client_1.prisma.employee.count({
                    where: {
                        role: {
                            name: "KOORLAP",
                        },
                    },
                }),
                client_1.prisma.groupTeam.count(),
                tradeType === 'EXPORT'
                    ? { _sum: { hargaBongkar: 0 } }
                    : client_1.prisma.detailLaporan.aggregate({
                        _sum: {
                            hargaBongkar: true,
                        },
                        where: {
                            sesiBongkar: {
                                tradeType: {
                                    name: "IMPORT",
                                },
                                createdAt: {
                                    gte: startOfYear,
                                    lte: endOfYear,
                                },
                            },
                        },
                    }),
                tradeType === 'IMPORT'
                    ? { _sum: { hargaBongkar: 0 } }
                    : client_1.prisma.detailLaporan.aggregate({
                        _sum: {
                            hargaBongkar: true,
                        },
                        where: {
                            sesiBongkar: {
                                tradeType: {
                                    name: "EXPORT",
                                },
                                createdAt: {
                                    gte: startOfYear,
                                    lte: endOfYear,
                                },
                            },
                        },
                    }),
                client_1.prisma.sesiBongkar.findMany({
                    where: sesiBongkarWhere,
                    select: {
                        createdAt: true,
                        tradeType: {
                            select: {
                                name: true,
                            },
                        },
                    },
                }),
            ]);
            const months = [
                "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
                "Jul", "Agu", "Sep", "okt", "nov", "des"
            ];
            const chartData = months.map((month, index) => {
                const monthlyData = chartDataRaw.filter((item) => new Date(item.createdAt).getMonth() === index);
                const importCount = monthlyData.filter((item) => item.tradeType.name === "IMPORT").length;
                const exportCount = monthlyData.filter((item) => item.tradeType.name === "EXPORT").length;
                return {
                    month: month,
                    import: importCount,
                    export: exportCount,
                };
            });
            const revenueImport = ((_a = revenueImportRaw._sum) === null || _a === void 0 ? void 0 : _a.hargaBongkar) || 0;
            const revenueExport = ((_b = revenueExportRaw._sum) === null || _b === void 0 ? void 0 : _b.hargaBongkar) || 0;
            return {
                revenueImport,
                revenueExport,
                userCount,
                containerCount,
                koorlapCount,
                timCount,
                chartData,
            };
        });
    }
}
exports.default = DashboardService;
