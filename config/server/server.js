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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@common/logger");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const env_1 = __importDefault(require("src/config/env/env"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = require("src/config/router/cors");
const fs_1 = __importDefault(require("fs"));
const client_1 = require("../database/client");
const statusCodes_1 = require("@common/consts/statusCodes");
class Server {
    constructor(app) {
        this.app = app;
        this.port = env_1.default.bePort;
        this.host = env_1.default.beHost;
        dotenv_1.default.config();
        app.use((0, cors_1.corsConfig)());
        app.use((0, cookie_parser_1.default)());
        app.use((0, helmet_1.default)());
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.set("trust proxy", true);
        dotenv_1.default.config();
        this.app.get("/api/health-check", (_, res) => {
            res.status(200).json({ status: "OK", message: "Health check passed" });
        });
        const url = `${process.env.DB_CONNECTION}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
        var schema = fs_1.default.readFileSync("prisma/schema.prisma", "utf-8");
        schema = schema.replace("_DATABASE_URL_", url);
        fs_1.default.writeFileSync("prisma/schema.prisma", schema);
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.cekDBConnetion();
                this.app.listen(this.port, this.host, () => {
                    logger_1.logger.info(`🚀 Server running at http://${this.host}:${this.port}`);
                });
            }
            catch (error) {
                logger_1.logger.error("❌ Database connection failed:", error);
                process.exit(1);
            }
        });
    }
    cekDBConnetion() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield client_1.prisma.$connect();
                logger_1.logger.info("✅ Database connected successfully");
            }
            catch (err) {
                this.app.use((_, res) => {
                    res.status(statusCodes_1.StatusServiceUnavailable).json({
                        status: "Error",
                        statusCode: statusCodes_1.StatusServiceUnavailable,
                        message: "The Database is not Connected",
                        data: [],
                    });
                });
            }
        });
    }
}
exports.default = Server;
