"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = void 0;
const success = (props) => {
    const { res, statusCode, message, data, pagination } = props;
    const response = Object.assign({ status: true, status_code: statusCode, message: message, data: data }, (pagination ? { pagination } : {}));
    res.status(statusCode).json(response);
};
exports.success = success;
