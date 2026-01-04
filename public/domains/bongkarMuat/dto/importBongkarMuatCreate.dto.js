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
class CreateImportBongkarMuatDTO extends baseDTO_1.default {
    static fromCreateImportBongkarMuat(payload) {
        const _super = Object.create(null, {
            from: { get: () => super.from }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.from.call(this, payload, this.schemaCreateImportBongkarMuat, CreateImportBongkarMuatDTO);
        });
    }
}
CreateImportBongkarMuatDTO.schemaCreateImportBongkarMuat = zod_1.default.object({
    ownerCode: zod_1.default.string().max(4, "maximum 4 karakter for owner code."),
    seriContainer: zod_1.default
        .string()
        .min(3, "seri container is required.")
        .refine((val) => /^\d+$/.test(val), {
        message: "seri container only number",
    }),
    idKoorlap: zod_1.default.string().min(1, "id koor lap is required."),
    idGroupTeam: zod_1.default.string().min(1, "team is required."),
    idBarang: zod_1.default.number().min(1, "id barang is required."),
    idContainerSize: zod_1.default.number().min(1, "id container size is required."),
    idAngkut: zod_1.default.number().min(1, "id angkut is required."),
    jasaWrapping: zod_1.default.boolean(),
    platContainer: zod_1.default.string().min(1, "Plat number is required."),
    startAT: zod_1.default.string().min(1, "Start time is required."),
    endAT: zod_1.default.string().optional(),
});
exports.default = CreateImportBongkarMuatDTO;
