import BasePrismaService, { Paginator } from "@common/base/basePrismaService";
import { Prisma } from "@prisma/client";
import { prisma } from "src/config/database/client";

class TradeTypeRepository extends BasePrismaService<
  typeof prisma.tradeType,
  Prisma.TradeTypeWhereInput,
  Prisma.TradeTypeSelect,
  Prisma.TradeTypeInclude
> {
  constructor() {
    super(prisma.tradeType);
  }

  async findAll(
    where: Prisma.TradeTypeWhereInput = {},
    paginator?: Paginator,
    options?: {
      select?: Prisma.TradeTypeSelect;
      include?: Prisma.TradeTypeInclude;
    }
  ) {
    return this.find({ query: where }, paginator, options);
  }

  async findById(
    id: number,
    options?: {
      select?: Prisma.TradeTypeSelect;
      include?: Prisma.TradeTypeInclude;
    }
  ) {
    return this.findOne({ id }, options);
  }

  async createTradeType(data: Prisma.TradeTypeCreateInput) {
    return prisma.tradeType.create({ data });
  }

  async updateTradeType(id: number, data: Prisma.TradeTypeUpdateInput) {
    return this.update({ id }, data);
  }

  async deleteTradeType(id: number) {
    return this.delete({ id });
  }
}

export default TradeTypeRepository;
