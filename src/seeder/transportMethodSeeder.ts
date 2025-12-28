import { prisma } from "src/config/database/client";

export const angkutSeeder = async () => {
  await prisma.angkut.createMany({
    data: [{ name: "FORKLIFT" }, { name: "MANUAL" }, { name: "ALL" },],
    skipDuplicates: true,
  });
  console.log("Angkut seeding done.");
};
