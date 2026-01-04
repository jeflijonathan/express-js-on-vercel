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
const tarifBongkarCreate_dto_1 = __importDefault(require("./dto/tarifBongkarCreate.dto"));
const tarifBongkarUpdate_dto_1 = __importDefault(require("./dto/tarifBongkarUpdate.dto"));
const tarifBongkarMuat_repository_1 = __importDefault(require("src/repository/tarifBongkarMuat/tarifBongkarMuat.repository"));
const barang_repository_1 = __importDefault(require("src/repository/barang/barang.repository"));
const tarifBongkarBatch_dto_1 = __importDefault(require("./dto/tarifBongkarBatch.dto"));
class TarifBongkarService {
    constructor() {
        this.findTarifBongkarMuat = (...args_1) => __awaiter(this, [...args_1], void 0, function* (queryParams = {}) {
            const { value, page = 1, limit = 10 } = queryParams;
            let where = {};
            if (value && value.trim() !== "") {
                where.OR = [
                    { barang: { name: { contains: value } } },
                    { angkut: { name: { contains: value } } },
                    { tradeType: { name: { contains: value } } },
                    { containerSize: { name: { contains: value } } }
                ];
            }
            if (queryParams.idBarang)
                where.idBarang = Number(queryParams.idBarang);
            if (queryParams.idAngkut)
                where.idAngkut = Number(queryParams.idAngkut);
            if (queryParams.idTradeType)
                where.idTradeType = Number(queryParams.idTradeType);
            if (queryParams.idContainerSize)
                where.idContainerSize = Number(queryParams.idContainerSize);
            let sorter;
            if (queryParams.sort && queryParams.order_by) {
                const order = queryParams.order_by.toLowerCase();
                if (order === "asc" || order === "desc") {
                    sorter = {
                        [queryParams.sort]: order,
                    };
                }
            }
            const data = this._bongkarRepository.findAll(where, undefined, {
                select: {
                    id: true,
                    amount: true,
                    jasaWrapping: true,
                    barang: {
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
                        },
                    },
                    tradeType: {
                        select: {
                            id: true,
                            name: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    angkut: {
                        select: {
                            id: true,
                            name: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            }, sorter);
            return data;
        });
        this.findTarifBongkarMuatById = (id) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this._bongkarRepository.findById(id, {
                select: {
                    id: true,
                    amount: true,
                    jasaWrapping: true,
                    barang: {
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
                        },
                    },
                    tradeType: {
                        select: {
                            id: true,
                            name: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    angkut: {
                        select: {
                            id: true,
                            name: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return result;
        });
        this.createTarifBongkarMuat = (body) => __awaiter(this, void 0, void 0, function* () {
            const parsed = yield tarifBongkarCreate_dto_1.default.fromCreateBongkarMuat(body);
            const { idBarang, idContainerSize, idTradeType, idAngkut, amount, jasaWrapping } = parsed;
            const barangAll = yield this._barangRepository.findOne({ name: "ALL" });
            if (!barangAll)
                throw { statusCode: 400, message: "Barang ALL not found" };
            if (idBarang === barangAll.id) {
                const existing = yield this._bongkarRepository.findOne({
                    idContainerSize,
                    idTradeType,
                    idAngkut,
                });
                if (existing) {
                    throw {
                        statusCode: statusCodes_1.StatusBadRequest,
                        message: `Conflict: A rate for this Size/Type/Angkut combination already exists. Remove specific items before adding 'ALL'.`,
                    };
                }
            }
            else {
                const existingAll = yield this._bongkarRepository.findOne({
                    idBarang: barangAll.id,
                    idContainerSize,
                    idTradeType,
                    idAngkut,
                });
                if (existingAll) {
                    throw {
                        statusCode: statusCodes_1.StatusBadRequest,
                        message: `Conflict: An 'ALL' rate already exists for this combination. Remove 'ALL' before adding specific items.`,
                    };
                }
            }
            const checkTarifBongkarMuat = yield this._bongkarRepository.findOne({
                idBarang: idBarang,
                idContainerSize: idContainerSize,
                idTradeType: idTradeType,
                idAngkut: idAngkut,
            });
            if (checkTarifBongkarMuat) {
                throw {
                    statusCode: statusCodes_1.StatusBadRequest,
                    message: `Tarif bongkar muat with the same parameters already exists`,
                };
            }
            const data = {
                barang: { connect: { id: idBarang } },
                containerSize: { connect: { id: idContainerSize } },
                tradeType: { connect: { id: idTradeType } },
                angkut: { connect: { id: idAngkut } },
                amount: amount,
                jasaWrapping: jasaWrapping !== null && jasaWrapping !== void 0 ? jasaWrapping : false,
            };
            return yield this._bongkarRepository.createTarifBongkar(data);
        });
        this.updateTarifBongkarMuat = (id, body) => __awaiter(this, void 0, void 0, function* () {
            const parsed = yield tarifBongkarUpdate_dto_1.default.fromUpdateBongkarMuat(body);
            const { amount, jasaWrapping } = parsed;
            const data = {
                amount: amount,
                jasaWrapping: jasaWrapping,
            };
            return yield this._bongkarRepository.updateTarifBongkar(id, data);
        });
        this.deleteTarifBongkarMuat = (id) => __awaiter(this, void 0, void 0, function* () {
            return this._bongkarRepository.deleteTarifBongkar(id);
        });
        this.batchSaveTarifBongkarMuat = (body) => __awaiter(this, void 0, void 0, function* () {
            const parsed = yield tarifBongkarBatch_dto_1.default.fromBatchTarifBongkar(body);
            const { items } = parsed;
            const results = [];
            for (const item of items) {
                const { id, idTradeType, idContainerSize, idAngkut, idBarang, amount, jasaWrapping, } = item;
                if (id) {
                    // Direct update by ID - most robust method for existing records
                    results.push(yield this._bongkarRepository.updateTarifBongkar(id, {
                        amount,
                    }));
                }
                else {
                    // Fallback for new records or ID-less payload: Delete duplicates and create fresh
                    yield this._bongkarRepository.deleteMany({
                        idBarang,
                        idContainerSize,
                        idTradeType,
                        idAngkut,
                        jasaWrapping,
                    });
                    results.push(yield this._bongkarRepository.createTarifBongkar({
                        barang: { connect: { id: idBarang } },
                        containerSize: { connect: { id: idContainerSize } },
                        tradeType: { connect: { id: idTradeType } },
                        angkut: { connect: { id: idAngkut } },
                        amount: amount,
                        jasaWrapping: jasaWrapping,
                    }));
                }
            }
            return results;
        });
        this._bongkarRepository = new tarifBongkarMuat_repository_1.default();
        this._barangRepository = new barang_repository_1.default();
    }
}
exports.default = TarifBongkarService;
