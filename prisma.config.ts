import { defineConfig } from "prisma/config";
import env from "dotenv";

env.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: `${process.env.DATABASE_URL}`,
    // url: `mysql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
  },
});
