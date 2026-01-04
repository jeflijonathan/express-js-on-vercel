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
require("dotenv/config");
const router_1 = __importDefault(require("./config/router/router"));
const server_1 = __importDefault(require("./config/server/server"));
const express_1 = __importDefault(require("express"));
const client_1 = require("src/config/database/client");
const app = (0, express_1.default)();
const server = new server_1.default(app);
const router = new router_1.default(app);
router.routerAPI();
router.routerExcel();
app.use((_, res) => {
    res.status(404).json({
        status: "Error",
        statusCode: 404,
        message: "404 Not Found Page",
        data: [],
    });
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield server.listen();
            process.on("SIGINT", () => __awaiter(this, void 0, void 0, function* () {
                yield client_1.prisma.$disconnect();
                process.exit(0);
            }));
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
    });
}
// Only run the server if this file is executed directly
if (require.main === module) {
    main();
}
exports.default = app;
