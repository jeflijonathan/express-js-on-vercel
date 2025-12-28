import { prisma } from "@config/database/client";

export const barangSeeder = async () => {
  await prisma.barang.createMany({
    data: [
      { name: "BIJI PLASTIK" },
      { name: "NON PLASTIK" },
      { name: "MATERIAL" },
      { name: "LAIN-LAIN" },
      { name: "MESIN" },
      { name: "ALL" },
    ],
    skipDuplicates: true,
  });

  console.log("seedder barang done.");
};
