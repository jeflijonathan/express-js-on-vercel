import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export interface IProfilePayload {
  username: string;
  namaLengkap: string;
  email: string;
  newPassword: string;
}

class UpdateProfileDTO extends BaseDTO {
  static schemaUpdateUser = z.object({
    namaLengkap: z
      .string({ required_error: "Nama Lengkap is required" })
      .min(3, "Nama Lengkap minimal 3 karakter"),
    username: z
      .string({ required_error: "Username is required" })
      .min(3, "Username minimal 3 karakter"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Email tidak valid"),
    newPassword: z
      .string({ required_error: "password is required" })
      .refine((val) => val === undefined || val === "" || val.length >= 6, {
        message: "Password minimal 6 karakter",
      }),
  });

  static async fromUpdateProfile(payload: IProfilePayload) {
    return super.from(payload, this.schemaUpdateUser, UpdateProfileDTO);
  }
}

export default UpdateProfileDTO;
