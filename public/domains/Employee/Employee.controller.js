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
const auth_1 = require("@middlewares/auth");
const Employee_service_1 = __importDefault(require("./Employee.service"));
class EmployeeController extends baseController_1.default {
    constructor() {
        super();
        this.employeeService = new Employee_service_1.default();
        this.getAll();
        this.getById();
        this.create();
        this.update();
    }
    getAll() {
        this.router.get("/employee", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER", "SPV"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const params = (0, QueryParsed_1.QueryParsed)(req);
            const { skip, take, page, limit } = (0, paginations_1.getPagination)({
                limit: params.limit,
                page: params.page,
            });
            const [error, result] = yield (0, catchError_1.catchError)(this.employeeService.findAll(Object.assign(Object.assign({}, req.query), { skip, take }), params));
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
            }, "Successfully fetched employees");
        }));
    }
    getById() {
        this.router.get("/employee/:id", auth_1.authenticateToken, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, result] = yield (0, catchError_1.catchError)(this.employeeService.findById(req.params.id));
            if (error)
                return this.handleError(res, error);
            this.handleSuccess(res, result, "Successfully fetched employees");
        }));
    }
    create() {
        this.router.post("/employee", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, result] = yield (0, catchError_1.catchError)(this.employeeService.handleCreateEmployee(req.body));
            if (error)
                return this.handleError(res, error);
            return this.handleSuccess(res, result, "Employee created successfully", statusCodes_1.StatusCreated);
        }));
    }
    update() {
        this.router.put("/employee/:id", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const [error, result] = yield (0, catchError_1.catchError)(this.employeeService.updateEmployee(userId, req.body));
            if (error)
                return this.handleError(res, error);
            return this.handleSuccess(res, result, "Employee updated successfully");
        }));
    }
}
exports.default = EmployeeController;
