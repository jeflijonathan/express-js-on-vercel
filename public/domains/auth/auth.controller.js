"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchError_1 = require("@common/handler/errors/catchError");
const baseController_1 = __importDefault(require("@common/base/baseController"));
const auth_service_1 = __importDefault(require("./auth.service"));
const activityLogger_1 = require("@common/services/activityLogger");
const auth_1 = require("@middlewares/auth");
class AuthController extends baseController_1.default {
    constructor() {
        super();
        this.userService = new auth_service_1.default();
        this.login();
        this.refresh();
        this.editProfile();
        this.logout();
        this.sendVerification();
        this.verifyCode();
        this.changePassword();
    }
    verifyCode() {
        this.router.post("/verify-code", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userService.handleVerifyCode(req.body);
                res.status(200).json({
                    status: "Success",
                    statusCode: 200,
                    message: "Code verified successfully",
                    data: result,
                });
            }
            catch (error) {
                console.error("Verify code error:", error);
                res.status(error.statusCode || 500).json({
                    status: "Error",
                    statusCode: error.statusCode || 500,
                    message: error.message || "Failed to verify code",
                });
            }
        }));
    }
    sendVerification() {
        this.router.post("/send-verification", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email) {
                    res.status(400).json({
                        status: "Error",
                        statusCode: 400,
                        message: "Email is required",
                    });
                }
                const result = yield this.userService.handleForgotPassword(email);
                res.status(200).json({
                    status: "Success",
                    statusCode: 200,
                    message: "Verification email sent",
                    data: result,
                });
            }
            catch (error) {
                console.error("Send verification error:", error);
                res.status(error.statusCode || 500).json({
                    status: "Error",
                    statusCode: error.statusCode || 500,
                    message: error.message || "Failed to send verification email",
                });
            }
        }));
    }
    changePassword() {
        this.router.post("/reset-password", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userService.handleResetPassword(req.body);
                res.status(200).json({
                    status: "Success",
                    statusCode: 200,
                    message: "Password reset successfully",
                    data: result,
                });
            }
            catch (error) {
                console.error("Reset password error:", error);
                res.status(error.statusCode || 500).json({
                    status: "Error",
                    statusCode: error.statusCode || 500,
                    message: error.message || "Failed to reset password",
                });
            }
        }));
    }
    login() {
        this.router.post("/login", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const ipAddress = req.ip || req.headers["x-forwarded-for"] || "Unknown";
                const userAgent = req.headers["user-agent"] || "Unknown";
                const { user, accessToken, refreshToken } = yield this.userService.handleLogin(req.body, ipAddress, userAgent);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                req.user = user;
                yield (0, activityLogger_1.logActivity)(req, "LOGIN", `User logged in: ${user.username}`);
                return this.handleSuccess(res, {
                    user,
                    accessToken,
                }, "Login successful");
            }
            catch (error) {
                return this.handleError(res, {
                    statusCode: error.statusCode || 500,
                    message: error.message || "Internal Server Error",
                });
            }
        }));
    }
    refresh() {
        this.router.post("/refresh", auth_1.authenticateToken, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenFromClient = req.cookies.refreshToken;
                if (!tokenFromClient) {
                    return this.handleError(res, {
                        statusCode: 401,
                        message: "Refresh token missing",
                    });
                }
                const result = yield this.userService.handleRefreshToken(tokenFromClient);
                if (!result || !result.accessToken || !result.refreshToken) {
                    return this.handleError(res, {
                        statusCode: 500,
                        message: "Token refresh failed: Service returned incomplete result.",
                    });
                }
                res.cookie("refreshToken", result.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                req.user = result.user;
                yield (0, activityLogger_1.logActivity)(req, "REFRESH_TOKEN", "User refreshed access token");
                return this.handleSuccess(res, {
                    accessToken: result.accessToken,
                }, "Token refreshed successfully");
            }
            catch (error) {
                console.log("@RefreshRoute:error", error);
                return this.handleError(res, {
                    statusCode: error.statusCode || 500,
                    message: error.message || "Internal Server Error",
                });
            }
        }));
    }
    logout() {
        this.router.get("/logout", auth_1.authenticateToken, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            yield (0, activityLogger_1.logActivity)(req, "LOGOUT");
            if (refreshToken) {
                yield (0, catchError_1.catchError)(this.userService.revokeRefreshToken(refreshToken));
                res.clearCookie("refreshToken");
            }
            return this.handleSuccess(res, [], "Logout successful");
        }));
    }
    editProfile() {
        this.router.put("/profile/:id", auth_1.authenticateToken, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const [error, result] = yield (0, catchError_1.catchError)(this.userService.handleEditProfile(userId, req.body));
            if (error)
                return this.handleError(res, error);
            yield (0, activityLogger_1.logActivity)(req, "UPDATE_PROFILE", `User ID: ${userId}`);
            return this.handleSuccess(res, result, "Profile updated successfully");
        }));
    }
}
exports.default = AuthController;
