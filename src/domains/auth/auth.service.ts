import { compareEncrypted, encrypt } from "@common/utils/encrypt";
import JwtServices from "src/services/jwtService";
import { Prisma } from "@prisma/client";
import {
  EmployeeRepository,
  PasswordResetTokenRepository,
  RoleRepository,
  UserRepository,
} from "src/repository";
import { StatusBadRequest } from "@common/consts/statusCodes";
import { hashToken } from "@common/utils/hash";
import UserLoginDTO, { IUserLoginDTO } from "./dto/userLogin.dto";
import { sendMail } from "@config/mail/mail";
import VerifyCodeDTO, { IVerifyCodeDTO } from "./dto/verifyCode.dto";
import ResetPasswordDTO, { IResetPasswordDTO } from "./dto/resetPassword.dto";
import crypto from "crypto";
import UpdateProfileDTO, { IProfilePayload } from "./dto/profileUpdate.dto";

class AuthService {
  private jwtService = new JwtServices();

  _userRepository;
  _employeeRepository;
  _roleRepository;
  _passwordResetTokenRepository;

  constructor() {
    this._userRepository = new UserRepository();
    this._employeeRepository = new EmployeeRepository();
    this._roleRepository = new RoleRepository();
    this._passwordResetTokenRepository = new PasswordResetTokenRepository();
  }

