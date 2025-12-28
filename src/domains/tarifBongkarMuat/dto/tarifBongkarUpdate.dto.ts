import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export interface ITarifBongkarMuatUpdatePayload {
  idBarang?: number;
  idContainerSize?: number;
  idTradeType?: number;
  idAngkut?: number;
  amount: number;
  jasaWrapping?: boolean;
}

class UpdateTarifBongkarMuatDTO extends BaseDTO {
  static schemaUpdateTarifBongkarMuat = z.object({
    idBarang: z.number().optional(),
    idContainerSize: z.number().optional(),
    idTradeType: z.number().optional(),
    idAngkut: z.number().optional(),
    amount: z.number().min(0, "amount is required."),
    jasaWrapping: z.boolean().optional(),
  });

  static async fromUpdateBongkarMuat(payload: ITarifBongkarMuatUpdatePayload) {
    return super.from(
      payload,
      this.schemaUpdateTarifBongkarMuat,
      UpdateTarifBongkarMuatDTO
    );
  }
}

export default UpdateTarifBongkarMuatDTO;
