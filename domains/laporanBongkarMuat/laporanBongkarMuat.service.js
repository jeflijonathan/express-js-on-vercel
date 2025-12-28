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
const laporanBongkarMuat_repository_1 = __importDefault(require("src/repository/laporanBongkarMuat/laporanBongkarMuat.repository"));
const laporanBongkarMuatCreate_dto_1 = __importDefault(require("./dto/laporanBongkarMuatCreate.dto"));
const laporanBongkarMuatUpdate_dto_1 = __importDefault(require("./dto/laporanBongkarMuatUpdate.dto"));
const client_1 = require("src/config/database/client");
const statusCodes_1 = require("@common/consts/statusCodes");
class LaporanBongkarMuatService {
    constructor() {
        this.findAll = (...args_1) => __awaiter(this, [...args_1], void 0, function* (queryParams = {}) {
            const { value, search, page = 1, limit = 10 } = queryParams;
            const searchVal = search || value;
            let where = {};
            if (queryParams.startDate && queryParams.endDate) {
                const startSearch = new Date(queryParams.startDate);
                startSearch.setHours(0, 0, 0, 0);
                const endSearch = new Date(queryParams.endDate);
                endSearch.setHours(23, 59, 59, 999);
                where.tanggalAwal = { gte: startSearch };
                where.tanggalAkhir = { lte: endSearch };
            }
            if (searchVal) {
                const isNumeric = !isNaN(Number(searchVal));
                where.OR = [
                    {
                        detailLaporan: {
                            some: {
                                idSesiBongkar: {
                                    contains: searchVal,
                                }
                            }
                        }
                    }
                ];
                if (isNumeric) {
                    where.OR.push({ id: Number(searchVal) });
                }
            }
            let sorter;
            if (queryParams.sort && queryParams.order_by) {
                const order = queryParams.order_by.toLowerCase();
                if (order === "asc" || order === "desc") {
                    sorter = {
                        [queryParams.sort]: order,
                    };
                }
            }
            else {
                sorter = { createdAt: "desc" };
            }
            const [data, total] = yield Promise.all([
                this._laporanRepository.findAll(where, { page, limit }, {
                    include: {
                        detailLaporan: {
                            include: {
                                sesiBongkar: {
                                    include: {
                                        groupTeam: {
                                            include: {
                                                team: {
                                                    include: {
                                                        employee: true,
                                                    },
                                                },
                                            },
                                        },
                                        containerSize: true,
                                        tradeType: true,
                                        angkut: true,
                                        barang: true,
                                        statusBongkar: true,
                                    },
                                },
                            },
                        },
                    },
                }, sorter),
                this._laporanRepository.count({ query: where }),
            ]);
            return { data, total };
        });
        this.findById = (id) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this._laporanRepository.findById(id, {
                include: {
                    detailLaporan: {
                        include: {
                            sesiBongkar: {
                                include: {
                                    groupTeam: {
                                        include: {
                                            team: {
                                                include: {
                                                    employee: true,
                                                },
                                            },
                                        },
                                    },
                                    containerSize: true,
                                    tradeType: true,
                                    angkut: true,
                                    barang: true,
                                    statusBongkar: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!result) {
                throw {
                    statusCode: statusCodes_1.StatusNotFound,
                    message: "Laporan tidak ditemukan",
                };
            }
            return result;
        });
        this.create = (body) => __awaiter(this, void 0, void 0, function* () {
            const parsed = yield laporanBongkarMuatCreate_dto_1.default.fromCreate(body);
            const { tanggalAwal, tanggalAkhir } = parsed;
            const startDate = new Date(tanggalAwal);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(tanggalAkhir);
            endDate.setHours(23, 59, 59, 999);
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                throw {
                    statusCode: statusCodes_1.StatusBadRequest,
                    message: "Format tanggal tidak valid",
                };
            }
            const sesiBongkarList = yield client_1.prisma.sesiBongkar.findMany({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                    statusBongkar: {
                        name: "DONE",
                    },
                },
                include: {
                    containerSize: true,
                    tradeType: true,
                    angkut: true,
                    groupTeam: {
                        include: {
                            team: true,
                        },
                    },
                },
            });
            if (sesiBongkarList.length === 0) {
                throw {
                    statusCode: statusCodes_1.StatusBadRequest,
                    message: "Tidak ada data Sesi Bongkar yang sudah DONE pada rentang tanggal tersebut",
                };
            }
            const tarifBongkar = yield client_1.prisma.tarifBongkar.findMany({
                include: { barang: true, angkut: true, containerSize: true },
            });
            const gajiTable = yield client_1.prisma.gaji.findMany({
                include: { angkut: true }
            });
            const laporan = yield client_1.prisma.laporan.create({
                data: {
                    tanggalAwal: startDate,
                    tanggalAkhir: endDate,
                },
            });
            const detailLaporanData = sesiBongkarList.map((sesi) => {
                var _a, _b, _c, _d;
                const resolvePrice = (isWrapping) => {
                    const subset = tarifBongkar.filter((t) => t.idTradeType === sesi.idTradeType && t.jasaWrapping === isWrapping);
                    const getScore = (t) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h;
                        let score = 0;
                        if (t.idContainerSize === sesi.idContainerSize)
                            score += 100;
                        else if (((_b = (_a = t.containerSize) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === "all" || ((_d = (_c = t.containerSize) === null || _c === void 0 ? void 0 : _c.name) === null || _d === void 0 ? void 0 : _d.toLowerCase()) === "all size")
                            score += 50;
                        else
                            return -1;
                        if (t.idBarang === sesi.idBarang)
                            score += 10;
                        else if (((_f = (_e = t.barang) === null || _e === void 0 ? void 0 : _e.name) === null || _f === void 0 ? void 0 : _f.toLowerCase()) === "all")
                            score += 5;
                        else
                            return -1;
                        if (t.idAngkut === sesi.idAngkut)
                            score += 2;
                        else if (((_h = (_g = t.angkut) === null || _g === void 0 ? void 0 : _g.name) === null || _h === void 0 ? void 0 : _h.toLowerCase()) === "all")
                            score += 1;
                        else
                            return -1;
                        return score;
                    };
                    const ScoredCandidates = subset
                        .map(t => ({ tariff: t, score: getScore(t) }))
                        .filter(item => item.score >= 0)
                        .sort((a, b) => b.score - a.score);
                    if (ScoredCandidates.length > 0) {
                        return ScoredCandidates[0].tariff.amount;
                    }
                    return 0;
                };
                const basePrice = resolvePrice(false);
                let wrappingPrice = 0;
                const isExport = ((_b = (_a = sesi.tradeType) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toUpperCase()) === "EXPORT";
                if (sesi.jasaWrapping && !isExport) {
                    wrappingPrice = resolvePrice(true);
                }
                const gajiCandidates = gajiTable.filter((g) => g.containerSizeId === sesi.idContainerSize &&
                    g.tradeTypeId === sesi.idTradeType &&
                    g.koorlapId === sesi.idKoorLap);
                let gajiEntry = gajiCandidates.find(g => g.angkutId === sesi.idAngkut);
                if (!gajiEntry) {
                    gajiEntry = gajiCandidates.find(g => { var _a, _b; return ((_b = (_a = g.angkut) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toUpperCase()) === "ALL"; });
                }
                const teamMemberCount = ((_d = (_c = sesi.groupTeam) === null || _c === void 0 ? void 0 : _c.team) === null || _d === void 0 ? void 0 : _d.length) || 1;
                const gajiKaryawan = ((gajiEntry === null || gajiEntry === void 0 ? void 0 : gajiEntry.gaji) || 0) * teamMemberCount;
                return {
                    idSesiBongkar: sesi.noContainer,
                    gajiKaryawan,
                    hargaBongkar: basePrice,
                    biayaWrapping: wrappingPrice,
                    idLaporan: laporan.id,
                };
            });
            if (detailLaporanData.length > 0) {
                yield client_1.prisma.detailLaporan.createMany({
                    data: detailLaporanData,
                });
            }
            return this.findById(laporan.id);
        });
        this.update = (id, body) => __awaiter(this, void 0, void 0, function* () {
            const parsed = yield laporanBongkarMuatUpdate_dto_1.default.fromUpdate(body);
            const existingLaporan = yield this._laporanRepository.findById(id);
            if (!existingLaporan) {
                throw {
                    statusCode: statusCodes_1.StatusNotFound,
                    message: "Laporan tidak ditemukan",
                };
            }
            const tanggalAwal = parsed.tanggalAwal
                ? new Date(parsed.tanggalAwal)
                : existingLaporan.tanggalAwal;
            tanggalAwal.setHours(0, 0, 0, 0);
            const tanggalAkhir = parsed.tanggalAkhir
                ? new Date(parsed.tanggalAkhir)
                : existingLaporan.tanggalAkhir;
            tanggalAkhir.setHours(23, 59, 59, 999);
            yield client_1.prisma.detailLaporan.deleteMany({
                where: { idLaporan: id },
            });
            const sesiBongkarList = yield client_1.prisma.sesiBongkar.findMany({
                where: {
                    createdAt: {
                        gte: tanggalAwal,
                        lte: tanggalAkhir,
                    },
                    statusBongkar: {
                        name: "DONE",
                    },
                },
                include: {
                    containerSize: true,
                    tradeType: true,
                    angkut: true,
                    groupTeam: {
                        include: {
                            team: true,
                        },
                    },
                },
            });
            if (sesiBongkarList.length === 0) {
                throw {
                    statusCode: statusCodes_1.StatusBadRequest,
                    message: "Tidak ada data Sesi Bongkar pada rentang tanggal tersebut",
                };
            }
            const tarifBongkar = yield client_1.prisma.tarifBongkar.findMany({
                include: { barang: true, angkut: true, containerSize: true },
            });
            const gajiTable = yield client_1.prisma.gaji.findMany({
                include: { angkut: true }
            });
            const detailLaporanData = sesiBongkarList.map((sesi) => {
                var _a, _b, _c, _d;
                const resolvePrice = (isWrapping) => {
                    const subset = tarifBongkar.filter((t) => t.idTradeType === sesi.idTradeType && t.jasaWrapping === isWrapping);
                    const getScore = (t) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h;
                        let score = 0;
                        if (t.idContainerSize === sesi.idContainerSize)
                            score += 100;
                        else if (((_b = (_a = t.containerSize) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === "all" || ((_d = (_c = t.containerSize) === null || _c === void 0 ? void 0 : _c.name) === null || _d === void 0 ? void 0 : _d.toLowerCase()) === "all size")
                            score += 50;
                        else
                            return -1;
                        if (t.idBarang === sesi.idBarang)
                            score += 10;
                        else if (((_f = (_e = t.barang) === null || _e === void 0 ? void 0 : _e.name) === null || _f === void 0 ? void 0 : _f.toLowerCase()) === "all")
                            score += 5;
                        else
                            return -1;
                        if (t.idAngkut === sesi.idAngkut)
                            score += 2;
                        else if (((_h = (_g = t.angkut) === null || _g === void 0 ? void 0 : _g.name) === null || _h === void 0 ? void 0 : _h.toLowerCase()) === "all")
                            score += 1;
                        else
                            return -1;
                        return score;
                    };
                    const ScoredCandidates = subset
                        .map(t => ({ tariff: t, score: getScore(t) }))
                        .filter(item => item.score >= 0)
                        .sort((a, b) => b.score - a.score);
                    if (ScoredCandidates.length > 0) {
                        return ScoredCandidates[0].tariff.amount;
                    }
                    return 0;
                };
                const basePrice = resolvePrice(false);
                let wrappingPrice = 0;
                const isExport = ((_b = (_a = sesi.tradeType) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toUpperCase()) === "EXPORT";
                if (sesi.jasaWrapping && !isExport) {
                    wrappingPrice = resolvePrice(true);
                }
                const gajiCandidates = gajiTable.filter((g) => g.containerSizeId === sesi.idContainerSize &&
                    g.tradeTypeId === sesi.idTradeType &&
                    g.koorlapId === sesi.idKoorLap);
                let gajiEntry = gajiCandidates.find(g => g.angkutId === sesi.idAngkut);
                if (!gajiEntry) {
                    gajiEntry = gajiCandidates.find(g => { var _a, _b; return ((_b = (_a = g.angkut) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toUpperCase()) === "ALL"; });
                }
                const teamMemberCount = ((_d = (_c = sesi.groupTeam) === null || _c === void 0 ? void 0 : _c.team) === null || _d === void 0 ? void 0 : _d.length) || 1;
                const gajiKaryawan = ((gajiEntry === null || gajiEntry === void 0 ? void 0 : gajiEntry.gaji) || 0) * teamMemberCount;
                return {
                    idSesiBongkar: sesi.noContainer,
                    gajiKaryawan,
                    hargaBongkar: basePrice,
                    biayaWrapping: wrappingPrice,
                    idLaporan: id,
                };
            });
            if (detailLaporanData.length > 0) {
                yield client_1.prisma.detailLaporan.createMany({
                    data: detailLaporanData,
                });
            }
            yield this._laporanRepository.updateLaporan(id, {
                tanggalAwal,
                tanggalAkhir,
            });
            return this.findById(id);
        });
        this.delete = (id) => __awaiter(this, void 0, void 0, function* () {
            const existingLaporan = yield this._laporanRepository.findById(id);
            if (!existingLaporan) {
                throw {
                    statusCode: statusCodes_1.StatusNotFound,
                    message: "Laporan tidak ditemukan",
                };
            }
            return this._laporanRepository.deleteLaporan(id);
        });
        this._laporanRepository = new laporanBongkarMuat_repository_1.default();
    }
}
exports.default = LaporanBongkarMuatService;
