import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export interface IExportBongkarMuatPayload {
  ownerCode: string;
  seriContainer: string;
  idKoorlap: string;
  idGroupTeam: string;
  idContainerSize: number;
  idAngkut: number;
  jasaWrapping: boolean;
  platContainer: string;
  startAT: string;
  endAT?: string;
}

class CreateExportBongkarMuatDTO extends BaseDTO {
  static schemaCreateExportBongkarMuat = z.object({
    ownerCode: z.string().max(4, "maximum 4 karakter for owner code."),
    seriContainer: z
      .string()
      .min(3, "seri container is required.")
      .refine((val) => /^\d+$/.test(val), {
        message: "seri container only number",
      }),
    idKoorlap: z.string().min(1, "id koor lap is required."),
    idGroupTeam: z.string().min(1, "team is required."),
    idContainerSize: z.number().min(1, "id container size is required."),
    idAngkut: z.number().min(1, "id angkut is required."),
    jasaWrapping: z.boolean(),
    platContainer: z.string().min(1, "Plat number is required."),
    startAT: z.string().min(1, "Start time is required."),
    endAT: z.string().optional(),
  });

  static async fromCreateExportBongkarMuat(payload: IExportBongkarMuatPayload) {
    return super.from(
      payload,
      this.schemaCreateExportBongkarMuat,
      CreateExportBongkarMuatDTO
    );
  }
}

export default CreateExportBongkarMuatDTO;
