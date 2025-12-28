"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buildStatusFilter = (fieldname, value) => {
    const statusStr = String(value);
    if (["true", "1", 1].includes(statusStr)) {
        return { [fieldname]: true };
    }
    if (["false", "0", 1].includes(statusStr)) {
        return { [fieldname]: false };
    }
    return { [fieldname]: undefined };
};
exports.default = buildStatusFilter;
