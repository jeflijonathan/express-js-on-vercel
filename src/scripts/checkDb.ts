import "dotenv/config";
import { prisma } from "src/config/database/client";

async function main() {
  try {
    await prisma.$connect();
    const res = await prisma.$queryRaw`select 1 as ok`;
    console.log("DB connectivity check OK:", res);
  } catch (err) {
    console.error("DB connectivity check failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
