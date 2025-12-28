import { Prisma } from "@prisma/client";

export type GajiKuliResponseModel = Prisma.GajiGetPayload<{
    select: {
        id: true;
        gaji: true;
        angkut: {
            select: {
                id: true;
                name: true;
                createdAt: true;
                updatedAt: true;
            };
        };
        containerSize: {
            select: {
                id: true;
                name: true;
                createdAt: true;
                updatedAt: true;
            };
        };
        tradeType: {
            select: {
                id: true;
                name: true;
                createdAt: true;
                updatedAt: true;
            };
        };
        koorlap: {
            select: {
                id: true;
                namaLengkap: true;
            };
        };
        createdAt: true;
        updatedAt: true;
    };
}>;
