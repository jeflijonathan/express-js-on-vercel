import { prisma } from "../../config/database/client";

export default class DashboardService {
    async getStats(year?: number, tradeType?: string) {
        const currentYear = year || new Date().getFullYear();
        const startOfYear = new Date(currentYear, 0, 1);
        const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

        const sesiBongkarWhere = {
            createdAt: { gte: startOfYear, lte: endOfYear },
            ...(tradeType && tradeType !== "ALL" ? { tradeType: { name: tradeType } } : {}),
        };

        const [
            userCount,
            containerCount,
            koorlapCount,
            timCount,
            revenueImportRaw,
            revenueExportRaw,
            chartDataRaw,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.sesiBongkar.count({
                where: sesiBongkarWhere,
            }),
            prisma.employee.count({
                where: {
                    role: {
                        name: "KOORLAP",
                    },
                },
            }),
            prisma.groupTeam.count(),
            tradeType === 'EXPORT'
                ? { _sum: { hargaBongkar: 0 } }
                : prisma.detailLaporan.aggregate({
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
                : prisma.detailLaporan.aggregate({
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
            prisma.sesiBongkar.findMany({
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
            const monthlyData = chartDataRaw.filter(
                (item) => new Date(item.createdAt).getMonth() === index
            );
            const importCount = monthlyData.filter(
                (item) => item.tradeType.name === "IMPORT"
            ).length;

            const exportCount = monthlyData.filter(
                (item) => item.tradeType.name === "EXPORT"
            ).length;

            return {
                month: month,
                import: importCount,
                export: exportCount,
            };
        });

        const revenueImport = (revenueImportRaw as any)._sum?.hargaBongkar || 0;
        const revenueExport = (revenueExportRaw as any)._sum?.hargaBongkar || 0;

        return {
            revenueImport,
            revenueExport,
            userCount,
            containerCount,
            koorlapCount,
            timCount,
            chartData,
        };
    }
}
