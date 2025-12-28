import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export interface IGroupTeamCreatePayload {
  idTeamList: string[];
}

class CreateGroupTeamDTO extends BaseDTO {
  static schemaCreateGroupTeam = z.object({
    idTeamList: z
      .array(z.string().min(1, "id is required"))
      .min(1, "Tim is required"),
  });

  static async fromCreateGroupTeam(payload: IGroupTeamCreatePayload) {
    return super.from(payload, this.schemaCreateGroupTeam, CreateGroupTeamDTO);
  }
}

export default CreateGroupTeamDTO;
