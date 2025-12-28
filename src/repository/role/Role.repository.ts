import BasePrismaService, { Paginator } from "@common/base/basePrismaService";
import { Prisma } from "@prisma/client";
import { prisma } from "src/config/database/client";

class RoleRepository extends BasePrismaService<
  typeof prisma.role,
  Prisma.RoleWhereInput,
  Prisma.RoleSelect,
  Prisma.RoleInclude
> {
  constructor() {
    super(prisma.role);
  }

  async findAll(
    where: Prisma.RoleWhereInput = {},
    paginator?: Paginator,
    options?: { select?: Prisma.RoleSelect; include?: Prisma.RoleInclude }
  ) {
    return this.find({ query: where }, paginator, options);
  }

  async findById(
    id: number,
    options?: { select?: Prisma.RoleSelect; include?: Prisma.RoleInclude }
  ) {
    return this.findOne({ id }, options);
  }
}

export default RoleRepository;
