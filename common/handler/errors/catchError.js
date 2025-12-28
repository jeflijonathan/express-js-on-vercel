"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchError = catchError;
function catchError(promise) {
    return promise
        .then((data) => {
        return [undefined, data !== null && data !== void 0 ? data : []];
    })
        .catch((error) => {
        return [error];
    });
}
