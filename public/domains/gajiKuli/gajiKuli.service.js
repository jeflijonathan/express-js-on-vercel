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
const statusCodes_1 = require("@common/consts/statusCodes");
const gajiKuli_repository_1 = __importDefault(require("src/repository/gajiKuli/gajiKuli.repository"));
const gajiKuliCreate_dto_1 = __importDefault(require("./dto/gajiKuliCreate.dto"));
const gajiKuliUpdate_dto_1 = __importDefault(require("./dto/gajiKuliUpdate.dto"));
const gajiKuliBatch_dto_1 = __importDefault(require("./dto/gajiKuliBatch.dto"));
class GajiKuliService {
    constructor() {
        this.findGajiKuli = (req_1, ...args_1) => __awaiter(this, [req_1, ...args_1], void 0, function* (req, params = {}, queryParams = {}) {
            const { value, page = 1, limit = 10 } = queryParams;
            let employeeWhere = {
                gajiKaryawan: { some: {} }
            };
            if (value && value.trim() !== "") {
                employeeWhere.namaLengkap = { contains: value };
            }
            if (queryParams.koorlapId) {
                employeeWhere.id = queryParams.koorlapId;
            }
            const totalEmployees = yield this._gajiKuliRepository.prisma.employee.count({
                where: employeeWhere
            });
            const paginatedEmployees = yield this._gajiKuliRepository.prisma.employee.findMany({
                where: employeeWhere,
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                select: { id: true },
                orderBy: queryParams.sort === "updatedAt" ? { updatedAt: queryParams.order_by || "desc" } : { createdAt: queryParams.order_by || "desc" }
            });
            const employeeIds = paginatedEmployees.map(e => e.id);
            const data = yield this._gajiKuliRepository.findAll({
                koorlapId: { in: employeeIds }
            }, undefined, {
                select: {
                    id: true,
                    gaji: true,
                    angkut: {
                        select: {
                            id: true,
                            name: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    containerSize: {
                        select: {
                            id: true,
                            name: true,
                            createdAt: true,
                            updatedAt: true,
                        }
                    },
                    tradeType: {
                        select: {
                            id: true,
                            name: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    koorlap: {
                        select: {
                            id: true,
                            namaLengkap: true,
                        }
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            }, queryParams.sort && queryParams.order_by ? { [queryParams.sort]: queryParams.order_by } : undefined);
            return { data, total: totalEmployees };
        });
        this.findGajiKuliById = (id) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this._gajiKuliRepository.findById(id, {
                select: {
                    id: true,
                    gaji: true,
                    angkut: {
                        select: {
                            id: true,
                            name: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    containerSize: {
                        select: {
                            id: true,
                            name: true,
                            createdAt: true,
                            updatedAt: true,
                        }
                    },
                    tradeType: {
                        select: {
                            id: true,
                            name: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    koorlap: {
                        select: {
                            id: true,
                            namaLengkap: true,
                        }
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return result;
        });
        this.createGajiKuli = (body) => __awaiter(this, void 0, void 0, function* () {
            const parsed = yield gajiKuliCreate_dto_1.default.fromCreateGajiKuli(body);
            let { angkutId, tradeTypeId, containerSizeId, gaji, koorlapId } = parsed;
            const containerSize = yield this._gajiKuliRepository.prisma.containerSize.findUnique({
                where: { id: containerSizeId }
            });
            if (containerSize && (containerSize.name === "LCL(merah)" || containerSize.name === "LCL(hijau)")) {
                const angkutAll = yield this._gajiKuliRepository.prisma.angkut.findFirst({
                    where: { name: "ALLLCL" }
                });
                if (angkutAll) {
                    angkutId = angkutAll.id;
                }
            }
            const checkGajiKuli = yield this._gajiKuliRepository.findOne({
                angkutId,
                tradeTypeId,
                containerSizeId,
                koorlapId
            });
            if (checkGajiKuli) {
                throw {
                    statusCode: statusCodes_1.StatusBadRequest,
                    message: `Gaji Kuli with the same parameters already exists`,
                };
            }
            return yield this._gajiKuliRepository.createGajiKuli({
                angkut: { connect: { id: angkutId } },
                tradeType: { connect: { id: tradeTypeId } },
                containerSize: { connect: { id: containerSizeId } },
                koorlap: { connect: { id: koorlapId } },
                gaji: gaji,
            });
        });
        this.updateGajiKuli = (id, body) => __awaiter(this, void 0, void 0, function* () {
            const parsed = yield gajiKuliUpdate_dto_1.default.fromUpdateGajiKuli(body);
            const { gaji, koorlapId } = parsed;
            const data = {
                gaji: gaji,
            };
            if (koorlapId) {
                data.koorlap = { connect: { id: koorlapId } };
            }
            return yield this._gajiKuliRepository.updateGajiKuli(id, data);
        });
        this.deleteGajiKuli = (id) => __awaiter(this, void 0, void 0, function* () {
            return this._gajiKuliRepository.deleteGajiKuli(id);
        });
        this.batchSaveGajiKuli = (body) => __awaiter(this, void 0, void 0, function* () {
            const parsed = yield gajiKuliBatch_dto_1.default.fromBatchGajiKuli(body);
            const { koorlapId, items, isCreateMode } = parsed;
            if (isCreateMode) {
                const existing = yield this._gajiKuliRepository.count({
                    query: { koorlapId }
                });
                if (existing > 0) {
                    throw {
                        statusCode: statusCodes_1.StatusBadRequest,
                        message: `Wage data for this Coordinator already exists. Please use Edit instead.`,
                    };
                }
            }
            const results = [];
            for (const item of items) {
                const { angkutId, tradeTypeId, containerSizeId, gaji } = item;
                const checkGajiKuli = yield this._gajiKuliRepository.findOne({
                    angkutId,
                    tradeTypeId,
                    containerSizeId,
                    koorlapId
                });
                if (checkGajiKuli) {
                    results.push(yield this._gajiKuliRepository.updateGajiKuli(checkGajiKuli.id, {
                        gaji,
                    }));
                }
                else {
                    results.push(yield this._gajiKuliRepository.createGajiKuli({
                        angkut: { connect: { id: angkutId } },
                        tradeType: { connect: { id: tradeTypeId } },
                        containerSize: { connect: { id: containerSizeId } },
                        koorlap: { connect: { id: koorlapId } },
                        gaji: gaji,
                    }));
                }
            }
            return results;
        });
        this._gajiKuliRepository = new gajiKuli_repository_1.default();
    }
}
exports.default = GajiKuliService;
