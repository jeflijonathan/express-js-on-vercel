import BasePrismaService, { Paginator } from "@common/base/basePrismaService";
import { Prisma } from "@prisma/client";
import { prisma } from "src/config/database/client";

class PasswordResetTokenRepository extends BasePrismaService<
  typeof prisma.passwordResetToken,
  Prisma.PasswordResetTokenWhereInput,
  Prisma.PasswordResetTokenSelect,
  Prisma.PasswordResetTokenInclude
> {
  constructor() {
    super(prisma.passwordResetToken);
  }

  async findAll(
    where: Prisma.PasswordResetTokenWhereInput = {},
    paginator?: Paginator,
    options?: {
      select?: Prisma.PasswordResetTokenSelect;
      include?: Prisma.PasswordResetTokenInclude;
    }
  ) {
    return this.find({ query: where }, paginator, options);
  }

  async findById(
    id: string,
    options?: {
      select?: Prisma.PasswordResetTokenSelect;
      include?: Prisma.PasswordResetTokenInclude;
    }
  ) {
    return this.findOne({ id }, options);
  }

  async createToken(data: Prisma.PasswordResetTokenCreateInput) {
    const { user, token } = data;

    const { hashToken } = await import("@common/utils/hash");
    const tokenHash = data.tokenHash || hashToken(token as string);

    return prisma.passwordResetToken.upsert({
      where: { userId: (user as any).connect.id },
      update: {
        token,
        tokenHash,
        used: false,
        expiresAt: data.expiresAt,
      },
      create: {
        ...data,
        tokenHash,
      },
    });
  }

  async markTokenAsUsed(tokenHash: string) {
    return prisma.passwordResetToken.updateMany({
      where: { tokenHash },
      data: { used: true },
    });
  }

  async updateToken(id: string, data: Prisma.PasswordResetTokenUpdateInput) {
    return this.update({ id }, data);
  }

  async deleteToken(id: string) {
    return this.delete({ id });
  }

  async deleteExpiredTokens() {
    return prisma.passwordResetToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}

export default PasswordResetTokenRepository;
