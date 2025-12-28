"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function exclude(obj, keys) {
    const newObj = Object.assign({}, obj);
    for (let key of keys) {
        delete newObj[key];
    }
    return newObj;
}
exports.default = exclude;
