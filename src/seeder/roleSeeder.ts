import { prisma } from "@config/database/client";

export const seedRole = async () => {
  await prisma.role.createMany({
    data: [
      { name: "ADMIN" },
      { name: "MANAJER" },
      { name: "SPV" },
      { name: "TIM" },
      { name: "KOORLAP" },
    ],
    skipDuplicates: true,
  });

  console.log("Role seeding done.");
};
