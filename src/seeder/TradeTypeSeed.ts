import { prisma } from "src/config/database/client";

const SeedTradeType = async () => {
  await prisma.tradeType.createMany({
    data: [{ name: "EXPORT" }, { name: "IMPORT" }, { name: "ALL" },],
    skipDuplicates: true,
  });

  console.log("Trade Type seeding done.");
};

export default SeedTradeType;
