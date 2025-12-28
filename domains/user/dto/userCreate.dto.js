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
const baseDTO_1 = __importDefault(require("@common/base/baseDTO"));
const zod_1 = __importDefault(require("zod"));
class CreateUserDTO extends baseDTO_1.default {
    static fromCreateUserWithEmployeeId(payload) {
        const _super = Object.create(null, {
            from: { get: () => super.from }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.from.call(this, payload, this.schemaCreateUserWithEmployeeById, CreateUserDTO);
        });
    }
    static fromCreateUserWithEmployee(payload) {
        const _super = Object.create(null, {
            from: { get: () => super.from }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.from.call(this, payload, this.schemaCreateUserWithEmployee, CreateUserDTO);
        });
    }
}
CreateUserDTO.schemaCreateUserWithEmployeeById = zod_1.default
    .object({
    username: zod_1.default.string({ required_error: "Username is required" }).min(3),
    employeeId: zod_1.default.string({ required_error: "Employee is required" }).min(1),
    roleId: zod_1.default.number({ required_error: "Employee is required" }).min(1),
    password: zod_1.default.string({ required_error: "Password is required" }).min(6),
    confirmationPassword: zod_1.default
        .string({ required_error: "Confirmation is required" })
        .min(6),
})
    .refine((data) => data.password === data.confirmationPassword, {
    message: "Passwords do not match",
    path: ["confirmationPassword"],
});
CreateUserDTO.schemaCreateUserWithEmployee = zod_1.default
    .object({
    username: zod_1.default.string({ required_error: "Username is required" }).min(3),
    namaLengkap: zod_1.default
        .string({ required_error: "Nama Lengkap is required" })
        .min(3),
    email: zod_1.default.string({ required_error: "Email is required" }).email(),
    roleId: zod_1.default.number({ required_error: "Role is required" }),
    password: zod_1.default.string({ required_error: "Password is required" }).min(6),
    confirmationPassword: zod_1.default
        .string({ required_error: "Confirmation is required" })
        .min(6),
})
    .refine((data) => data.password === data.confirmationPassword, {
    message: "Passwords do not match",
    path: ["confirmationPassword"],
});
exports.default = CreateUserDTO;
