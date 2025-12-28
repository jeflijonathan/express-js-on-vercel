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
const sigleSearch_1 = require("@common/filter/sigleSearch/sigleSearch");
const bongkarMuat_repository_1 = __importDefault(require("src/repository/bongkarMuat/bongkarMuat.repository"));
const bongkarMuatUpdate_dto_1 = __importDefault(require("./dto/bongkarMuatUpdate.dto"));
const importBongkarMuatCreate_dto_1 = __importDefault(require("./dto/importBongkarMuatCreate.dto"));
const barang_repository_1 = __importDefault(require("src/repository/barang/barang.repository"));
const exportBongkarMuatCreate_dto_1 = __importDefault(require("./dto/exportBongkarMuatCreate.dto"));
const repository_1 = require("src/repository");
const client_1 = require("@config/database/client");
class BongkarMuatService {
    constructor() {
        this.findSesiBongkarMuat = (req_1, ...args_1) => __awaiter(this, [req_1, ...args_1], void 0, function* (req, params = {}) {
            const { value, status, page = 1, limit = 10 } = params;
            const searchFilter = (0, sigleSearch_1.buildSingleSearch)("noContainer", value);
            const where = Object.assign({}, searchFilter);
            let sorter;
            if (params.status) {
                where["statusBongkar"] = {
                    name: params.status,
                };
            }
            if (params.startDate && params.endDate) {
                where["createdAt"] = {
                    gte: new Date(params.startDate),
                    lte: new Date(params.endDate),
                };
            }
            if (params.sort && params.order_by) {
                const order = params.order_by.toLowerCase();
                if (order === "asc" || order === "desc") {
                    sorter = {
                        [params.sort]: order,
                    };
                }
            }
            const [data, total] = yield Promise.all([
                this._bongkarRepository.findAll(where, { page: page, limit: limit }, {
                    include: {
                        koorlap: {
                            select: {
                                id: true,
                                namaLengkap: true,
                            },
                        },
                        groupTeam: {
                            select: {
                                id: true,
                                team: {
                                    select: {
                                        employee: {
                                            select: {
                                                id: true,
                                                namaLengkap: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        barang: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        statusBongkar: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        containerSize: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        tradeType: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        angkut: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                }, sorter),
                this._bongkarRepository.count({ query: where }),
            ]);
            return { data, total };
        });
        this.findSesiBongkarMuatById = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._bongkarRepository.findById(id, {
                    include: {
                        koorlap: {
                            select: {
                                id: true,
                                namaLengkap: true,
                            },
                        },
                        groupTeam: {
                            select: {
                                id: true,
                                team: {
                                    select: {
                                        employee: {
                                            select: {
                                                id: true,
                                                namaLengkap: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        barang: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        statusBongkar: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        containerSize: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        tradeType: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        angkut: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                });
                return result;
            }
            catch (error) {
                console.log("@BongkarMuatService:findSesiBongkarMuatById:error", error);
                throw error;
            }
        });
        this.handleCreateImportSesiBongkarMuat = (body) => __awaiter(this, void 0, void 0, function* () {
            try {
                const parsed = yield importBongkarMuatCreate_dto_1.default.fromCreateImportBongkarMuat(body);
                const { ownerCode, seriContainer, idKoorlap, idGroupTeam, idBarang, idContainerSize, idAngkut, jasaWrapping, } = parsed;
                const noContainer = `${ownerCode}-${seriContainer}`;
                const checkNoContainer = yield this._bongkarRepository.findOne({
                    noContainer: noContainer,
                });
                if (checkNoContainer) {
                    throw {
                        statusCode: statusCodes_1.StatusBadRequest,
                        message: `bongkar muat with noContainer '${noContainer}' already registerd`,
                    };
                }
                const checkbarangAll = yield this._barangRepository.findOne({
                    id: idBarang,
                });
                if (!checkbarangAll) {
                    throw { statusCode: 400, message: "Barang ALL not found" };
                }
                const koorlap = yield this._employeeRepository.findOne({ id: idKoorlap });
                if (!koorlap) {
                    throw { statusCode: 400, message: "Koorlap not found" };
                }
                const groupTeam = yield this._groupTeamRepository.findOne({
                    id: idGroupTeam,
                });
                if (!groupTeam) {
                    throw { statusCode: 400, message: "Group team not found" };
                }
                const containerSize = yield this._containerSizeRepository.findOne({
                    id: idContainerSize,
                });
                if (!containerSize) {
                    throw { statusCode: 400, message: "Container size not found" };
                }
                const angkut = yield this._angkutRepository.findById(idAngkut);
                if (!angkut) {
                    throw { statusCode: 400, message: "Transport method not found" };
                }
                const data = {
                    noContainer: noContainer.toUpperCase(),
                    koorlap: {
                        connect: {
                            id: idKoorlap,
                        },
                    },
                    groupTeam: {
                        connect: {
                            id: idGroupTeam,
                        },
                    },
                    barang: {
                        connect: {
                            id: idBarang,
                        },
                    },
                    containerSize: {
                        connect: {
                            id: idContainerSize,
                        },
                    },
                    tradeType: {
                        connect: {
                            id: 2,
                        },
                    },
                    angkut: {
                        connect: {
                            id: idAngkut,
                        },
                    },
                    jasaWrapping: jasaWrapping,
                };
                if (!data) {
                    throw {
                        status: "Error",
                        message: "Bad Request",
                        statusCode: statusCodes_1.StatusBadRequest,
                    };
                }
                return yield this._bongkarRepository.createSesiBongkar(data);
            }
            catch (error) {
                console.log("@BongkarMuatService:handleCreateImportSesiBongkarMuat :error", error);
                throw error;
            }
        });
        this.handleCreateExportSesiBongkarMuat = (body) => __awaiter(this, void 0, void 0, function* () {
            try {
                const parsed = yield exportBongkarMuatCreate_dto_1.default.fromCreateExportBongkarMuat(body);
                const { ownerCode, seriContainer, idKoorlap, idGroupTeam, idContainerSize, idAngkut, jasaWrapping, } = parsed;
                const noContainer = `${ownerCode}-${seriContainer}`;
                const checkNoContainer = yield this._bongkarRepository.findOne({
                    noContainer,
                });
                if (checkNoContainer) {
                    throw {
                        statusCode: statusCodes_1.StatusBadRequest,
                        message: `bongkar muat with noContainer '${noContainer}' already registered`,
                    };
                }
                const barangAll = yield this._barangRepository.findOne({
                    name: "ALL",
                });
                if (!barangAll) {
                    throw { statusCode: 400, message: "Barang ALL not found" };
                }
                const koorlap = yield this._employeeRepository.findOne({ id: idKoorlap });
                if (!koorlap) {
                    throw { statusCode: 400, message: "Koorlap not found" };
                }
                const groupTeam = yield this._groupTeamRepository.findOne({
                    id: idGroupTeam,
                });
                if (!groupTeam) {
                    throw { statusCode: 400, message: "Group team not found" };
                }
                const containerSize = yield this._containerSizeRepository.findOne({
                    id: idContainerSize,
                });
                if (!containerSize) {
                    throw { statusCode: 400, message: "Container size not found" };
                }
                const angkut = yield this._angkutRepository.findOne({ id: idAngkut });
                if (!angkut)
                    throw { statusCode: 400, message: "Transport method not found" };
                const data = {
                    noContainer: noContainer.toUpperCase(),
                    koorlap: { connect: { id: idKoorlap } },
                    groupTeam: { connect: { id: idGroupTeam } },
                    barang: { connect: { id: barangAll.id } },
                    containerSize: { connect: { id: idContainerSize } },
                    tradeType: { connect: { id: 1 } },
                    angkut: { connect: { id: idAngkut } },
                    jasaWrapping: false,
                };
                if (!data) {
                    throw {
                        status: "Error",
                        message: "Bad Request",
                        statusCode: statusCodes_1.StatusBadRequest,
                    };
                }
                return yield this._bongkarRepository.createSesiBongkar(data);
            }
            catch (err) {
                console.log("@BongkarMuatService:createExportSesiBongkarMuat:error", err);
                throw err;
            }
        });
        this.updateSesiBongkarMuat = (id, body, isOpen) => __awaiter(this, void 0, void 0, function* () {
            try {
                const parsed = yield bongkarMuatUpdate_dto_1.default.fromUpdateBongkarMuat(body);
                const { ownerCode, seriContainer, idKoorlap, idGroupTeam, jasaWrapping, idStatusBongkar, idBarang, idContainerSize, idAngkut, } = parsed;
                const existing = yield this._bongkarRepository.findById(id, {
                    include: {
                        statusBongkar: true,
                        tradeType: true,
                    },
                });
                if (!existing) {
                    throw { statusCode: 404, message: "Bongkar muat not found" };
                }
                const newNoContainer = `${ownerCode}-${seriContainer}`;
                const oldNoContainer = existing.noContainer;
                if (newNoContainer !== oldNoContainer) {
                    const duplicate = yield this._bongkarRepository.findOne({
                        noContainer: newNoContainer,
                        NOT: { noContainer: id },
                    });
                    if (duplicate) {
                        throw {
                            statusCode: 400,
                            message: `bongkar muat with noContainer '${newNoContainer}' already registered`,
                        };
                    }
                }
                if (isOpen && existing.statusBongkar.name.toUpperCase() === "DONE") {
                    throw {
                        status: "Error",
                        statusCode: 400,
                        message: "Data sudah Done dan tidak dapat diedit",
                    };
                }
                const koorlap = yield this._employeeRepository.findOne({ id: idKoorlap });
                if (!koorlap) {
                    throw { statusCode: 400, message: "Koorlap not found" };
                }
                const groupTeam = yield this._groupTeamRepository.findOne({
                    id: idGroupTeam,
                });
                if (!groupTeam) {
                    throw { statusCode: 400, message: "Group team not found" };
                }
                const statusBongkar = yield client_1.prisma.statusBongkar.findFirst({
                    where: {
                        id: idStatusBongkar,
                    },
                });
                if (!statusBongkar) {
                    throw { statusCode: 400, message: "Status bongkar not found" };
                }
                const isExport = existing.tradeType.id === 1;
                const data = {
                    noContainer: newNoContainer,
                    koorlap: { connect: { id: idKoorlap } },
                    groupTeam: { connect: { id: idGroupTeam } },
                    jasaWrapping: isExport ? false : jasaWrapping,
                    endAT: statusBongkar.name.toUpperCase() === "DONE" ? new Date() : null,
                    statusBongkar: { connect: { id: idStatusBongkar } },
                    barang: idBarang ? { connect: { id: idBarang } } : undefined,
                    containerSize: idContainerSize ? { connect: { id: idContainerSize } } : undefined,
                    angkut: idAngkut ? { connect: { id: idAngkut } } : undefined,
                };
                return yield this._bongkarRepository.updateSesiBongkar(id, data);
            }
            catch (error) {
                console.log("@BongkarMuatService:updateSesiBongkarMuat:error", error);
                throw error;
            }
        });
        this.deleteSesiBongkarMuat = (id) => __awaiter(this, void 0, void 0, function* () {
            return this._bongkarRepository.deleteSesiBongkar(id);
        });
        this._bongkarRepository = new bongkarMuat_repository_1.default();
        this._barangRepository = new barang_repository_1.default();
        this._groupTeamRepository = new repository_1.GroupTeamRepository();
        this._containerSizeRepository = new repository_1.ContainerSizeRepository();
        this._angkutRepository = new repository_1.TransportMethodRepository();
        this._employeeRepository = new repository_1.EmployeeRepository();
    }
}
exports.default = BongkarMuatService;
