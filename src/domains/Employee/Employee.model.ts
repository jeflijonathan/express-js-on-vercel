import { Prisma } from "@prisma/client";

export type EmployeeResponseModel = Prisma.EmployeeGetPayload<{
  select: {
    id: true;
    namaLengkap: true;
    email: true;
    status: true;
    role: true;
    createdAt: true;
    updatedAt: true;
  };
}>;
