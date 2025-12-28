import BasePrismaService, {
  Paginator,
  Sorter,
} from "@common/base/basePrismaService";
import { Prisma } from "@prisma/client";
import { prisma } from "src/config/database/client";
import { hashToken } from "@common/utils/hash";

class UserRepository extends BasePrismaService<
  typeof prisma.user,
  Prisma.UserWhereInput,
  Prisma.UserSelect,
  Prisma.UserInclude
> {
  constructor() {
    super(prisma.user);
  }

  async findAll(
    where: Prisma.UserWhereInput = {},
    paginator?: Paginator,
    options?: {
      select?: Prisma.UserSelect;
      include?: Prisma.UserInclude;
    },
    sorter?: Sorter
  ) {
    return this.find({ query: where, sorter }, paginator, options);
  }

  async findById(
    id: string,
    options?: { select?: Prisma.UserSelect; include?: Prisma.UserInclude }
  ) {
    return this.findOne({ id }, options);
  }

  async createUser(data: Prisma.UserCreateInput) {
    return this.create({ data });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    return this.update({ id }, data);
  }

  async createRefreshToken(data: Prisma.RefreshTokenCreateInput) {
    // Defensive: ensure tokenHash is present. Some callers may not supply it.
    const payload: any = { ...data };
    if (!payload.tokenHash && payload.token) {
      payload.tokenHash = hashToken(payload.token as string);
    }

    return prisma.refreshToken.create({ data: payload });
  }

  async findRefreshToken(token: string) {
    const tokenHash = hashToken(token);
    return prisma.refreshToken.findFirst({
      where: { tokenHash },
    });
  }

  async revokeRefreshToken(token: string) {
    const tokenHash = hashToken(token);
    return prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { isRevoked: true },
    });
  }

  async deleteRefreshToken(token: string) {
    const tokenHash = hashToken(token);
    return prisma.refreshToken.deleteMany({
      where: { tokenHash },
    });
  }

  async deleteExpiredTokens() {
    return prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}

export default UserRepository;
