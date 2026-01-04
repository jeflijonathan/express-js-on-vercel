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
const barangSeeder_1 = require("./barangSeeder");
const roleSeeder_1 = require("./roleSeeder");
const sizeContainerSeeder_1 = __importDefault(require("./sizeContainerSeeder"));
const TradeTypeSeed_1 = __importDefault(require("./TradeTypeSeed"));
const transportMethodSeeder_1 = require("./transportMethodSeeder");
const userSeeder_1 = require("./userSeeder");
const tarifBongkarMuatSeeder_1 = require("./tarifBongkarMuatSeeder");
const client_1 = require("src/config/database/client");
const arg = "all";
const listSeeder = [
    { name: "role", seeder: roleSeeder_1.seedRole },
    { name: "user", seeder: userSeeder_1.seedUser },
    { name: "transport", seeder: transportMethodSeeder_1.angkutSeeder },
    { name: "categoryitem", seeder: barangSeeder_1.barangSeeder },
    { name: "tradeType", seeder: TradeTypeSeed_1.default },
    { name: "containerSize", seeder: sizeContainerSeeder_1.default },
    { name: "tarifBongkarMuat", seeder: tarifBongkarMuatSeeder_1.tarifBongkarMuatSeeder },
];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client_1.prisma.$connect();
        for (const item of listSeeder) {
            yield item.seeder();
        }
    });
}
main()
    .then(() => {
    client_1.prisma.$disconnect().catch(() => { });
    console.log("Seeding complete");
})
    .catch((e) => {
    console.error("Error while seeding:", e);
    client_1.prisma.$disconnect().catch(() => { });
    process.exit(1);
});
