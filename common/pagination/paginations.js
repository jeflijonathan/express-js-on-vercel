"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = getPagination;
function getPagination(props) {
    const { page = "1", limit = "10" } = props;
    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.max(parseInt(limit), 1);
    const skip = (pageNum - 1) * limitNum;
    return {
        skip,
        take: limitNum,
        page: pageNum,
        limit: limitNum,
    };
}
