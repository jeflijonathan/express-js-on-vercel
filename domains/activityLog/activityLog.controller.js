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
const activityLog_service_1 = require("./activityLog.service");
const auth_1 = require("@middlewares/auth");
const QueryParsed_1 = require("@common/QueryParsed");
class ActivityLogController extends baseController_1.default {
    constructor() {
        super();
        this.getAll();
    }
    getAll() {
        this.router.get("/activity-logs", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const params = (0, QueryParsed_1.QueryParsed)(req);
                const result = yield activityLog_service_1.ActivityLogService.findAll(params);
                this.handleSuccess(res, {
                    data: result.data,
                    pagination: {
                        page: result.meta.page,
                        limit: result.meta.limit,
                        total_items: result.meta.total,
                        total_pages: result.meta.totalPages,
                    },
                }, "Activity logs fetched successfully");
            }
            catch (err) {
                this.handleError(res, err);
            }
        }));
    }
}
exports.default = ActivityLogController;
