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
const baseController_1 = __importDefault(require("@common/base/baseController"));
const bongkarMuat_service_1 = __importDefault(require("./bongkarMuat.service"));
const auth_1 = require("@middlewares/auth");
const QueryParsed_1 = require("@common/QueryParsed");
const activityLogger_1 = require("@common/services/activityLogger");
class BongkarMuatController extends baseController_1.default {
    constructor() {
        super();
        this.bongkarMuatService = new bongkarMuat_service_1.default();
        this.getAll();
        this.createImportSesiBongkarMuat();
        this.createExportSesiBongkarMuat();
        this.getById();
        this.update();
        this.delete();
    }
    getAll() {
        this.router.get("/bongkar-muat", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("ADMIN", "MANAJER", "SPV"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const params = (0, QueryParsed_1.QueryParsed)(req);
                const { page = 1, limit = 10 } = params;
                const { data, total } = yield this.bongkarMuatService.findSesiBongkarMuat(req, params);
                this.handleSuccess(res, {
                    data: data,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total_items: total,
                        total_pages: Math.ceil(total / Number(limit)),
                    },
                }, "Bongkar Muat fetched successfully");
            }
            catch (err) {
                this.handleError(res, err);
            }
        }));
    }
    getById() {
        this.router.get("/bongkar-muat/:id", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("ADMIN", "MANAJER", "SPV"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.bongkarMuatService.findSesiBongkarMuatById(req.params.id);
                this.handleSuccess(res, result, "Successfully fetched bongkar muat");
            }
            catch (err) {
                this.handleError(res, err);
            }
        }));
    }
    createImportSesiBongkarMuat() {
        this.router.post("/bongkar-muat/import", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("ADMIN", "MANAJER", "SPV"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.bongkarMuatService.handleCreateImportSesiBongkarMuat(req.body);
                yield (0, activityLogger_1.logActivity)(req, "CREATE_SESI_BONGKAR_IMPORT", `Container: ${result.noContainer}`);
                this.handleSuccess(res, result, "Successfully created sesi bongkar muat");
            }
            catch (err) {
                this.handleError(res, err);
            }
        }));
    }
    createExportSesiBongkarMuat() {
        this.router.post("/bongkar-muat/export", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("ADMIN", "MANAJER", "SPV"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.bongkarMuatService.handleCreateExportSesiBongkarMuat(req.body);
                yield (0, activityLogger_1.logActivity)(req, "CREATE_SESI_BONGKAR_EXPORT", `Container: ${result.noContainer}`);
                this.handleSuccess(res, result, "Successfully created sesi bongkar muat");
            }
            catch (err) {
                this.handleError(res, err);
            }
        }));
    }
    update() {
        this.router.put("/bongkar-muat/:id", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER", "SPV"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userRole = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.roleName) === null || _b === void 0 ? void 0 : _b.toUpperCase();
                const result = yield this.bongkarMuatService.updateSesiBongkarMuat(req.params.id, req.body, userRole);
                yield (0, activityLogger_1.logActivity)(req, "UPDATE_SESI_BONGKAR", `Container: ${result.noContainer} (Role: ${userRole})`);
                this.handleSuccess(res, result, "Successfully updated bongkar muat");
            }
            catch (err) {
                this.handleError(res, err);
            }
        }));
    }
    delete() {
        this.router.delete("/bongkar-muat/:noContainer", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.bongkarMuatService.deleteSesiBongkarMuat(req.params.noContainer);
                yield (0, activityLogger_1.logActivity)(req, "DELETE_SESI_BONGKAR", `Container: ${req.params.noContainer}`);
                this.handleSuccess(res, result, "Successfully deleted bongkar muat");
            }
            catch (err) {
                this.handleError(res, err);
            }
        }));
    }
}
exports.default = BongkarMuatController;
