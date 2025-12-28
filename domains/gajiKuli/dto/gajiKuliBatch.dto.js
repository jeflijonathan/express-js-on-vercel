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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaBatchGajiKuli = exports.schemaGajiKuliBatchItem = void 0;
const zod_1 = require("zod");
exports.schemaGajiKuliBatchItem = zod_1.z.object({
    tradeTypeId: zod_1.z.number(),
    containerSizeId: zod_1.z.number(),
    angkutId: zod_1.z.number(),
    gaji: zod_1.z.number().min(0),
});
exports.schemaBatchGajiKuli = zod_1.z.object({
    koorlapId: zod_1.z.string().uuid(),
    items: zod_1.z.array(exports.schemaGajiKuliBatchItem),
    isCreateMode: zod_1.z.boolean().optional(),
});
class GajiKuliBatchDTO {
}
_a = GajiKuliBatchDTO;
GajiKuliBatchDTO.fromBatchGajiKuli = (body) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.schemaBatchGajiKuli.parseAsync(body);
});
exports.default = GajiKuliBatchDTO;
