import { Request, Response } from "express";
import { catchError } from "@common/handler/errors/catchError";
import BaseController from "@common/base/baseController";
import { UserModel } from "./auth.type";
import AuthService from "./auth.service";
import { logActivity } from "@common/services/activityLogger";
import { authenticateToken, authorizeRoles } from "@middlewares/auth";

class AuthController extends BaseController {
  private userService = new AuthService();

  constructor() {
    super();
    this.login();
    this.refresh();
    this.editProfile();
    this.logout();
    this.sendVerification();
    this.verifyCode();
    this.changePassword();
  }

  verifyCode() {
    this.router.post("/verify-code", async (req: Request, res: Response) => {
      try {
        const result = await this.userService.handleVerifyCode(req.body);

        res.status(200).json({
          status: "Success",
          statusCode: 200,
          message: "Code verified successfully",
          data: result,
        });
      } catch (error: any) {
        console.error("Verify code error:", error);
        res.status(error.statusCode || 500).json({
          status: "Error",
          statusCode: error.statusCode || 500,
          message: error.message || "Failed to verify code",
        });
      }
    });
  }

  sendVerification() {
    this.router.post(
      "/send-verification",
      async (req: Request, res: Response) => {
        try {
          const { email } = req.body;

          if (!email) {
            res.status(400).json({
              status: "Error",
              statusCode: 400,
              message: "Email is required",
            });
          }

          const result = await this.userService.handleForgotPassword(email);

          res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Verification email sent",
            data: result,
          });
        } catch (error: any) {
          console.error("Send verification error:", error);
          res.status(error.statusCode || 500).json({
            status: "Error",
            statusCode: error.statusCode || 500,
            message: error.message || "Failed to send verification email",
          });
        }
      }
    );
  }

  changePassword() {
    this.router.post("/reset-password", async (req: Request, res: Response) => {
      try {
        const result = await this.userService.handleResetPassword(req.body);

        res.status(200).json({
          status: "Success",
          statusCode: 200,
          message: "Password reset successfully",
          data: result,
        });
      } catch (error: any) {
        console.error("Reset password error:", error);
        res.status(error.statusCode || 500).json({
          status: "Error",
          statusCode: error.statusCode || 500,
          message: error.message || "Failed to reset password",
        });
      }
    });
  }

  login() {
    this.router.post("/login", async (req: Request, res: Response) => {
      try {
        const ipAddress = req.ip || (req.headers["x-forwarded-for"] as string) || "Unknown";
        const userAgent = req.headers["user-agent"] || "Unknown";

        const { user, accessToken, refreshToken } =
          await this.userService.handleLogin(req.body, ipAddress, userAgent);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        (req as any).user = user;
        await logActivity(req, "LOGIN", `User logged in: ${user.username}`);

        return this.handleSuccess(
          res,
          {
            user,
            accessToken,
          },
          "Login successful"
        );
      } catch (error: any) {
        return this.handleError(res, {
          statusCode: error.statusCode || 500,
          message: error.message || "Internal Server Error",
        });
      }
    });
  }

  refresh() {
    this.router.post("/refresh", authenticateToken,
      async (req: Request, res: Response) => {
        try {
          const tokenFromClient = req.cookies.refreshToken;

          if (!tokenFromClient) {
            return this.handleError(res, {
              statusCode: 401,
              message: "Refresh token missing",
            });
          }

          const result = await this.userService.handleRefreshToken(
            tokenFromClient
          );

          if (!result || !result.accessToken || !result.refreshToken) {
            return this.handleError(res, {
              statusCode: 500,
              message:
                "Token refresh failed: Service returned incomplete result.",
            });
          }

          res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          (req as any).user = result.user;
          await logActivity(req, "REFRESH_TOKEN", "User refreshed access token");

          return this.handleSuccess(
            res,
            {
              accessToken: result.accessToken,
            },
            "Token refreshed successfully"
          );
        } catch (error: any) {
          console.log("@RefreshRoute:error", error);
          return this.handleError(res, {
            statusCode: error.statusCode || 500,
            message: error.message || "Internal Server Error",
          });
        }
      });
  }

  logout() {
    this.router.get("/logout", authenticateToken, async (req: Request, res: Response) => {
      const refreshToken = req.cookies.refreshToken;

      await logActivity(req, "LOGOUT");

      if (refreshToken) {
        await catchError(this.userService.revokeRefreshToken(refreshToken));
        res.clearCookie("refreshToken");
      }

      return this.handleSuccess(res, [], "Logout successful");
    });
  }

  editProfile() {
    this.router.put("/profile/:id", authenticateToken, async (req: Request, res: Response) => {
      const userId = req.params.id;

      const [error, result] = await catchError<UserModel[]>(
        this.userService.handleEditProfile(userId, req.body)
      );

      if (error) return this.handleError(res, error);

      await logActivity(req, "UPDATE_PROFILE", `User ID: ${userId}`);

      return this.handleSuccess(res, result, "Profile updated successfully");
    });
  }
}
export default AuthController;
