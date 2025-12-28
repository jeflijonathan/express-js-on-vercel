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
const baseController_1 = __importDefault(require("@common/base/baseController"));
const statusCodes_1 = require("@common/consts/statusCodes");
const auth_1 = require("@middlewares/auth");
const User_service_1 = __importDefault(require("./User.service"));
class UserController extends baseController_1.default {
    constructor() {
        super();
        this.userService = new User_service_1.default();
        this.getAll();
        this.getById();
        this.createUserWithEmployeeId();
        this.createUserAndEmployee();
        this.update();
    }
    getAll() {
        this.router.get("/users", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const params = (0, QueryParsed_1.QueryParsed)(req);
            const [error, result] = yield (0, catchError_1.catchError)(this.userService.findAllUser(params));
            if (error)
                return this.handleError(res, error);
            return this.handleSuccess(res, {
                data: (result === null || result === void 0 ? void 0 : result.data) || [],
                pagination: (result === null || result === void 0 ? void 0 : result.pagination) || {},
            }, "Successfully fetched users");
        }));
    }
    getById() {
        this.router.get("/users/:id", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER", "SPV", "ADMIN"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, result] = yield (0, catchError_1.catchError)(this.userService.findUserById(req.params.id));
            if (error)
                return this.handleError(res, error);
            this.handleSuccess(res, result, "Successfully fetched user");
        }));
    }
    createUserWithEmployeeId() {
        this.router.post("/users/create/user-with-employee-id", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, result] = yield (0, catchError_1.catchError)(this.userService.handleCreateUserWithEmployeeId(req.body));
            if (error)
                return this.handleError(res, error);
            return this.handleSuccess(res, result, "User created successfully", statusCodes_1.StatusCreated);
        }));
    }
    createUserAndEmployee() {
        this.router.post("/users/create/user-employee", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, result] = yield (0, catchError_1.catchError)(this.userService.handleCreateUserAndEmployee(req.body));
            if (error)
                return this.handleError(res, error);
            return this.handleSuccess(res, result, "User created successfully", statusCodes_1.StatusCreated);
        }));
    }
    update() {
        this.router.put("/users/:id", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const [error, result] = yield (0, catchError_1.catchError)(this.userService.updateUser(userId, req.body));
            if (error)
                return this.handleError(res, error);
            return this.handleSuccess(res, result, "User updated successfully");
        }));
    }
}
exports.default = UserController;
