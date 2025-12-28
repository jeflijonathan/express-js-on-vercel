import { prisma } from "src/config/database/client";

const SeedStatusInventory = async () => {
  await prisma.statusBongkar.createMany({
    data: [
      {
        name: "DONE",
      },
      {
        name: "PROGRESS",
      },
    ],
    skipDuplicates: true,
  });
  console.log("Status bongkar seeding done.");
};

export default SeedStatusInventory;