  async handleLogin(body: IUserLoginDTO, ipAddress: string, userAgent: string) {
    const parsed = await UserLoginDTO.fromLogin(body);

    const { username, password } = parsed;

    const user = await this._userRepository.findOne(
      {
        username: username,
      },
      {
        include: {
          employee: {
            include: {
              role: true,
            },
          },
        },
      }
    );

    if (!user) {
      throw {
        statusCode: StatusBadRequest,
        message: "Invalid username or password",
      };
    }

    const isValidPassword = await compareEncrypted(password, user.password);

    if (!isValidPassword) {
      throw {
        statusCode: StatusBadRequest,
        message: "Invalid username or password",
      };
    }

    if (!user.employee?.status) {
      throw {
        statusCode: StatusBadRequest,
        message: "Your account is inactive. Please contact administrator.",
      };
    }

    // Cleanup expired tokens
    await this._userRepository.deleteExpiredTokens();

    const refreshToken = this.jwtService.generateRefreshToken({
      id: user.id,
    });

    const session = await this._userRepository.createRefreshToken({
      token: refreshToken,
      tokenHash: hashToken(refreshToken),
      user: { connect: { id: user.id } },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress: ipAddress,
      userAgent: userAgent,
    });

    const accessToken = this.jwtService.generateAccessToken({
      id: user.id,
      sessionId: session.id,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async handleRefreshToken(refreshToken: string) {
    try {
      // Cleanup expired tokens
      await this._userRepository.deleteExpiredTokens();

      const decoded = this.jwtService.verifyRefreshToken(refreshToken);

      if (!decoded || typeof decoded === "string") {
        throw {
          statusCode: 401,
          message: "Invalid refresh token",
        };
      }

      const storedToken = await this._userRepository.findRefreshToken(
        refreshToken
      );

      if (
        !storedToken ||
        storedToken.isRevoked ||
        new Date() > storedToken.expiresAt
      ) {
        throw {
          statusCode: 401,
          message: "Refresh token expired or revoked",
        };
      }

      const user = await this._userRepository.findById(storedToken.userId, {
        include: {
          employee: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user) {
        throw {
          statusCode: 401,
          message: "User not found",
        };
      }

      if (!user.employee?.status) {
        throw {
          statusCode: 401,
          message: "Your account is inactive. Please contact administrator.",
        };
      }

      const newAccessToken = this.jwtService.generateAccessToken({
        id: user.id,
        sessionId: storedToken.id,
      });

      return {
        user,
        accessToken: newAccessToken,
        refreshToken,
      };
    } catch (error) {
      console.log("@UserService:handleRefreshToken:error", error);
      throw error;
    }
  }

  async revokeRefreshToken(refreshToken: string) {
    try {
      return await this._userRepository.revokeRefreshToken(refreshToken);
    } catch (error) {
      console.log("@UserService:revokeRefreshToken:error", error);
      throw error;
    }
  }

  async handleForgotPassword(email: string) {
    const user = await this._userRepository.findOne(
      { employee: { email } },
      { include: { employee: true } }
    );

    if (!user) {
      return { message: "Verification email sent" };
    }

    await this._passwordResetTokenRepository.deleteExpiredTokens();

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await this._passwordResetTokenRepository.createToken({
      token,
      tokenHash,
      user: { connect: { id: user.id } },
      expiresAt: expiresAt,
      used: false,
    });

    await sendMail({
      to: email,
      subject: "Reset Password",
      html: `<p>Halo ${user.employee.namaLengkap},</p>
           <p>Code verifikasi Anda adalah: ${token}</p>`,
    });

    return { message: "Verification email sent" };
  }

  async handleVerifyCode(body: IVerifyCodeDTO) {
    const parsed = await VerifyCodeDTO.fromVerifyCode(body);
    const { email, codeVerification } = parsed;

    const user = await this._userRepository.findOne(
      { employee: { email } },
      { include: { employee: true } }
    );

    if (!user) {
      throw { statusCode: StatusBadRequest, message: "User not found" };
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(codeVerification)
      .digest("hex");

    const tokenRecord = await this._passwordResetTokenRepository.findOne({
      tokenHash,
      userId: user.id,
      used: false,
      expiresAt: { gte: new Date() },
    });

    if (!tokenRecord) {
      throw {
        statusCode: StatusBadRequest,
        message: "Invalid or expired verification code",
      };
    }

    return { resetToken: tokenHash };
  }

  async handleResetPassword(body: IResetPasswordDTO) {
    const parsed = await ResetPasswordDTO.fromResetPassword(body);
    const { resetToken, newPassword } = parsed;

    const tokenRecord = await this._passwordResetTokenRepository.findOne({
      tokenHash: resetToken,
      used: false,
      expiresAt: { gte: new Date() },
    });

    if (!tokenRecord) {
      throw {
        statusCode: StatusBadRequest,
        message: "Reset token invalid or expired",
      };
    }

    const hashedPassword = await encrypt(newPassword);
    await this._userRepository.updateUser(tokenRecord.userId, {
      password: hashedPassword,
    });

    await this._passwordResetTokenRepository.markTokenAsUsed(resetToken);

    return { message: "Password reset successfully" };
  }

  async handleEditProfile(id: string, body: IProfilePayload) {
    try {
      const parsed = await UpdateProfileDTO.fromUpdateProfile(body);

      const { newPassword, username, email, namaLengkap } = parsed;

      const currUser = await this._userRepository.findById(id);

      if (!currUser) {
        throw { statusCode: StatusBadRequest, message: "User not found" };
      }

      if (email) {
        const existingEmail = await this._employeeRepository.findOne({
          email: email,
          id: { not: currUser.employeeId },
        });
        if (existingEmail) {
          throw { statusCode: StatusBadRequest, message: "Email already in use" };
        }
      }

      if (username) {
        const existingUsername = await this._userRepository.findOne({
          username: username,
          id: { not: id },
        });
        if (existingUsername) {
          throw {
            statusCode: StatusBadRequest,
            message: "Username already in use",
          };
        }
      }

      var hashedPassword: string | undefined = undefined;

      if (newPassword) {
        hashedPassword = await encrypt(newPassword);
      }

      const user = await this._userRepository.updateUser(id, {
        username: username,
        password: hashedPassword,
        employee: {
          update: {
            namaLengkap: namaLengkap,
            email: email,
          },
        },
      });

      return user;
    } catch (error) {
      console.log("@UserService:editProfile:error", error);
      throw error;
    }
  }
}

export default AuthService;
