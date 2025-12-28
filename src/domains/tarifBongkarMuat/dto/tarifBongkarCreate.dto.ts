import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export interface ITarifBongkarMuatPayload {
  idBarang: number;
  idContainerSize: number;
  idTradeType: number;
  idAngkut: number;
  amount: number;
  jasaWrapping?: boolean;
}

class CreateTarifBongkarMuatDTO extends BaseDTO {
  static schemaCreateTarifBongkarMuat = z.object({
    idBarang: z.number().min(1, "id barang is required."),
    idContainerSize: z.number().min(1, "id container size is required."),
    idTradeType: z.number().min(1, "id trade type is required."),
    idAngkut: z.number().min(1, "id angkut is required."),
    amount: z.number().min(0, "amount is required."),
    jasaWrapping: z.boolean().optional(),
  });

  static async fromCreateBongkarMuat(payload: ITarifBongkarMuatPayload) {
    return super.from(
      payload,
      this.schemaCreateTarifBongkarMuat,
      CreateTarifBongkarMuatDTO
    );
  }
}

export default CreateTarifBongkarMuatDTO;
