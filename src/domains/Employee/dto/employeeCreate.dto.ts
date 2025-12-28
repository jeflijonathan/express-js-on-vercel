import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export interface IEmployeeCreatePayload {
  namaLengkap: string;
  email: string;
  roleId: number;
}

class CreateEmployeeDTO extends BaseDTO {
  static schemaCreateEmployee = z.object({
    namaLengkap: z
      .string({ required_error: "Nama lengkap is required" })
      .min(3),
    email: z.string({ required_error: "Email is required" }).email(),
    roleId: z.number({ required_error: "Role is required" }),
  });

  static async fromCreateEmployee(payload: IEmployeeCreatePayload) {
    return super.from(payload, this.schemaCreateEmployee, CreateEmployeeDTO);
  }
}

export default CreateEmployeeDTO;
