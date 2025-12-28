import { prisma } from "@config/database/client";


export class ActivityLogService {
    static async createLog(data: {
        userId: string;
        action: string;
        description?: string;
        ipAddress?: string;
        userAgent?: string;
    }) {
        return prisma.activityLog.create({
            data,
        });
    }

    static async findAll(filters: { userId?: string; action?: string; limit?: number; page?: number; search?: string }) {
        const take = Number(filters.limit) || 10;
        const skip = ((Number(filters.page) || 1) - 1) * take;

        const where: any = {};
        if (filters.userId) where.userId = filters.userId;
        if (filters.action) where.action = filters.action;

        if (filters.search) {
            where.OR = [
                { user: { username: { contains: filters.search } } },
                { user: { employee: { namaLengkap: { contains: filters.search } } } },
                { action: { contains: filters.search } },
                { description: { contains: filters.search } },
                { ipAddress: { contains: filters.search } },
            ];
        }

        const [data, total] = await Promise.all([
            prisma.activityLog.findMany({
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
            prisma.activityLog.count({ where }),
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


}
