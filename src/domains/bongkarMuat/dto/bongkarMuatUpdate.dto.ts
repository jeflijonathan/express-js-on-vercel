import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export interface IBongkarMuatUpdatePayload {
  ownerCode: string;
  seriContainer: string;
  idKoorlap: string;
  idGroupTeam: string;
  idStatusBongkar: number;
  jasaWrapping: boolean;
  idBarang?: number;
  idContainerSize?: number;
  idAngkut?: number;
}

class UpdateBongkarMuatDTO extends BaseDTO {
  static schemaUpdateBongkarMuat = z.object({
    ownerCode: z.string().max(4, "maximum 4 karakter for owner code."),
    seriContainer: z.string().min(3, "seri container is required."),
    idKoorlap: z.string().min(1, "id koor lap is required."),
    idGroupTeam: z.string().min(1, "id group team is required."),
    idStatusBongkar: z.number().min(1, "id status bongkar is required."),
    jasaWrapping: z.boolean(),
    idBarang: z.number().optional(),
    idContainerSize: z.number().optional(),
    idAngkut: z.number().optional(),
  });

  static async fromUpdateBongkarMuat(payload: IBongkarMuatUpdatePayload) {
    return super.from(
      payload,
      this.schemaUpdateBongkarMuat,
      UpdateBongkarMuatDTO
    );
  }
}

export default UpdateBongkarMuatDTO;
