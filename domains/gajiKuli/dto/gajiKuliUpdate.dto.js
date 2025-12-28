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
class UpdateGajiKuliDTO extends baseDTO_1.default {
    static fromUpdateGajiKuli(payload) {
        const _super = Object.create(null, {
            from: { get: () => super.from }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.from.call(this, payload, this.schemaUpdateGajiKuli, UpdateGajiKuliDTO);
        });
    }
}
UpdateGajiKuliDTO.schemaUpdateGajiKuli = zod_1.default.object({
    angkutId: zod_1.default.number().optional(),
    tradeTypeId: zod_1.default.number().optional(),
    containerSizeId: zod_1.default.number().optional(),
    gaji: zod_1.default.number().min(0, "gaji is required."),
    koorlapId: zod_1.default.string().optional(),
});
exports.default = UpdateGajiKuliDTO;
