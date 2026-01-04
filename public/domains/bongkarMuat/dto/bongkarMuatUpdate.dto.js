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
class UpdateBongkarMuatDTO extends baseDTO_1.default {
    static fromUpdateBongkarMuat(payload) {
        const _super = Object.create(null, {
            from: { get: () => super.from }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.from.call(this, payload, this.schemaUpdateBongkarMuat, UpdateBongkarMuatDTO);
        });
    }
}
UpdateBongkarMuatDTO.schemaUpdateBongkarMuat = zod_1.default.object({
    ownerCode: zod_1.default.string().max(4, "maximum 4 karakter for owner code.").optional(),
    seriContainer: zod_1.default.string().optional(),
    idKoorlap: zod_1.default.string().optional(),
    idGroupTeam: zod_1.default.string().optional(),
    jasaWrapping: zod_1.default.boolean().optional(),
    platContainer: zod_1.default.string().optional(),
    idBarang: zod_1.default.number().optional(),
    idContainerSize: zod_1.default.number().optional(),
    idAngkut: zod_1.default.number().optional(),
    idTradeType: zod_1.default.number().optional(),
    startAT: zod_1.default.string().optional(),
    endAT: zod_1.default.string().optional(),
});
exports.default = UpdateBongkarMuatDTO;
