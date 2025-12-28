
import { prisma } from "../src/config/database/client";
async function main() {
  console.log(
    "Copying Employee.username -> Employee.namaLengkap where empty..."
  );

  const result = await prisma.$executeRaw`
    UPDATE Employee e
    JOIN User u ON e.id = u.employeeId
    SET e.namaLengkap = u.username
    WHERE (e.namaLengkap IS NULL OR e.namaLengkap = '') AND (u.username IS NOT NULL AND u.username <> '')
  `;

  console.log("Finished copying. Rows affected:", result);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
