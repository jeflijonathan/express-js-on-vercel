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
require("dotenv/config");
const client_1 = require("src/config/database/client");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client_1.prisma.$connect();
            const res = yield client_1.prisma.$queryRaw `select 1 as ok`;
            console.log("DB connectivity check OK:", res);
        }
        catch (err) {
            console.error("DB connectivity check failed:", err);
            process.exit(1);
        }
        finally {
            yield client_1.prisma.$disconnect();
        }
    });
}
main();
