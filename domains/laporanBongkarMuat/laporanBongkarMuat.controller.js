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
const catchError_1 = require("@common/handler/errors/catchError");
const paginations_1 = require("@common/pagination/paginations");
const QueryParsed_1 = require("@common/QueryParsed");
const statusCodes_1 = require("@common/consts/statusCodes");
const laporanBongkarMuat_service_1 = __importDefault(require("./laporanBongkarMuat.service"));
const auth_1 = require("@middlewares/auth");
class LaporanBongkarMuatController extends baseController_1.default {
    constructor() {
        super();
        this._laporanService = new laporanBongkarMuat_service_1.default();
        this.getAll();
        this.getById();
        this.create();
        this.update();
        this.delete();
    }
    getAll() {
        this.router.get("/laporan-bongkar-muat", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const params = (0, QueryParsed_1.QueryParsed)(req);
            const { skip, take, page, limit } = (0, paginations_1.getPagination)({
                page: params.page,
                limit: params.limit,
            });
            const [error, result] = yield (0, catchError_1.catchError)(this._laporanService.findAll(Object.assign(Object.assign({}, req.query), { skip, take })));
            if (error) {
                this.handleError(res, error);
                return;
            }
            return this.handleSuccess(res, {
                data: result.data,
                pagination: {
                    page,
                    limit,
                    total_items: result.total,
                    total_pages: Math.ceil(result.total / limit),
                },
            }, "Successfully fetched laporan bongkar muat");
        }));
    }
    getById() {
        this.router.get("/laporan-bongkar-muat/:id", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, result] = yield (0, catchError_1.catchError)(this._laporanService.findById(Number(req.params.id)));
            if (error)
                return this.handleError(res, error);
            return this.handleSuccess(res, result, "Successfully fetched laporan bongkar muat");
        }));
    }
    create() {
        this.router.post("/laporan-bongkar-muat", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, result] = yield (0, catchError_1.catchError)(this._laporanService.create(req.body));
            if (error)
                return this.handleError(res, error);
            return this.handleSuccess(res, result, "Laporan bongkar muat created successfully", statusCodes_1.StatusCreated);
        }));
    }
    update() {
        this.router.put("/laporan-bongkar-muat/:id", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, result] = yield (0, catchError_1.catchError)(this._laporanService.update(Number(req.params.id), req.body));
            if (error)
                return this.handleError(res, error);
            return this.handleSuccess(res, result, "Laporan bongkar muat updated successfully");
        }));
    }
    delete() {
        this.router.delete("/laporan-bongkar-muat/:id", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, result] = yield (0, catchError_1.catchError)(this._laporanService.delete(Number(req.params.id)));
            if (error)
                return this.handleError(res, error);
            return this.handleSuccess(res, result, "Laporan bongkar muat deleted successfully");
        }));
    }
}
exports.default = LaporanBongkarMuatController;
