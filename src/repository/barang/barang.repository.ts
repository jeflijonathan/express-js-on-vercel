import BasePrismaService, { Paginator, Sorter } from "@common/base/basePrismaService";
import { Prisma } from "@prisma/client";
import { prisma } from "src/config/database/client";

class BarangRepository extends BasePrismaService<
  typeof prisma.barang,
  Prisma.BarangWhereInput,
  Prisma.BarangSelect,
  Prisma.BarangInclude
> {
  constructor() {
    super(prisma.barang);
  }

  async findAll(
    where: Prisma.BarangWhereInput = {}, paginator?: Paginator, options?: {
      select?: Prisma.BarangSelect;
      include?: Prisma.BarangInclude;
    }, sorter?: Sorter | undefined) {
    return this.find({ query: where }, paginator, options);
  }

  async findById(
    id: number,
    options?: {
      select?: Prisma.BarangSelect;
      include?: Prisma.BarangInclude;
    }
  ) {
    return this.findOne({ id }, options);
  }

  async createCategoryItem(data: Prisma.BarangCreateInput) {
    return this.create({ data });
  }

  async updateCategoryItem(id: number, data: Prisma.BarangUpdateInput) {
    return this.update({ id }, data);
  }

  async deleteCategoryItem(id: number) {
    return this.delete({ id });
  }
}

export default BarangRepository;
