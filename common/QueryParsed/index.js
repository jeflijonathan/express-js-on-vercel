"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryParsed = QueryParsed;
const qs_1 = __importDefault(require("qs"));
function QueryParsed(req) {
    var _a;
    const url = new URL(req.originalUrl, `http://${req.headers.host}`);
    const parsed = qs_1.default.parse(url.search.slice(1));
    return (_a = parsed.params) !== null && _a !== void 0 ? _a : parsed;
}
