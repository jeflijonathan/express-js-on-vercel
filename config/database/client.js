"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
const logger_1 = require("src/common/logger");
dotenv_1.default.config();
const dbUser = (_a = process.env.DB_USER) !== null && _a !== void 0 ? _a : process.env.DB_USERNAME;
const dbPassword = (_c = (_b = process.env.DB_PASSWORD) !== null && _b !== void 0 ? _b : process.env.DB_PASS) !== null && _c !== void 0 ? _c : process.env.DB_PASSWORD;
const dbHost = (_d = process.env.DB_HOST) !== null && _d !== void 0 ? _d : "localhost";
const dbPort = Number((_e = process.env.DB_PORT) !== null && _e !== void 0 ? _e : 3306);
const dbDatabase = (_g = (_f = process.env.DB_DATABASE) !== null && _f !== void 0 ? _f : process.env.DB_NAME) !== null && _g !== void 0 ? _g : "db_app";
const connectionLimit = Number((_j = (_h = process.env.DB_CONNECTION_LIMIT) !== null && _h !== void 0 ? _h : process.env.DB_POOL_LIMIT) !== null && _j !== void 0 ? _j : 10);
if (!dbUser || typeof dbPassword === "undefined" || dbPassword === null) {
    logger_1.logger.error("DB_USER or DB_PASSWORD is not set. Please copy 'example.env' to '.env' and set DB credentials.");
    throw new Error("Missing DB credentials in environment variables.");
}
const databaseUrl = process.env.DATABASE_URL ||
    `mysql://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPassword)}@${dbHost}:${dbPort}/${dbDatabase}?connection_limit=${connectionLimit}`;
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = databaseUrl;
}
const adapter = new adapter_mariadb_1.PrismaMariaDb({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbDatabase,
    connectionLimit,
});
exports.prisma = new client_1.PrismaClient({
    adapter,
    log: ["query", "error", "warn"],
});
