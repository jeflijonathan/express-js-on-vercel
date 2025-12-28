const dotenv = require("dotenv");
dotenv.config();

const env = {
  beHost: process.env.BE_HOST || "0.0.0.0",
  bePort: process.env.BE_PORT ? parseInt(process.env.BE_PORT, 10) : 3000,

  // dbHost: process.env.DB_HOST || "localhost",
  // dbPort: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  // dbUser: process.env.DB_USER || "root",
  // dbPassword: process.env.DB_PASSWORD || "",
  // dbName: process.env.DB_NAME || "test",
  // dbLogging: process.env.DB_LOGGING === "true" ? console.log : false,
};

export default env;
