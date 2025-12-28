import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export interface IUserCreatePayload {
  employeeId: string;
  roleId: number;
}

export interface IUserWithEmployeePayload {
  username: string;
  namaLengkap: string;
  email: string;
  roleId: number;
  password: string;
  confirmationPassword: string;
}

class CreateUserDTO extends BaseDTO {
  static schemaCreateUserWithEmployeeById = z
    .object({
      username: z.string({ required_error: "Username is required" }).min(3),
      employeeId: z.string({ required_error: "Employee is required" }).min(1),
      roleId: z.number({ required_error: "Employee is required" }).min(1),
      password: z.string({ required_error: "Password is required" }).min(6),
      confirmationPassword: z
        .string({ required_error: "Confirmation is required" })
        .min(6),
    })
    .refine((data) => data.password === data.confirmationPassword, {
      message: "Passwords do not match",
      path: ["confirmationPassword"],
    });

  static schemaCreateUserWithEmployee = z
    .object({
      username: z.string({ required_error: "Username is required" }).min(3),
      namaLengkap: z
        .string({ required_error: "Nama Lengkap is required" })
        .min(3),
      email: z.string({ required_error: "Email is required" }).email(),
      roleId: z.number({ required_error: "Role is required" }),
      password: z.string({ required_error: "Password is required" }).min(6),
      confirmationPassword: z
        .string({ required_error: "Confirmation is required" })
        .min(6),
    })
    .refine((data) => data.password === data.confirmationPassword, {
      message: "Passwords do not match",
      path: ["confirmationPassword"],
    });

  static async fromCreateUserWithEmployeeId(payload: IUserCreatePayload) {
    return super.from(
      payload,
      this.schemaCreateUserWithEmployeeById,
      CreateUserDTO
    );
  }

  static async fromCreateUserWithEmployee(payload: IUserWithEmployeePayload) {
    return super.from(
      payload,
      this.schemaCreateUserWithEmployee,
      CreateUserDTO
    );
  }
}

export default CreateUserDTO;
