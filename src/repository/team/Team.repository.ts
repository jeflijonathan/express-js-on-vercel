import BasePrismaService, { Paginator } from "@common/base/basePrismaService";
import { Prisma } from "@prisma/client";
import { prisma } from "src/config/database/client";

class TeamRepository extends BasePrismaService<
  typeof prisma.team,
  Prisma.TeamWhereInput,
  Prisma.TeamSelect,
  Prisma.TeamInclude
> {
  constructor() {
    super(prisma.team);
  }

  async findAll(
    where: Prisma.TeamWhereInput = {},
    paginator?: Paginator,
    options?: { select?: Prisma.TeamSelect; include?: Prisma.TeamInclude }
  ) {
    return this.find({ query: where }, paginator, options);
  }
  async findTeam(
    where: Prisma.TeamWhereInput = {},
    options?: { select?: Prisma.TeamSelect; include?: Prisma.TeamInclude }
  ) {
    return this.findMany({ query: where }, options);
  }

  async findById(
    id: string,
    options?: { select?: Prisma.TeamSelect; include?: Prisma.TeamInclude }
  ) {
    return this.findOne({ id }, options);
  }

  async createTeam(data: Prisma.TeamCreateInput) {
    return this.createMany({ data });
  }

  async updateTeam(id: string, data: Prisma.TeamUpdateInput) {
    return this.update({ id }, data);
  }
}

export default TeamRepository;
