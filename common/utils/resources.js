"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resources = void 0;
const Resources = (app, path, controller, middlewares = []) => {
    const basePath = `/api${path}`;
    if (typeof controller.getAll === "function") {
        app.get(`${basePath}`, ...middlewares, controller.getAll);
    }
    if (typeof controller.getById === "function") {
        app.get(`${basePath}/:id`, ...middlewares, controller.getById);
    }
    if (typeof controller.create === "function") {
        app.post(`${basePath}`, ...middlewares, controller.create);
    }
    if (typeof controller.update === "function") {
        app.put(`${basePath}/:id`, ...middlewares, controller.update);
    }
    if (typeof controller.delete === "function") {
        app.delete(`${basePath}/:id`, ...middlewares, controller.delete);
    }
};
exports.Resources = Resources;
