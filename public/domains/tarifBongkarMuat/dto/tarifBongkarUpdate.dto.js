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
class UpdateTarifBongkarMuatDTO extends baseDTO_1.default {
    static fromUpdateBongkarMuat(payload) {
        const _super = Object.create(null, {
            from: { get: () => super.from }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.from.call(this, payload, this.schemaUpdateTarifBongkarMuat, UpdateTarifBongkarMuatDTO);
        });
    }
}
UpdateTarifBongkarMuatDTO.schemaUpdateTarifBongkarMuat = zod_1.default.object({
    idBarang: zod_1.default.number().optional(),
    idContainerSize: zod_1.default.number().optional(),
    idTradeType: zod_1.default.number().optional(),
    idAngkut: zod_1.default.number().optional(),
    amount: zod_1.default.number().min(0, "amount is required."),
    jasaWrapping: zod_1.default.boolean().optional(),
});
exports.default = UpdateTarifBongkarMuatDTO;
