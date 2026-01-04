import "dotenv/config";
import Router from "./config/router/router";
import { Response } from "express";
import Server from "./config/server/server";
import express from "express";
import { prisma } from "src/config/database/client";

const app = express();

const server = new Server(app);
const router = new Router(app);

router.routerAPI();
router.routerExcel();

app.use((_, res: Response) => {
  res.status(404).json({
    status: "Error",
    statusCode: 404,
    message: "404 Not Found Page",
    data: [],
  });
});

// async function main() {
//   try {
//     await server.listen();

//     process.on("SIGINT", async () => {
//       await prisma.$disconnect();
//       process.exit(0);
//     });
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// }

// // Only run the server if this file is executed directly
// if (require.main === module) {
//   main();
// }

export default app;
