"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSingleSearch = buildSingleSearch;
function buildSingleSearch(searchField, searchValue) {
    if (!searchValue || searchValue.trim() === "") {
        return undefined;
    }
    return {
        [searchField]: {
            contains: searchValue,
        },
    };
}
