import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export type IResetPasswordDTO = {
  resetToken: string;
  newPassword: string;
};

class ResetPasswordDTO extends BaseDTO {
  static schema = z.object({
    resetToken: z.string(),
    newPassword: z.string().min(4),
  });

  static async fromResetPassword(payload: IResetPasswordDTO) {
    return super.from(payload, this.schema, ResetPasswordDTO);
  }
}
export default ResetPasswordDTO;
