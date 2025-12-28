import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export interface IGajiKuliUpdatePayload {
  angkutId?: number;
  tradeTypeId?: number;
  containerSizeId?: number;
  gaji: number;
  koorlapId?: string;
}

class UpdateGajiKuliDTO extends BaseDTO {
  static schemaUpdateGajiKuli = z.object({
    angkutId: z.number().optional(),
    tradeTypeId: z.number().optional(),
    containerSizeId: z.number().optional(),
    gaji: z.number().min(0, "gaji is required."),
    koorlapId: z.string().optional(),
  });

  static async fromUpdateGajiKuli(payload: IGajiKuliUpdatePayload) {
    return super.from(
      payload,
      this.schemaUpdateGajiKuli,
      UpdateGajiKuliDTO
    );
  }
}

export default UpdateGajiKuliDTO;
