import { prisma } from "src/config/database/client";
import { buildDateFilter } from "@common/filter/dateFilter/dateFilter";
import { buildSingleSearch } from "@common/filter/sigleSearch/sigleSearch";
import buildStatusFilter from "@common/filter/statusFilter/statusFilter";
import { GroupTeamRepository, TeamRepository } from "src/repository";
import UpdateGroupTeamDTO, {
  IGroupTeamUpdatePayload,
} from "./dto/groupTeamUpdate.dto";
import CreateGroupTeamDTO, {
  IGroupTeamCreatePayload,
} from "./dto/groupTeamCreate.dto";

export default class GroupTeamService {
  _groupTeamRepository;
  _teamRepository;

  constructor() {
    this._groupTeamRepository = new GroupTeamRepository();
    this._teamRepository = new TeamRepository();
  }

  public async findAll(
    { skip, take }: { skip: number; take: number },
    params: any
  ) {
    try {
      const stringUsername = buildSingleSearch("username", params.value);
      const dateOrderBy = buildDateFilter(params);
      const statusFilter = buildStatusFilter("status", params.status);
      const orderBy = [];

      if (dateOrderBy) orderBy.push(dateOrderBy);
      const matchedTims = await this._teamRepository.findAll({
        ...stringUsername,
      });

      const groupTimIds: string[] = [
        ...new Set(
          matchedTims.map(
            (tim: { idGroupTeam: string }) => tim.idGroupTeam as string
          ) as string[]
        ),
      ];

      if (groupTimIds.length === 0) {
        return { data: [], total: 0 };
      }

      const groupTimList = await prisma.groupTeam.findMany({
        where: {
          id: {
            in: groupTimIds,
          },
          ...statusFilter,
        },
        skip,
        take,
        orderBy: orderBy,
        include: {
          team: {
            include: {
              employee: true,
            },
          },
        },
      });

      const mappedData = groupTimList.map((group) => ({
        idGroupTeam: group.id,
        GroupTeam: {
          status: group.status,
          createdAt: group.createdAt,
          updatedAt: group.updatedAt,
        },
        ListTeam: group.team.map((item) => ({
          id: item.id,
          namaLengkap: item.employee?.namaLengkap || "Unknown",
        })),
      }));

      return { data: mappedData, total: groupTimIds.length };
    } catch (err) {
      console.error("@GroupTeamService:findAll:error", err);
      throw err;
    }
  }

  public async findById(id: string) {
    try {
      const result = await prisma.groupTeam.findUnique({
        where: { id },
        select: {
          status: true,
        },
      });

      return [result];
    } catch (err) {
      console.error("@GroupTeamService:findById:error", err);
      throw err;
    }
  }

  public async handleCreateTimGroup(data: IGroupTeamCreatePayload) {
    try {
      console.log(data);
      const parsed = await CreateGroupTeamDTO.fromCreateGroupTeam(data);
      const inputTimSet = [...parsed.idTeamList].sort();
      const allGroups = await prisma.groupTeam.findMany({
        include: {
          team: true,
        },
      });

      const isDuplicate = allGroups.some((group) => {
        const existingTimSet = group.team.map((t) => t.kdTeam).sort();

        return (
          existingTimSet.length === inputTimSet.length &&
          existingTimSet.every((val, idx) => val === inputTimSet[idx])
        );
      });

      if (isDuplicate) {
        throw {
          statusCode: 400,
          message: "This team combination already exists.",
        };
      }

      const createdGroupTim = await this._groupTeamRepository.create({
        data: {
          status: true,
        },
      });

      const teamsToCreate = parsed.idTeamList.map((kdTeam) => ({
        kdTeam,
        idGroupTeam: createdGroupTim.id,
      }));

      const team = await this._teamRepository.createMany({
        data: teamsToCreate,
      });

      return team;
    } catch (err) {
      console.error("@GroupTeamService:handleUpdateGroupTim:error", err);
      throw err;
    }
  }

  public async handleUpdateGroupTim(id: string, data: IGroupTeamUpdatePayload) {
    try {
      const parsed = await UpdateGroupTeamDTO.fromUpdateContainer(data);
      const { status } = parsed;

      const result = await this._groupTeamRepository.updateGroupTeam(id, {
        status: status,
      });

      return result;
    } catch (err) {
      console.error("@GroupTeamService:handleUpdateGroupTim:error", err);
      throw err;
    }
  }

  public async handleDeleteGroupTim(id: string) {
    try {
      const existingGroup = await this._groupTeamRepository.findOne({
        id,
      });

      if (!existingGroup) {
        throw {
          statusCode: 404,
          message: "Group team not found.",
        };
      }

      await prisma.team.deleteMany({
        where: { idGroupTeam: id },
      });

      const deletedGroup = await this._groupTeamRepository.delete({
        id,
      });

      return deletedGroup;
    } catch (err) {
      console.error("@GroupTeamService:findAll:error", err);
      throw err;
    }
  }
}
