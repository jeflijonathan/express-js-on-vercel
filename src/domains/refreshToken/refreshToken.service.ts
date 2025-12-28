import { prisma } from "src/config/database/client";

export class RefreshTokenService {
    static async findAll(filters: { userId?: string; limit?: number; page?: number; search?: string; startDate?: string; endDate?: string }) {
        // Cleanup expired tokens
        await prisma.refreshToken.deleteMany({
            where: { expiresAt: { lt: new Date() } },
        });

        const take = Number(filters.limit) || 10;
        const skip = ((Number(filters.page) || 1) - 1) * take;

        const where: any = {};
        if (filters.userId) where.userId = filters.userId;

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

        const [data, total] = await Promise.all([
            prisma.refreshToken.findMany({
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
            prisma.refreshToken.count({ where }),
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
    }

    static async revokeToken(id: string) {
        return prisma.refreshToken.delete({
            where: { id },
        });
    }

    static async revokeAllByUser(userId: string) {
        return prisma.refreshToken.deleteMany({
            where: { userId },
        });
    }

    static async revokeBatch(ids: string[]) {
        return prisma.refreshToken.deleteMany({
            where: { id: { in: ids } },
        });
    }
}
