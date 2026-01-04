import { PrismaClient } from "@prisma/client";
import { logger } from "src/common/logger";

if (!process.env.DATABASE_URL) {
  logger.warn(
    "DATABASE_URL is not set. Please ensure it is defined in your environment variables."
  );
}

export const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
});
