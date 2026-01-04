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
exports.seedUser = void 0;
const encrypt_1 = require("@common/utils/encrypt");
const client_1 = require("src/config/database/client");
const seedUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield client_1.prisma.employee.upsert({
        where: { email: "admin@gmail.com" },
        update: {},
        create: {
            namaLengkap: "Admin",
            email: "admin@gmail.com",
            roleId: 1,
            status: true,
        },
    });
    if (admin) {
        yield client_1.prisma.user.upsert({
            where: { employeeId: admin.id },
            update: {},
            create: {
                username: "admin",
                password: yield (0, encrypt_1.encrypt)("admin123"),
                employeeId: admin.id,
            },
        });
    }
    const manager = yield client_1.prisma.employee.upsert({
        where: { email: "manager@gmail.com" },
        update: {},
        create: {
            namaLengkap: "Manager",
            email: "manager@gmail.com",
            roleId: 2,
            status: true,
        },
    });
    if (manager) {
        yield client_1.prisma.user.upsert({
            where: { employeeId: manager.id },
            update: {},
            create: {
                username: "manager",
                password: yield (0, encrypt_1.encrypt)("manager123"),
                employeeId: manager.id,
            },
        });
    }
    const spv = yield client_1.prisma.employee.upsert({
        where: { email: "spv@gmail.com" },
        update: {},
        create: {
            namaLengkap: "Supervisor",
            email: "spv@gmail.com",
            roleId: 3,
            status: true,
        },
    });
    if (spv) {
        yield client_1.prisma.user.upsert({
            where: { employeeId: spv.id },
            update: {},
            create: {
                username: "spv",
                password: yield (0, encrypt_1.encrypt)("spv123"),
                employeeId: spv.id,
            },
        });
    }
    console.log("Admin, Manager, dan SPV seeding done.");
});
exports.seedUser = seedUser;
