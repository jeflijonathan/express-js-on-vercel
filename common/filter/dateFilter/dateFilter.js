"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDateFilter = buildDateFilter;
function buildDateFilter(query = {}) {
    const { order_by, sort } = query;
    if (typeof order_by !== "string" || typeof sort !== "string") {
        return undefined;
    }
    if ((order_by !== "asc" && order_by !== "desc") ||
        (sort !== "createdAt" && sort !== "updatedAt")) {
        return undefined;
    }
    return {
        [sort]: order_by,
    };
}
