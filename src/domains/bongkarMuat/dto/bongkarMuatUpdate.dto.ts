import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export interface IBongkarMuatUpdatePayload {
  ownerCode: string;
  seriContainer: string;
  idKoorlap: string;
  idGroupTeam: string;

  jasaWrapping: boolean;
  platContainer: string;
  idBarang?: number;
  idContainerSize?: number;
  idAngkut?: number;
  idTradeType?: number;
  startAT?: string;
  endAT?: string;
}

class UpdateBongkarMuatDTO extends BaseDTO {
  static schemaUpdateBongkarMuat = z.object({
    ownerCode: z.string().max(4, "maximum 4 karakter for owner code.").optional(),
    seriContainer: z.string().optional(),
    idKoorlap: z.string().optional(),
    idGroupTeam: z.string().optional(),

    jasaWrapping: z.boolean().optional(),
    platContainer: z.string().optional(),
    idBarang: z.number().optional(),
    idContainerSize: z.number().optional(),
    idAngkut: z.number().optional(),
    idTradeType: z.number().optional(),
    startAT: z.string().optional(),
    endAT: z.string().optional(),
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
