"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setTokenCookie = (res, result) => {
    res.cookie("refreshToken", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 6 * 60 * 60 * 1000,
    });
};
exports.default = setTokenCookie;
