"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStringFilter = buildStringFilter;
function buildStringFilter(query = {}, fieldName) {
    const { order_by, sort } = query;
    if (typeof order_by !== "string")
        return undefined;
    const order = order_by.toLowerCase();
    if ((order !== "asc" && order !== "desc") || sort !== fieldName) {
        return undefined;
    }
    return {
        [fieldName]: order,
    };
}
