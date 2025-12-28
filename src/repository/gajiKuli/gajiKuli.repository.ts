import BasePrismaService, {
  Paginator,
  Sorter,
} from "@common/base/basePrismaService";
import { Prisma } from "@prisma/client";
import { prisma } from "src/config/database/client";

class GajiKuliRepository extends BasePrismaService<
  typeof prisma.gaji,
  Prisma.GajiWhereInput,
  Prisma.GajiSelect,
  Prisma.GajiInclude
> {
  constructor() {
    super(prisma.gaji);
  }

  get prisma() {
    return prisma;
  }

  async findAll(
    where: Prisma.GajiWhereInput = {},
    paginator?: Paginator,
    options?: {
      select?: Prisma.GajiSelect;
      include?: Prisma.GajiInclude;
    },
    sorter?: Sorter
  ) {
    return this.find({ query: where, sorter: sorter }, paginator, options);
  }

  async findById(
    id: number,
    options?: {
      select?: Prisma.GajiSelect;
      include?: Prisma.GajiInclude;
    }
  ) {
    return this.findOne({ id }, options);
  }

  async createGajiKuli(data: Prisma.GajiCreateInput) {
    return this.create({ data });
  }

  async updateGajiKuli(id: number, data: Prisma.GajiUpdateInput) {
    return this.update({ id }, data);
  }

  async deleteGajiKuli(id: number) {
    return this.delete({ id });
  }
}

export default GajiKuliRepository;
