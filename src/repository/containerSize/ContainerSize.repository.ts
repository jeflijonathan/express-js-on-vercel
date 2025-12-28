import BasePrismaService, { Paginator } from "@common/base/basePrismaService";
import { Prisma } from "@prisma/client";
import { prisma } from "src/config/database/client";

class ContainerSizeRepository extends BasePrismaService<
  typeof prisma.containerSize,
  Prisma.ContainerSizeWhereInput,
  Prisma.ContainerSizeSelect,
  Prisma.ContainerSizeInclude
> {
  constructor() {
    super(prisma.containerSize);
  }

  async findAll(
    where: Prisma.ContainerSizeWhereInput = {},
    paginator?: Paginator,
    options?: {
      select?: Prisma.ContainerSizeSelect;
      include?: Prisma.ContainerSizeInclude;
    }
  ) {
    return this.find({ query: where }, paginator, options);
  }

  async findById(
    id: number,
    options?: {
      select?: Prisma.ContainerSizeSelect;
      include?: Prisma.ContainerSizeInclude;
    }
  ) {
    return this.findOne({ id }, options);
  }

  async createContainerSize(data: Prisma.ContainerSizeCreateInput) {
    return prisma.containerSize.create({ data });
  }

  async updateContainerSize(id: number, data: Prisma.ContainerSizeUpdateInput) {
    return this.update({ id }, data);
  }

  async deleteContainerSize(id: number) {
    return this.delete({ id });
  }
}

export default ContainerSizeRepository;
