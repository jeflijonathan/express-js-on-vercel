import "dotenv/config";
import Router from "./config/router/router";
import { Response } from "express";
import Server from "./config/server/server";
import express from "express";
import { prisma } from "src/config/database/client";

async function main() {
  try {
    await prisma.$connect();

    const app = express();

    const router = new Router(app);
    const server = new Server(app);

    router.routerAPI();
    router.routerExcel();
    router.app.use((_, res: Response) => {
      res.status(404).json({
        status: "Error",
        statusCode: 404,
        message: "404 Not Found Page",
        data: [],
      });
    });

    server.listen();

    process.on("SIGINT", async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
