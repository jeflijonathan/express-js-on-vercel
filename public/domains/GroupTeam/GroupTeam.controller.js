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
const paginations_1 = require("@common/pagination/paginations");
const baseController_1 = __importDefault(require("@common/base/baseController"));
const statusCodes_1 = require("@common/consts/statusCodes");
const GroupTeam_service_1 = __importDefault(require("./GroupTeam.service"));
const auth_1 = require("@middlewares/auth");
class GroupTimController extends baseController_1.default {
    constructor() {
        super();
        this.groupTimService = new GroupTeam_service_1.default();
        this.getAll();
        this.getById();
        this.create();
        this.update();
        this.delete();
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            this.router.get("/group-team", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
                const params = (0, QueryParsed_1.QueryParsed)(req);
                const { skip, take, page, limit } = (0, paginations_1.getPagination)({
                    page: params.page,
                    limit: params.limit,
                });
                const [error, result] = yield (0, catchError_1.catchError)(this.groupTimService.findAll(Object.assign(Object.assign({}, req.query), { skip, take }), params));
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
                }, "Successfully fetched team");
            }));
        });
    }
    getById() {
        return __awaiter(this, void 0, void 0, function* () {
            this.router.get("/group-team/:id", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const [error, result] = yield (0, catchError_1.catchError)(this.groupTimService.findById(id));
                if (error)
                    return this.handleError(res, error);
                return this.handleSuccess(res, result, "Successfully fetched group team status");
            }));
        });
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            this.router.post("/group-team", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
                const [error, result] = yield (0, catchError_1.catchError)(this.groupTimService.handleCreateTimGroup(req.body));
                if (error)
                    return this.handleError(res, error);
                return this.handleSuccess(res, result, "Team created successfully", statusCodes_1.StatusCreated);
            }));
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            this.router.put("/group-team/:id", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
                const [error, result] = yield (0, catchError_1.catchError)(this.groupTimService.handleUpdateGroupTim(req.params.id, req.body));
                if (error)
                    return this.handleError(res, error);
                return this.handleSuccess(res, result, "Team updated successfully");
            }));
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            this.router.delete("/group-team/:id", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
                const [error, result] = yield (0, catchError_1.catchError)(this.groupTimService.handleDeleteGroupTim(req.params.id));
                if (error)
                    return this.handleError(res, error);
                return this.handleSuccess(res, result, "Team delete successfully");
            }));
        });
    }
}
exports.default = GroupTimController;
