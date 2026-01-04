import BasePrismaService, {
  Paginator,
  Sorter,
} from "@common/base/basePrismaService";
import { Prisma } from "@prisma/client";
import { prisma } from "src/config/database/client";

class TarifBongkarMuatRepository extends BasePrismaService<
  typeof prisma.tarifBongkar,
  Prisma.TarifBongkarWhereInput,
  Prisma.TarifBongkarSelect,
  Prisma.TarifBongkarInclude
> {
  constructor() {
    super(prisma.tarifBongkar);
  }

  async findAll(
    where: Prisma.TarifBongkarWhereInput = {},
    paginator?: Paginator,
    options?: {
      select?: Prisma.TarifBongkarSelect;
      include?: Prisma.TarifBongkarInclude;
    },
    sorter?: Sorter
  ) {
    return this.find({ query: where, sorter: sorter }, paginator, options);
  }

  async findById(
    id: number,
    options?: {
      select?: Prisma.TarifBongkarSelect;
      include?: Prisma.TarifBongkarInclude;
    }
  ) {
    return this.findOne({ id }, options);
  }

  async createTarifBongkar(data: Prisma.TarifBongkarCreateInput) {
    return this.create({ data });
  }

  async updateTarifBongkar(id: number, data: Prisma.TarifBongkarUpdateInput) {
    return this.update({ id }, data);
  }

  async deleteTarifBongkar(id: number) {
    return this.delete({ id });
  }

  async deleteMany(where: Prisma.TarifBongkarWhereInput) {
    return this.model.deleteMany({ where });
  }

}

export default TarifBongkarMuatRepository;
