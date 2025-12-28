import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export interface IGroupTeamUpdatePayload {
  status: boolean;
}

class UpdateGroupTeamDTO extends BaseDTO {
  static schemaUpdateGroupTeam = z.object({
    status: z.boolean(),
  });

  static async fromUpdateContainer(payload: IGroupTeamUpdatePayload) {
    return super.from(payload, this.schemaUpdateGroupTeam, UpdateGroupTeamDTO);
  }
}

export default UpdateGroupTeamDTO;
