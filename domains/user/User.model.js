"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectDataUser = void 0;
const selectDataUser = {
    select: {
        id: true,
        username: true,
        employee: {
            select: {
                id: true,
                namaLengkap: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                status: true,
            },
        },
    },
};
exports.selectDataUser = selectDataUser;
