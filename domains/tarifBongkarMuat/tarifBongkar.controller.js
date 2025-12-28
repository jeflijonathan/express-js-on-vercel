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
const QueryParsed_1 = require("@common/QueryParsed");
const catchError_1 = require("@common/handler/errors/catchError");
const paginations_1 = require("@common/pagination/paginations");
const statusCodes_1 = require("@common/consts/statusCodes");
const tarifMuat_service_1 = __importDefault(require("./tarifMuat.service"));
const auth_1 = require("@middlewares/auth");
class TarifBongkarController extends baseController_1.default {
    constructor() {
        super();
        this.bongkarMuatService = new tarifMuat_service_1.default();
        this.getAll();
        this.getById();
        this.create();
        this.update();
        this.delete();
        this.batchSave();
    }
    batchSave() {
        this.router.post("/tarif-bongkar/batch", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, result] = yield (0, catchError_1.catchError)(this.bongkarMuatService.batchSaveTarifBongkarMuat(req.body));
            if (error)
                return this.handleError(res, error);
            return this.handleSuccess(res, result, "Tarif bongkar batch saved successfully", statusCodes_1.StatusCreated);
        }));
    }
    getAll() {
        this.router.get("/tarif-bongkar", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const queryParams = (0, QueryParsed_1.QueryParsed)(req);
            const { skip, take, page, limit } = (0, paginations_1.getPagination)({
                limit: queryParams.limit,
                page: queryParams.page,
            });
            const [error, result] = yield (0, catchError_1.catchError)(this.bongkarMuatService.findTarifBongkarMuat(req, Object.assign(Object.assign({}, req.query), { skip, take }), queryParams));
            if (error)
                return this.handleError(res, error);
            return this.handleSuccess(res, {
                data: result.data,
                pagination: {
                    page,
                    limit,
                    total_items: result.total,
                    total_pages: Math.ceil(result.total / limit),
                },
            }, "Tarif Bongkar Muat fetched successfully");
        }));
    }
    getById() {
        this.router.get("/tarif-bongkar/:id", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, result] = yield (0, catchError_1.catchError)(this.bongkarMuatService.findTarifBongkarMuatById(Number(req.params.id)));
            if (error)
                return this.handleError(res, error);
            this.handleSuccess(res, result, "Successfully fetched tarif bongkar muat");
        }));
    }
    create() {
        this.router.post("/tarif-bongkar", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, result] = yield (0, catchError_1.catchError)(this.bongkarMuatService.createTarifBongkarMuat(req.body));
            if (error)
                return this.handleError(res, error);
            this.handleSuccess(res, result, "Successfully created tarif bongkar muat", statusCodes_1.StatusCreated);
        }));
    }
    update() {
        this.router.put("/tarif-bongkar/:id", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, result] = yield (0, catchError_1.catchError)(this.bongkarMuatService.updateTarifBongkarMuat(Number(req.params.id), req.body));
            if (error)
                return this.handleError(res, error);
            this.handleSuccess(res, result, "Successfully updated tarif bongkar muat");
        }));
    }
    delete() {
        this.router.delete("/tarif-bongkar/:id", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, result] = yield (0, catchError_1.catchError)(this.bongkarMuatService.deleteTarifBongkarMuat(Number(req.params.id)));
            if (error)
                return this.handleError(res, error);
            this.handleSuccess(res, result, "Successfully deleted tarif bongkar muat");
        }));
    }
}
exports.default = TarifBongkarController;
