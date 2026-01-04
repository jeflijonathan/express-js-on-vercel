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
const dashboard_service_1 = __importDefault(require("./dashboard.service"));
const catchError_1 = require("@common/handler/errors/catchError");
const auth_1 = require("@middlewares/auth");
class DashboardController extends baseController_1.default {
    constructor() {
        super();
        this.service = new dashboard_service_1.default();
        this.getStats();
    }
    getStats() {
        this.router.get("/dashboard/stats", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER", "SPV"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { year, tradeType } = req.query;
            const [error, result] = yield (0, catchError_1.catchError)(this.service.getStats(year ? Number(year) : undefined, tradeType ? String(tradeType) : undefined));
            if (error)
                return this.handleError(res, error);
            return this.handleSuccess(res, result, "Success get dashboard stats");
        }));
    }
}
exports.default = DashboardController;
