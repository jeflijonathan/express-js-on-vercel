import BasePrismaService, { Paginator } from "@common/base/basePrismaService";
import { Prisma } from "@prisma/client";
import { prisma } from "src/config/database/client";

class TransportMethodRepository extends BasePrismaService<
  typeof prisma.angkut,
  Prisma.AngkutWhereInput,
  Prisma.AngkutSelect,
  Prisma.AngkutInclude
> {
  constructor() {
    super(prisma.angkut);
  }

  async findAll(
    where: Prisma.AngkutWhereInput = {},
    paginator?: Paginator,
    options?: {
      select?: Prisma.AngkutSelect;
      include?: Prisma.AngkutInclude;
    }
  ) {
    return this.find({ query: where }, paginator, options);
  }

  async findById(
    id: number,
    options?: {
      select?: Prisma.AngkutSelect;
      include?: Prisma.AngkutInclude;
    }
  ) {
    return this.findOne({ id }, options);
  }

  async createTransportMethod(data: Prisma.AngkutCreateInput) {
    return prisma.angkut.create({ data });
  }

  async updateTransportMethod(id: number, data: Prisma.AngkutUpdateInput) {
    return this.update({ id }, data);
  }

  async deleteTransportMethod(id: number) {
    return this.delete({ id });
  }
}

export default TransportMethodRepository;
