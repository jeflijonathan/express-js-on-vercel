import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export interface IUserPayload {
  username: string;
  namaLengkap: string;
  email: string;
  roleId: number;
  password?: string;
  confirmationPassword?: string;
}

class UpdateUserDTO extends BaseDTO {
  static schemaUpdateUser = z
    .object({
      namaLengkap: z
        .string({ required_error: "Nama Lengkap is required" })
        .min(3, "Nama Lengkap minimal 3 karakter"),
      username: z
        .string({ required_error: "Username is required" })
        .min(3, "Username minimal 3 karakter"),
      email: z
        .string({ required_error: "Email is required" })
        .email("Email tidak valid"),

      password: z
        .string({ required_error: "password is required" })
        .refine((val) => val === undefined || val === "" || val.length >= 6, {
          message: "Password minimal 6 karakter",
        }),
      confirmationPassword: z
        .string({ required_error: "confirmation password is required" })
        .refine((val) => val === undefined || val === "" || val.length >= 6, {
          message: "Konfirmasi password minimal 6 karakter",
        }),
      roleId: z.number({ required_error: "Role ID harus diisi" }).int(),
      status: z.boolean().optional(),
    })
    .refine((data) => data.password === data.confirmationPassword, {
      message: "Password dan konfirmasi password tidak cocok",
      path: ["confirmationPassword"],
    });

  static async fromUpdateUser(payload: IUserPayload) {
    return super.from(payload, this.schemaUpdateUser, UpdateUserDTO);
  }
}

export default UpdateUserDTO;
