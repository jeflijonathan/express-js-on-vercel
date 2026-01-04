"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtServices {
    constructor() {
        this.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
        this.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
    }
    generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.ACCESS_TOKEN_SECRET, { expiresIn: "3h" });
    }
    generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    }
    verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, this.ACCESS_TOKEN_SECRET);
    }
    verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, this.REFRESH_TOKEN_SECRET);
    }
}
exports.default = JwtServices;
