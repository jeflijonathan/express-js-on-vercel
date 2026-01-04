import { barangSeeder } from "./barangSeeder";
import { seedRole } from "./roleSeeder";
import containerSizeItemSeeder from "./sizeContainerSeeder";
import SeedTradeType from "./TradeTypeSeed";
import { angkutSeeder } from "./transportMethodSeeder";
import { seedUser } from "./userSeeder";
import { tarifBongkarMuatSeeder } from "./tarifBongkarMuatSeeder";
import { prisma } from "src/config/database/client";

const arg = "all";

const listSeeder = [
  { name: "role", seeder: seedRole },
  { name: "user", seeder: seedUser },
  { name: "transport", seeder: angkutSeeder },
  { name: "categoryitem", seeder: barangSeeder },
  { name: "tradeType", seeder: SeedTradeType },
  { name: "containerSize", seeder: containerSizeItemSeeder },
  { name: "tarifBongkarMuat", seeder: tarifBongkarMuatSeeder },
];

async function main() {
  await prisma.$connect();

  for (const item of listSeeder) {
    await item.seeder();
  }
}

main()
  .then(() => {
    prisma.$disconnect().catch(() => { });
    console.log("Seeding complete");
  })
  .catch((e) => {
    console.error("Error while seeding:", e);
    prisma.$disconnect().catch(() => { });
    process.exit(1);
  });
