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
exports.schemaBatchTarifBongkar = exports.schemaTarifBongkarBatchItem = void 0;
const zod_1 = require("zod");
exports.schemaTarifBongkarBatchItem = zod_1.z.object({
    idTradeType: zod_1.z.number(),
    idContainerSize: zod_1.z.number(),
    idAngkut: zod_1.z.number(),
    idBarang: zod_1.z.number(),
    amount: zod_1.z.number().min(0),
    jasaWrapping: zod_1.z.boolean().default(false),
});
exports.schemaBatchTarifBongkar = zod_1.z.object({
    items: zod_1.z.array(exports.schemaTarifBongkarBatchItem),
});
class TarifBongkarBatchDTO {
}
_a = TarifBongkarBatchDTO;
TarifBongkarBatchDTO.fromBatchTarifBongkar = (body) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.schemaBatchTarifBongkar.parseAsync(body);
});
exports.default = TarifBongkarBatchDTO;
