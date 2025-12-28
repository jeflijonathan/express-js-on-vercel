import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export type IVerifyCodeDTO = {
    email: string;
    codeVerification: string;
};

class VerifyCodeDTO extends BaseDTO {
    static schema = z.object({
        email: z.string().email(),
        codeVerification: z.string().min(6).max(6),
    });

    static async fromVerifyCode(payload: IVerifyCodeDTO) {
        return super.from(payload, this.schema, VerifyCodeDTO);
    }
}
export default VerifyCodeDTO;
