import { prisma } from "src/config/database/client";

const containerSizeItemSeeder = async () => {
  await prisma.containerSize.createMany({
    data: [
      { name: "20 feet" },
      { name: "40 feet" },
      { name: "LCL(merah)" },
      { name: "LCL(hijau)" },
      { name: "ALLLCL" },
      { name: "ALL" },
    ],
    skipDuplicates: true,
  });

  console.log("ContainerSize size item done.");
};
export default containerSizeItemSeeder;
