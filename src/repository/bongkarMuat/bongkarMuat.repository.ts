import BasePrismaService, {
  Paginator,
  Sorter,
} from "@common/base/basePrismaService";
import { Prisma } from "@prisma/client";
import { prisma } from "src/config/database/client";

class BongkarMuatRepository extends BasePrismaService<
  typeof prisma.sesiBongkar,
  Prisma.SesiBongkarWhereInput,
  Prisma.SesiBongkarSelect,
  Prisma.SesiBongkarInclude
> {
  constructor() {
    super(prisma.sesiBongkar);
  }

  async findAll(
    where: Prisma.SesiBongkarWhereInput = {},
    paginator?: Paginator,
    options?: {
      select?: Prisma.SesiBongkarSelect;
      include?: Prisma.SesiBongkarInclude;
    },
    sorter?: Sorter
  ) {
    return this.find({ query: where, sorter: sorter }, paginator, options);
  }

  async findById(
    id: string,
    options?: {
      select?: Prisma.SesiBongkarSelect;
      include?: Prisma.SesiBongkarInclude;
    }
  ) {
    return this.findOne({ noContainer: id }, options);
  }

  async createSesiBongkar(data: Prisma.SesiBongkarCreateInput) {
    return this.create({ data });
  }

  async updateSesiBongkar(id: string, data: Prisma.SesiBongkarUpdateInput) {
    return this.update({ noContainer: id }, data);
  }

  async deleteSesiBongkar(noContainer: string) {
    return this.delete({ noContainer });
  }
}

export default BongkarMuatRepository;
