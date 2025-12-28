import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export type IUserLoginDTO = {
  username: string;
  password: string;
};

class UserLoginDTO extends BaseDTO {
  static schemaLogin = z.object({
    username: z.string(),
    password: z.string(),
  });

  static async fromLogin(payload: IUserLoginDTO) {
    return super.from(payload, this.schemaLogin, UserLoginDTO);
  }
}
export default UserLoginDTO;
