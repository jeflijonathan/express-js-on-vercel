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
const sigleSearch_1 = require("@common/filter/sigleSearch/sigleSearch");
const statusFilter_1 = __importDefault(require("@common/filter/statusFilter/statusFilter"));
const client_1 = require("src/config/database/client");
const http_errors_1 = __importDefault(require("http-errors"));
const employeeCreate_dto_1 = __importDefault(require("./dto/employeeCreate.dto"));
const statusCodes_1 = require("@common/consts/statusCodes");
const employeeUpdate_dto_1 = __importDefault(require("./dto/employeeUpdate.dto"));
const repository_1 = require("src/repository");
class EmployeeService {
    constructor() {
        this._employeeRepository = new repository_1.EmployeeRepository();
    }
    findAll(req_1) {
        return __awaiter(this, arguments, void 0, function* (req, params = {}) {
            const { value, status, page = 1, limit = 10 } = params;
            const searchFilter = (0, sigleSearch_1.buildSingleSearch)("namaLengkap", value);
            const statusFilter = (0, statusFilter_1.default)("status", status);
            const where = Object.assign(Object.assign({ role: {
                    name: {
                        in: ["TIM", "KOORLAP"],
                    },
                } }, searchFilter), statusFilter);
            let sorter;
            if (params.sort && params.order_by) {
                const order = params.order_by.toLowerCase();
                if (order === "asc" || order === "desc") {
                    sorter = {
                        [params.sort]: order,
                    };
                }
            }
            const [data, total] = yield Promise.all([
                this._employeeRepository.findAll(where, {
                    page,
                    limit,
                }, {
                    select: {
                        id: true,
                        email: true,
                        namaLengkap: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true,
                        status: true,
                    },
                }, sorter),
                this._employeeRepository.count({ query: where }),
            ]);
            return { data, total };
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield client_1.prisma.employee.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    namaLengkap: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    status: true,
                },
            });
            if (!employee)
                throw (0, http_errors_1.default)(404, "Employee not found");
            return employee;
        });
    }
    handleCreateEmployee(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsed = yield employeeCreate_dto_1.default.fromCreateEmployee(data);
            const { namaLengkap, email, roleId } = parsed;
            const isEmailExist = yield client_1.prisma.employee.findUnique({
                where: { email },
            });
            if (isEmailExist) {
                throw {
                    statusCode: statusCodes_1.StatusConflict,
                    message: `Email '${email}' already exists`,
                };
            }
            const role = yield client_1.prisma.role.findFirst({
                where: { id: roleId },
            });
            const roleNotAllowed = ["ADMIN", "MANAJER", "SPV"];
            if (roleNotAllowed.find((item) => item == (role === null || role === void 0 ? void 0 : role.name))) {
                throw {
                    statusCode: statusCodes_1.StatusBadRequest,
                    message: "You can't register this role here!",
                };
            }
            return yield client_1.prisma.employee.create({
                data: {
                    namaLengkap,
                    email,
                    roleId,
                    status: true,
                },
                include: { role: true },
            });
        });
    }
    updateEmployee(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsed = yield employeeUpdate_dto_1.default.fromUpdateEmployee(data);
            const { namaLengkap, email, roleId, status } = parsed;
            const updatedEmployee = yield client_1.prisma.employee.update({
                where: { id },
                data: {
                    namaLengkap,
                    email,
                    roleId,
                    status,
                },
                include: { role: true },
            });
            return updatedEmployee;
        });
    }
}
exports.default = EmployeeService;
