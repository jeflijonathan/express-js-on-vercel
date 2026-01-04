import { logger } from "@common/logger";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import env from "src/config/env/env";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { corsConfig } from "src/config/router/cors";
import fs from "fs";
import { prisma } from "../database/client";
import { StatusServiceUnavailable } from "@common/consts/statusCodes";

export default class Server {
  port: number;
  host: string;
  app: Application;

  constructor(app: Application) {
    this.app = app;
    this.port = env.bePort;
    this.host = env.beHost;

    dotenv.config();
    app.use(corsConfig());
    app.use(cookieParser());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.set("trust proxy", true);

    dotenv.config();

    this.app.get("/api/health-check", (_, res) => {
      res.status(200).json({ status: "OK", message: "Health check passed" });
    });
  }

  async listen() {
    try {
      await this.cekDBConnetion();
      this.app.listen(this.port, this.host, () => {
        logger.info(`🚀 Server running at http://${this.host}:${this.port}`);
      });
    } catch (error) {
      logger.error("❌ Database connection failed:", error);
      process.exit(1);
    }
  }
  async cekDBConnetion() {
    try {
      await prisma.$connect();
      logger.info("✅ Database connected successfully");
    } catch (err) {
      this.app.use((_: Request, res: Response) => {
        res.status(StatusServiceUnavailable).json({
          status: "Error",
          statusCode: StatusServiceUnavailable,
          message: "The Database is not Connected",
          data: [],
        });
      });
    }
  }
}
