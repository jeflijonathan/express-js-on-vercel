import { encrypt } from "@common/utils/encrypt";
import { prisma } from "src/config/database/client";

export const seedUser = async () => {
  const admin = await prisma.employee.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      namaLengkap: "Admin",
      email: "admin@gmail.com",
      roleId: 1,
      status: true,
    },
  });

  if (admin) {
    await prisma.user.upsert({
      where: { employeeId: admin.id },
      update: {},
      create: {
        username: "admin",
        password: await encrypt("admin123"),
        employeeId: admin.id,
      },
    });
  }

  const manager = await prisma.employee.upsert({
    where: { email: "manager@gmail.com" },
    update: {},
    create: {
      namaLengkap: "Manager",
      email: "manager@gmail.com",
      roleId: 2,
      status: true,
    },
  });

  if (manager) {
    await prisma.user.upsert({
      where: { employeeId: manager.id },
      update: {},
      create: {
        username: "manager",
        password: await encrypt("manager123"),
        employeeId: manager.id,
      },
    });
  }

  const spv = await prisma.employee.upsert({
    where: { email: "spv@gmail.com" },
    update: {},
    create: {
      namaLengkap: "Supervisor",
      email: "spv@gmail.com",
      roleId: 3,
      status: true,
    },
  });

  if (spv) {
    await prisma.user.upsert({
      where: { employeeId: spv.id },
      update: {},
      create: {
        username: "spv",
        password: await encrypt("spv123"),
        employeeId: spv.id,
      },
    });
  }

  console.log("Admin, Manager, dan SPV seeding done.");
};
