import { addDays } from "date-fns";
import { prisma } from "src/config/database/client";
import { hashToken } from "@common/utils/hash";

interface RefreshToken {
  token: string;
  userId: string;
  ipAddress?: string | null;
  userAgent?: string;
}

const storeRefreshToken = async ({
  token,
  userId,
  ipAddress,
  userAgent,
}: RefreshToken) => {
  const expiresAt = addDays(new Date(), 7);

  return prisma.refreshToken.create({
    data: {
      token,
      tokenHash: hashToken(token),
      userId,
      ipAddress,
      userAgent,
      expiresAt,
    },
  });
};
export default storeRefreshToken;
