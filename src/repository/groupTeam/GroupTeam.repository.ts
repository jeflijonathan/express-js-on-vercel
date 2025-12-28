import BasePrismaService, { Paginator } from "@common/base/basePrismaService";
import { Prisma } from "@prisma/client";
import { prisma } from "src/config/database/client";

class GroupTeamRepository extends BasePrismaService<
  typeof prisma.groupTeam,
  Prisma.GroupTeamWhereInput,
  Prisma.GroupTeamSelect,
  Prisma.GroupTeamInclude
> {
  constructor() {
    super(prisma.groupTeam);
  }

  async findAll(
    where: Prisma.GroupTeamWhereInput = {},
    paginator?: Paginator,
    options?: {
      select?: Prisma.GroupTeamSelect;
      include?: Prisma.GroupTeamInclude;
    }
  ) {
    return this.find({ query: where }, paginator, options);
  }

  async findById(
    id: string,
    options?: {
      select?: Prisma.GroupTeamSelect;
      include?: Prisma.GroupTeamInclude;
    }
  ) {
    return this.findOne({ id }, options);
  }

  async createGroupTeam(data: Prisma.GroupTeamCreateInput) {
    return prisma.groupTeam.create({ data });
  }

  async updateGroupTeam(id: string, data: Prisma.GroupTeamUpdateInput) {
    return this.update({ id }, data);
  }
}

export default GroupTeamRepository;
