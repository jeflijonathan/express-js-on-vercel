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
exports.tarifBongkarMuatSeeder = void 0;
const client_1 = require("../config/database/client");
const tarifBongkarMuatSeeder = () => __awaiter(void 0, void 0, void 0, function* () {
    const getBarangId = (name) => __awaiter(void 0, void 0, void 0, function* () { var _a; return (_a = (yield client_1.prisma.barang.findFirst({ where: { name } }))) === null || _a === void 0 ? void 0 : _a.id; });
    const getTradeId = (name) => __awaiter(void 0, void 0, void 0, function* () { var _a; return (_a = (yield client_1.prisma.tradeType.findFirst({ where: { name } }))) === null || _a === void 0 ? void 0 : _a.id; });
    const getSizeId = (name) => __awaiter(void 0, void 0, void 0, function* () { var _a; return (_a = (yield client_1.prisma.containerSize.findFirst({ where: { name } }))) === null || _a === void 0 ? void 0 : _a.id; });
    const getAngkutId = (name) => __awaiter(void 0, void 0, void 0, function* () { var _a; return (_a = (yield client_1.prisma.angkut.findFirst({ where: { name } }))) === null || _a === void 0 ? void 0 : _a.id; });
    const ids = {
        barang: {
            all: yield getBarangId("ALL"),
            mesin: yield getBarangId("MESIN"),
            plastik: yield getBarangId("BIJI PLASTIK"),
            nonPlastik: yield getBarangId("NON PLASTIK"),
            lain: yield getBarangId("LAIN-LAIN"),
        },
        trade: {
            import: yield getTradeId("IMPORT"),
            export: yield getTradeId("EXPORT"),
        },
        size: {
            f20: yield getSizeId("20 feet"),
            f40: yield getSizeId("40 feet"),
            lclHijau: yield getSizeId("LCL(hijau)"),
            lclMerah: yield getSizeId("LCL(merah)"),
            all: yield getSizeId("ALL"),
        },
        angkut: {
            forklift: yield getAngkutId("FORKLIFT"),
            manual: yield getAngkutId("MANUAL"),
            all: yield getAngkutId("ALL"),
        }
    };
    if (!ids.trade.import || !ids.size.f20) {
        console.error("Missing essential master data. Ensure all master seeders have run.");
        return;
    }
    const tarifData = [
        { idTradeType: ids.trade.import, idContainerSize: ids.size.f40, idAngkut: ids.angkut.forklift, idBarang: ids.barang.all, amount: 80000, jasaWrapping: false },
        { idTradeType: ids.trade.import, idContainerSize: ids.size.f40, idAngkut: ids.angkut.manual, idBarang: ids.barang.mesin, amount: 180000, jasaWrapping: false },
        { idTradeType: ids.trade.import, idContainerSize: ids.size.f40, idAngkut: ids.angkut.manual, idBarang: ids.barang.lain, amount: 250000, jasaWrapping: false },
        { idTradeType: ids.trade.import, idContainerSize: ids.size.f20, idAngkut: ids.angkut.forklift, idBarang: ids.barang.all, amount: 60000, jasaWrapping: false },
        { idTradeType: ids.trade.import, idContainerSize: ids.size.f20, idAngkut: ids.angkut.manual, idBarang: ids.barang.plastik, amount: 230000, jasaWrapping: false },
        { idTradeType: ids.trade.import, idContainerSize: ids.size.f20, idAngkut: ids.angkut.manual, idBarang: ids.barang.nonPlastik, amount: 180000, jasaWrapping: false },
        { idTradeType: ids.trade.import, idContainerSize: ids.size.f20, idAngkut: ids.angkut.manual, idBarang: ids.barang.mesin, amount: 140000, jasaWrapping: false },
        { idTradeType: ids.trade.import, idContainerSize: ids.size.lclHijau, idAngkut: ids.angkut.manual, idBarang: ids.barang.all, amount: 100000, jasaWrapping: false },
        { idTradeType: ids.trade.import, idContainerSize: ids.size.lclMerah, idAngkut: ids.angkut.manual, idBarang: ids.barang.all, amount: 120000, jasaWrapping: false },
        { idTradeType: ids.trade.export, idContainerSize: ids.size.f40, idAngkut: ids.angkut.forklift, idBarang: ids.barang.all, amount: 250000, jasaWrapping: false },
        { idTradeType: ids.trade.export, idContainerSize: ids.size.f40, idAngkut: ids.angkut.manual, idBarang: ids.barang.all, amount: 250000, jasaWrapping: false },
        { idTradeType: ids.trade.export, idContainerSize: ids.size.f20, idAngkut: ids.angkut.forklift, idBarang: ids.barang.all, amount: 300000, jasaWrapping: false },
        { idTradeType: ids.trade.export, idContainerSize: ids.size.f20, idAngkut: ids.angkut.manual, idBarang: ids.barang.all, amount: 0, jasaWrapping: false },
        { idTradeType: ids.trade.export, idContainerSize: ids.size.f20, idAngkut: ids.angkut.forklift, idBarang: ids.barang.all, amount: 0, jasaWrapping: false },
        { idTradeType: ids.trade.export, idContainerSize: ids.size.lclHijau, idAngkut: ids.angkut.manual, idBarang: ids.barang.all, amount: 100000, jasaWrapping: false },
        { idTradeType: ids.trade.import, idContainerSize: ids.size.all, idAngkut: ids.angkut.all, idBarang: ids.barang.all, amount: 20000, jasaWrapping: true },
    ];
    console.log("Starting TarifBongkar seeding...");
    for (const data of tarifData) {
        if (!data.idBarang || !data.idTradeType || !data.idContainerSize || !data.idAngkut) {
            console.warn("Skipping row due to missing master data ID:", data);
            continue;
        }
        const existing = yield client_1.prisma.tarifBongkar.findFirst({
            where: {
                idBarang: data.idBarang,
                idContainerSize: data.idContainerSize,
                idTradeType: data.idTradeType,
                idAngkut: data.idAngkut,
                jasaWrapping: data.jasaWrapping,
            }
        });
        if (!existing) {
            yield client_1.prisma.tarifBongkar.create({
                data: data
            });
            console.log(`Created Tarif: Amount ${data.amount}`);
        }
        else {
            if (existing.amount !== data.amount) {
                yield client_1.prisma.tarifBongkar.update({
                    where: { id: existing.id },
                    data: { amount: data.amount }
                });
                console.log(`Updated Tarif: Amount ${existing.amount} -> ${data.amount}`);
            }
            else {
                console.log(`Skipped existing Tarif: Amount ${existing.amount}`);
            }
        }
    }
    console.log("TarifBongkar seeding completed.");
});
exports.tarifBongkarMuatSeeder = tarifBongkarMuatSeeder;
