"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("src/common/logger");
if (!process.env.DATABASE_URL) {
    logger_1.logger.warn("DATABASE_URL is not set. Please ensure it is defined in your environment variables.");
}
exports.prisma = new client_1.PrismaClient({
    log: ["query", "error", "warn"],
});
