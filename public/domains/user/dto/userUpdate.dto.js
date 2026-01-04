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
class UpdateUserDTO extends baseDTO_1.default {
    static fromUpdateUser(payload) {
        const _super = Object.create(null, {
            from: { get: () => super.from }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.from.call(this, payload, this.schemaUpdateUser, UpdateUserDTO);
        });
    }
}
UpdateUserDTO.schemaUpdateUser = zod_1.default
    .object({
    namaLengkap: zod_1.default
        .string({ required_error: "Nama Lengkap is required" })
        .min(3, "Nama Lengkap minimal 3 karakter"),
    username: zod_1.default
        .string({ required_error: "Username is required" })
        .min(3, "Username minimal 3 karakter"),
    email: zod_1.default
        .string({ required_error: "Email is required" })
        .email("Email tidak valid"),
    password: zod_1.default
        .string({ required_error: "password is required" })
        .refine((val) => val === undefined || val === "" || val.length >= 6, {
        message: "Password minimal 6 karakter",
    }),
    confirmationPassword: zod_1.default
        .string({ required_error: "confirmation password is required" })
        .refine((val) => val === undefined || val === "" || val.length >= 6, {
        message: "Konfirmasi password minimal 6 karakter",
    }),
    roleId: zod_1.default.number({ required_error: "Role ID harus diisi" }).int(),
    status: zod_1.default.boolean().optional(),
})
    .refine((data) => data.password === data.confirmationPassword, {
    message: "Password dan konfirmasi password tidak cocok",
    path: ["confirmationPassword"],
});
exports.default = UpdateUserDTO;
