import { Prisma } from "@prisma/client";

export type TarifBongkarResponseModel = Prisma.TarifBongkarGetPayload<{
    select: {
        id: true,
        amount: true,
        barang: {
            select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        },
        containerSize: {
            select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        },
        tradeType: {
            select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        },
        angkut: {
            select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        },
        createdAt: true,
        updatedAt: true,
    },
}>;
