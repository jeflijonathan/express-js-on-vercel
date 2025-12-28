import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export interface IGajiKuliCreatePayload {
  angkutId: number;
  tradeTypeId: number;
  containerSizeId: number;
  gaji: number;
  koorlapId: string;
}

class CreateGajiKuliDTO extends BaseDTO {
  static schemaCreateGajiKuli = z.object({
    angkutId: z.number().min(1, "id angkut is required."),
    tradeTypeId: z.number().min(1, "id trade type is required."),
    containerSizeId: z.number().min(1, "id container size is required."),
    gaji: z.number().min(0, "gaji is required."),
    koorlapId: z.string().min(1, "koorlap is required."),
  });

  static async fromCreateGajiKuli(payload: IGajiKuliCreatePayload) {
    return super.from(
      payload,
      this.schemaCreateGajiKuli,
      CreateGajiKuliDTO
    );
  }
}

export default CreateGajiKuliDTO;
