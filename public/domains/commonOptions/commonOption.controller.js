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
const catchError_1 = require("@common/handler/errors/catchError");
const QueryParsed_1 = require("@common/QueryParsed");
const commonOption_service_1 = __importDefault(require("./commonOption.service"));
const baseController_1 = __importDefault(require("@common/base/baseController"));
const auth_1 = require("@middlewares/auth");
class CommonOptionsController extends baseController_1.default {
    constructor() {
        super();
        this.CommonOptionService = new commonOption_service_1.default();
        this.getRoleOptions();
        this.getTransportMethodOptions();
        this.getCategoryItemOptions();
        this.getEmployeeOptions();
        this.getGroupTimOptions();
        this.getTradeTypeOptions();
        this.getContainerSizeOptions();
    }
    getRoleOptions() {
        this.router.get(`/role`, auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER", "SPV"), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const params = (0, QueryParsed_1.QueryParsed)(req);
            const [error, result] = yield (0, catchError_1.catchError)(this.CommonOptionService.findRole(params));
            if (error) {
                this.handleError(res, error);
                next(error);
            }
            return this.handleSuccess(res, result, "Successfully fetched Role", 200);
        }));
    }
    getTransportMethodOptions() {
        this.router.get(`/transport-method`, auth_1.authenticateToken, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const params = (0, QueryParsed_1.QueryParsed)(req);
            const [error, result] = yield (0, catchError_1.catchError)(this.CommonOptionService.findTransportMethod(params));
            if (error) {
                this.handleError(res, error);
                next(error);
            }
            return this.handleSuccess(res, result, "Successfully fetched Transport Method");
        }));
    }
    getCategoryItemOptions() {
        this.router.get(`/category-item`, auth_1.authenticateToken, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const params = (0, QueryParsed_1.QueryParsed)(req);
            const [error, result] = yield (0, catchError_1.catchError)(this.CommonOptionService.findCategoryItem(params));
            if (error) {
                this.handleError(res, error);
                next(error);
            }
            return this.handleSuccess(res, result, "Successfully fetched Category Item");
        }));
    }
    getEmployeeOptions() {
        this.router.get(`/employee`, auth_1.authenticateToken, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const params = (0, QueryParsed_1.QueryParsed)(req);
            const [error, result] = yield (0, catchError_1.catchError)(this.CommonOptionService.findEmployee(params));
            if (error) {
                return this.handleError(res, error);
            }
            return this.handleSuccess(res, result, "Successfully fetched employee");
        }));
    }
    getGroupTimOptions() {
        this.router.get(`/group-tim`, auth_1.authenticateToken, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const params = (0, QueryParsed_1.QueryParsed)(req);
            const [error, result] = yield (0, catchError_1.catchError)(this.CommonOptionService.findGroupTim(params));
            if (error) {
                next(error);
            }
            return this.handleSuccess(res, result, "Successfully fetched group tim");
        }));
    }
    getTradeTypeOptions() {
        this.router.get(`/trade-type`, auth_1.authenticateToken, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const params = (0, QueryParsed_1.QueryParsed)(req);
            const [error, result] = yield (0, catchError_1.catchError)(this.CommonOptionService.findTradeType(params));
            if (error) {
                return next(error);
            }
            return this.handleSuccess(res, result, "Successfully fetched Trade Type");
        }));
    }
    getContainerSizeOptions() {
        this.router.get(`/container-size`, auth_1.authenticateToken, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const params = (0, QueryParsed_1.QueryParsed)(req);
            const [error, result] = yield (0, catchError_1.catchError)(this.CommonOptionService.findContainerSize(params));
            if (error) {
                next(error);
            }
            return this.handleSuccess(res, result, "Successfully fetched Pegawai");
        }));
    }
}
exports.default = CommonOptionsController;
