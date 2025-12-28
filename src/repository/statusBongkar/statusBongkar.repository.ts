import BasePrismaService, { Paginator } from "@common/base/basePrismaService";
import { Prisma } from "@prisma/client";
import { prisma } from "src/config/database/client";

class StatusInventoryRepository extends BasePrismaService<
  typeof prisma.statusBongkar,
  Prisma.StatusBongkarWhereInput,
  Prisma.StatusBongkarSelect,
  Prisma.StatusBongkarInclude
> {
  constructor() {
    super(prisma.statusBongkar);
  }

  async findAll(
    where: Prisma.StatusBongkarWhereInput = {},
    paginator?: Paginator,
    options?: {
      select?: Prisma.StatusBongkarSelect;
      include?: Prisma.StatusBongkarInclude;
    }
  ) {
    return this.find({ query: where }, paginator, options);
  }

  async findById(
    id: number,
    options?: {
      select?: Prisma.StatusBongkarSelect;
      include?: Prisma.StatusBongkarInclude;
    }
  ) {
    return this.findOne({ id }, options);
  }

  async createStatus(data: Prisma.StatusBongkarCreateInput) {
    return this.create({ data });
  }

  async updateStatus(id: number, data: Prisma.StatusBongkarUpdateInput) {
    return this.update({ id }, data);
  }

  async deleteStatus(id: number) {
    return this.delete({ id });
  }
}

export default StatusInventoryRepository;
