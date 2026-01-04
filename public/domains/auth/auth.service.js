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
const encrypt_1 = require("@common/utils/encrypt");
const jwtService_1 = __importDefault(require("src/services/jwtService"));
const repository_1 = require("src/repository");
const statusCodes_1 = require("@common/consts/statusCodes");
const hash_1 = require("@common/utils/hash");
const userLogin_dto_1 = __importDefault(require("./dto/userLogin.dto"));
const mail_1 = require("@config/mail/mail");
const verifyCode_dto_1 = __importDefault(require("./dto/verifyCode.dto"));
const resetPassword_dto_1 = __importDefault(require("./dto/resetPassword.dto"));
const crypto_1 = __importDefault(require("crypto"));
const profileUpdate_dto_1 = __importDefault(require("./dto/profileUpdate.dto"));
class AuthService {
    constructor() {
        this.jwtService = new jwtService_1.default();
        this._userRepository = new repository_1.UserRepository();
        this._employeeRepository = new repository_1.EmployeeRepository();
        this._roleRepository = new repository_1.RoleRepository();
        this._passwordResetTokenRepository = new repository_1.PasswordResetTokenRepository();
    }
    handleLogin(body, ipAddress, userAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const parsed = yield userLogin_dto_1.default.fromLogin(body);
            const { username, password } = parsed;
            const user = yield this._userRepository.findOne({
                username: username,
            }, {
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
                    statusCode: statusCodes_1.StatusBadRequest,
                    message: "Invalid username or password",
                };
            }
            const isValidPassword = yield (0, encrypt_1.compareEncrypted)(password, user.password);
            if (!isValidPassword) {
                throw {
                    statusCode: statusCodes_1.StatusBadRequest,
                    message: "Invalid username or password",
                };
            }
            if (!((_a = user.employee) === null || _a === void 0 ? void 0 : _a.status)) {
                throw {
                    statusCode: statusCodes_1.StatusBadRequest,
                    message: "Your account is inactive. Please contact administrator.",
                };
            }
            // Cleanup expired tokens
            yield this._userRepository.deleteExpiredTokens();
            const refreshToken = this.jwtService.generateRefreshToken({
                id: user.id,
            });
            const session = yield this._userRepository.createRefreshToken({
                token: refreshToken,
                tokenHash: (0, hash_1.hashToken)(refreshToken),
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
        });
    }
    handleRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Cleanup expired tokens
                yield this._userRepository.deleteExpiredTokens();
                const decoded = this.jwtService.verifyRefreshToken(refreshToken);
                if (!decoded || typeof decoded === "string") {
                    throw {
                        statusCode: 401,
                        message: "Invalid refresh token",
                    };
                }
                const storedToken = yield this._userRepository.findRefreshToken(refreshToken);
                if (!storedToken ||
                    storedToken.isRevoked ||
                    new Date() > storedToken.expiresAt) {
                    throw {
                        statusCode: 401,
                        message: "Refresh token expired or revoked",
                    };
                }
                const user = yield this._userRepository.findById(storedToken.userId, {
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
                if (!((_a = user.employee) === null || _a === void 0 ? void 0 : _a.status)) {
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
            }
            catch (error) {
                console.log("@UserService:handleRefreshToken:error", error);
                throw error;
            }
        });
    }
    revokeRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._userRepository.revokeRefreshToken(refreshToken);
            }
            catch (error) {
                console.log("@UserService:revokeRefreshToken:error", error);
                throw error;
            }
        });
    }
    handleForgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findOne({ employee: { email } }, { include: { employee: true } });
            if (!user) {
                return { message: "Verification email sent" };
            }
            yield this._passwordResetTokenRepository.deleteExpiredTokens();
            const token = Math.floor(100000 + Math.random() * 900000).toString();
            const tokenHash = (0, hash_1.hashToken)(token);
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
            yield this._passwordResetTokenRepository.createToken({
                token,
                tokenHash,
                user: { connect: { id: user.id } },
                expiresAt: expiresAt,
                used: false,
            });
            yield (0, mail_1.sendMail)({
                to: email,
                subject: "Reset Password",
                html: `<p>Halo ${user.employee.namaLengkap},</p>
           <p>Code verifikasi Anda adalah: ${token}</p>`,
            });
            return { message: "Verification email sent" };
        });
    }
    handleVerifyCode(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsed = yield verifyCode_dto_1.default.fromVerifyCode(body);
            const { email, codeVerification } = parsed;
            const user = yield this._userRepository.findOne({ employee: { email } }, { include: { employee: true } });
            if (!user) {
                throw { statusCode: statusCodes_1.StatusBadRequest, message: "User not found" };
            }
            const tokenHash = crypto_1.default
                .createHash("sha256")
                .update(codeVerification)
                .digest("hex");
            const tokenRecord = yield this._passwordResetTokenRepository.findOne({
                tokenHash,
                userId: user.id,
                used: false,
                expiresAt: { gte: new Date() },
            });
            if (!tokenRecord) {
                throw {
                    statusCode: statusCodes_1.StatusBadRequest,
                    message: "Invalid or expired verification code",
                };
            }
            return { resetToken: tokenHash };
        });
    }
    handleResetPassword(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsed = yield resetPassword_dto_1.default.fromResetPassword(body);
            const { resetToken, newPassword } = parsed;
            const tokenRecord = yield this._passwordResetTokenRepository.findOne({
                tokenHash: resetToken,
                used: false,
                expiresAt: { gte: new Date() },
            });
            if (!tokenRecord) {
                throw {
                    statusCode: statusCodes_1.StatusBadRequest,
                    message: "Reset token invalid or expired",
                };
            }
            const hashedPassword = yield (0, encrypt_1.encrypt)(newPassword);
            yield this._userRepository.updateUser(tokenRecord.userId, {
                password: hashedPassword,
            });
            yield this._passwordResetTokenRepository.markTokenAsUsed(resetToken);
            return { message: "Password reset successfully" };
        });
    }
    handleEditProfile(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parsed = yield profileUpdate_dto_1.default.fromUpdateProfile(body);
                const { newPassword, username, email, namaLengkap } = parsed;
                const currUser = yield this._userRepository.findById(id);
                if (!currUser) {
                    throw { statusCode: statusCodes_1.StatusBadRequest, message: "User not found" };
                }
                if (email) {
                    const existingEmail = yield this._employeeRepository.findOne({
                        email: email,
                        id: { not: currUser.employeeId },
                    });
                    if (existingEmail) {
                        throw { statusCode: statusCodes_1.StatusBadRequest, message: "Email already in use" };
                    }
                }
                if (username) {
                    const existingUsername = yield this._userRepository.findOne({
                        username: username,
                        id: { not: id },
                    });
                    if (existingUsername) {
                        throw {
                            statusCode: statusCodes_1.StatusBadRequest,
                            message: "Username already in use",
                        };
                    }
                }
                var hashedPassword = undefined;
                if (newPassword) {
                    hashedPassword = yield (0, encrypt_1.encrypt)(newPassword);
                }
                const user = yield this._userRepository.updateUser(id, {
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
            }
            catch (error) {
                console.log("@UserService:editProfile:error", error);
                throw error;
            }
        });
    }
}
exports.default = AuthService;
