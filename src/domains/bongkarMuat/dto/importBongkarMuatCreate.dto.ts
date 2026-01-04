import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export interface IImportBongkarMuatPayload {
  ownerCode: string;
  seriContainer: string;
  idKoorlap: string;
  idGroupTeam: string;
  idContainerSize: number;
  idAngkut: number;
  idBarang: number;
  jasaWrapping: boolean;
  platContainer: string;
  startAT: string;
  endAT?: string;
}

class CreateImportBongkarMuatDTO extends BaseDTO {
  static schemaCreateImportBongkarMuat = z.object({
    ownerCode: z.string().max(4, "maximum 4 karakter for owner code."),
    seriContainer: z
      .string()
      .min(3, "seri container is required.")
      .refine((val) => /^\d+$/.test(val), {
        message: "seri container only number",
      }),
    idKoorlap: z.string().min(1, "id koor lap is required."),
    idGroupTeam: z.string().min(1, "team is required."),
    idBarang: z.number().min(1, "id barang is required."),
    idContainerSize: z.number().min(1, "id container size is required."),
    idAngkut: z.number().min(1, "id angkut is required."),
    jasaWrapping: z.boolean(),
    platContainer: z.string().min(1, "Plat number is required."),
    startAT: z.string().min(1, "Start time is required."),
    endAT: z.string().optional(),
  });

  static async fromCreateImportBongkarMuat(payload: IImportBongkarMuatPayload) {
    return super.from(
      payload,
      this.schemaCreateImportBongkarMuat,
      CreateImportBongkarMuatDTO
    );
  }
}

export default CreateImportBongkarMuatDTO;
