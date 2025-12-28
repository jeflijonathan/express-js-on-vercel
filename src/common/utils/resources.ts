import { Application, RequestHandler } from "express";

export const Resources = (
  app: Application,
  path: string,
  controller: any,
  middlewares: RequestHandler[] = []
) => {
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
