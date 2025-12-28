import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export interface IEmployeeUpdateayload {
  namaLengkap: string;
  email: string;
  roleId: number;
}

class UpdateEmployeeDTO extends BaseDTO {
  static schemaUpdateUser = z.object({
    namaLengkap: z
      .string({ required_error: "Username is required" })
      .min(3, "Username minimal 3 karakter")
      .optional(),
    email: z
      .string({ required_error: "Email is required" })
      .email("Email tidak valid")
      .optional(),
    roleId: z
      .number({ required_error: "Role ID harus diisi" })
      .int()
      .optional(),
    status: z.boolean().optional(),
  });

  static async fromUpdateEmployee(payload: IEmployeeUpdateayload) {
    return super.from(payload, this.schemaUpdateUser, UpdateEmployeeDTO);
  }
}

export default UpdateEmployeeDTO;
