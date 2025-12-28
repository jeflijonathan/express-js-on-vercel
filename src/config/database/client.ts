import env from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { logger } from "src/common/logger";

env.config();

const dbUser = process.env.DB_USER ?? process.env.DB_USERNAME;
const dbPassword =
  process.env.DB_PASSWORD ?? process.env.DB_PASS ?? process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST ?? "localhost";
const dbPort = Number(process.env.DB_PORT ?? 3306);
const dbDatabase = process.env.DB_DATABASE ?? process.env.DB_NAME ?? "db_app";

const connectionLimit = Number(
  process.env.DB_CONNECTION_LIMIT ?? process.env.DB_POOL_LIMIT ?? 10
);

if (!dbUser || typeof dbPassword === "undefined" || dbPassword === null) {
  logger.error(
    "DB_USER or DB_PASSWORD is not set. Please copy 'example.env' to '.env' and set DB credentials."
  );
  throw new Error("Missing DB credentials in environment variables.");
}

const databaseUrl =
  process.env.DATABASE_URL ||
  `mysql://${encodeURIComponent(dbUser)}:${encodeURIComponent(
    dbPassword
  )}@${dbHost}:${dbPort}/${dbDatabase}?connection_limit=${connectionLimit}`;

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = databaseUrl;
}
const adapter = new PrismaMariaDb({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbDatabase,
  connectionLimit,
});

export const prisma = new PrismaClient({
  adapter,
  log: ["query", "error", "warn"],
});
