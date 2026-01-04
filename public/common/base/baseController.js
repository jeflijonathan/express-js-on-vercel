"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = require("@common/consts/statusCodes");
const express_1 = require("express");
class BaseController {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    getRouter() {
        return this.router;
    }
    handleSuccess(res, data = {}, message = "Success", statusCode = statusCodes_1.StatusOk) {
        const result = data && typeof data === "object" && "data" in data
            ? Object.assign({}, data) : { data };
        res.status(statusCode).json(Object.assign({ status: "Success", statusCode: statusCode, message }, result));
    }
    handleError(res, error) {
        const { statusCode = statusCodes_1.StatusInternalServerError, message = "Internal Server Error", details = null, } = error;
        res.status(statusCode).json({
            status: "Error",
            statusCode: statusCode,
            message,
            details,
        });
    }
}
exports.default = BaseController;
