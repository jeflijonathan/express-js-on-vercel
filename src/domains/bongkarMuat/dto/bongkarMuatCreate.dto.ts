import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export interface IBongkarMuatPayload {
  ownerCode: string;
  seriContainer: string;
  idKoorlap: string;
  idGroupTeam: string;
  idBarang: number;
  idContainerSize: number;
  idTradeType: number;
  idAngkut: number;
  jasaWrapping: boolean;
}

class CreateBongkarMuatDTO extends BaseDTO {
  static schemaCreateContainer = z.object({
    ownerCode: z.string().max(4, "maximum 4 karakter for owner code."),
    seriContainer: z.string().min(1, "seri container is required."),
    idKoorlap: z.string().min(1, "id koor lap is required."),
    idGroupTeam: z.string().min(1, "id group team is required."),
    idBarang: z.number().min(1, "id barang is required."),
    idContainerSize: z.number().min(1, "id container size is required."),
    idTradeType: z.number().min(1, "id trade type is required."),
    idAngkut: z.number().min(1, "id angkut is required."),
    jasaWrapping: z.boolean(),
  });

  static async fromCreateBongkarMuat(payload: IBongkarMuatPayload) {
    return super.from(
      payload,
      this.schemaCreateContainer,
      CreateBongkarMuatDTO
    );
  }
}

export default CreateBongkarMuatDTO;
