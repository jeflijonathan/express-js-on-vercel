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
const encrypt_1 = require("@common/utils/encrypt");
const jwtService_1 = __importDefault(require("src/services/jwtService"));
const statusFilter_1 = __importDefault(require("@common/filter/statusFilter/statusFilter"));
const userCreate_dto_1 = __importDefault(require("./dto/userCreate.dto"));
const userUpdate_dto_1 = __importDefault(require("./dto/userUpdate.dto"));
const repository_1 = require("src/repository");
const statusCodes_1 = require("@common/consts/statusCodes");
const User_model_1 = require("./User.model");
class UserService {
    constructor() {
        this.jwtService = new jwtService_1.default();
        this._userRepository = new repository_1.UserRepository();
        this._employeeRepository = new repository_1.EmployeeRepository();
        this._roleRepository = new repository_1.RoleRepository();
    }
    findAllUser() {
        return __awaiter(this, arguments, void 0, function* (params = {}) {
            try {
                const { page = 1, limit = 10, value, status = true } = params;
                const searchFilter = (0, sigleSearch_1.buildSingleSearch)("namaLengkap", value);
                const statusFilter = (0, statusFilter_1.default)("status", status);
                const where = {
                    employee: Object.assign(Object.assign({}, searchFilter), statusFilter),
                };
                let sorter;
                if (params.sort && params.order_by) {
                    const orderLower = params.order_by.toLowerCase();
                    if (orderLower === "asc" || orderLower === "desc") {
                        const order = orderLower;
                        sorter = {
                            employee: {
                                [params.sort]: order,
                            },
                        };
                    }
                }
                const data = yield this._userRepository.findAll(where, {
                    page,
                    limit,
                }, {
                    select: {
                        id: true,
                        username: true,
                        employee: {
                            select: {
                                id: true,
                                namaLengkap: true,
                                email: true,
                                role: true,
                                createdAt: true,
                                updatedAt: true,
                                status: true,
                            },
                        },
                    },
                }, sorter);
                const total = yield this._userRepository.count({ query: where });
                const pagination = {
                    page,
                    limit,
                    total_items: total,
                    total_pages: Math.ceil(total / limit),
                };
                return { data, pagination };
            }
            catch (error) {
                console.log("@UserService:findAllUsers:error", error);
                throw error;
            }
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._userRepository.findById(id, Object.assign({}, User_model_1.selectDataUser));
                return result;
            }
            catch (error) {
                console.log("@UserService:findUserById:error", error);
                throw error;
            }
        });
    }
    handleCreateUserWithEmployeeId(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parsed = yield userCreate_dto_1.default.fromCreateUserWithEmployeeId(data);
                const { employeeId, roleId, password, username } = parsed;
                const employeeCheck = yield this._employeeRepository.findOne({
                    id: employeeId,
                });
                if (!employeeCheck) {
                    throw {
                        statusCode: statusCodes_1.StatusBadRequest,
                        message: `Employee with id ${employeeId} not found`,
                    };
                }
                const userCheck = yield this._userRepository.findOne({
                    employee: { id: employeeId },
                });
                if (userCheck) {
                    throw {
                        statusCode: statusCodes_1.StatusBadRequest,
                        message: `User with employeeId '${employeeId}' already created`,
                    };
                }
                yield this._employeeRepository.updateEmployee(employeeId, {
                    role: { connect: { id: roleId } },
                });
                return yield this._userRepository.createUser({
                    username,
                    employee: {
                        connect: { id: employeeId },
                    },
                    password: yield (0, encrypt_1.encrypt)(password),
                });
            }
            catch (error) {
                console.log("@UserService:handleCreateUserWithEmployeeId:error", error);
                throw error;
            }
        });
    }
    handleCreateUserAndEmployee(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(data);
                const parsed = yield userCreate_dto_1.default.fromCreateUserWithEmployee(data);
                const { email, roleId, password, namaLengkap, username } = parsed;
                const isEmailDuplicate = yield this._employeeRepository.findOne({
                    email,
                });
                if (isEmailDuplicate) {
                    throw {
                        statusCode: statusCodes_1.StatusBadRequest,
                        message: `Email '${email}' already exists`,
                    };
                }
                const employee = yield this._employeeRepository.createEmployee({
                    namaLengkap,
                    email,
                    role: { connect: { id: roleId } },
                    status: true,
                });
                if (!employee) {
                    throw {
                        statusCode: statusCodes_1.StatusBadRequest,
                        message: "error create employeeid",
                    };
                }
                return yield this._userRepository.createUser({
                    username,
                    employee: { connect: { id: employee.id } },
                    password: yield (0, encrypt_1.encrypt)(password),
                });
            }
            catch (error) {
                console.log("@UserService:handleCreateUserAndEmployee:error", error);
                throw error;
            }
        });
    }
    updateUser(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsed = yield userUpdate_dto_1.default.fromUpdateUser(body);
            const { password, confirmationPassword, username, email, roleId, status, namaLengkap, } = parsed;
            var hashedPassword = undefined;
            if (password || confirmationPassword) {
                hashedPassword = yield (0, encrypt_1.encrypt)(password);
            }
            const roleResult = yield this._roleRepository.findOne({ id: roleId });
            const role = ["ADMIN", "MANAJER", "SPV"];
            if (!role.includes(roleResult === null || roleResult === void 0 ? void 0 : roleResult.name)) {
                throw {
                    statusCode: statusCodes_1.StatusBadRequest,
                    message: "You are not allowed to change this role",
                };
            }
            const user = yield this._userRepository.updateUser(id, {
                username: username,
                password: hashedPassword,
                employee: {
                    update: {
                        namaLengkap: namaLengkap,
                        email: email,
                        roleId: roleId,
                        status: status,
                    },
                },
            });
            return user;
        });
    }
}
exports.default = UserService;
