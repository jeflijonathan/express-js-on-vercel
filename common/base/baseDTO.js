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
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = require("@common/consts/statusCodes");
class BaseDTO {
    constructor(data) {
        Object.assign(this, data);
    }
    static from(payload, schema, DtoClass) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield schema.safeParseAsync(payload);
            if (!result.success) {
                const formatted = result.error.errors.map((e) => ({
                    field: Array.isArray(e.path) ? e.path.join(".") : String(e.path),
                    message: `${e.message}, errornya`,
                }));
                throw {
                    statusCode: statusCodes_1.StatusBadRequest,
                    message: `${formatted[0].message} on field ${formatted[0].field}`,
                    details: formatted,
                };
            }
            return new DtoClass(result.data);
        });
    }
}
exports.default = BaseDTO;
