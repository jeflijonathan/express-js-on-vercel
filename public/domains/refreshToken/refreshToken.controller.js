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
const baseController_1 = __importDefault(require("@common/base/baseController"));
const refreshToken_service_1 = require("./refreshToken.service");
const auth_1 = require("@middlewares/auth");
const QueryParsed_1 = require("@common/QueryParsed");
const activityLogger_1 = require("@common/services/activityLogger");
const client_1 = require("src/config/database/client");
class RefreshTokenController extends baseController_1.default {
    constructor() {
        super();
        this.getAll();
        this.revokeToken();
        this.revokeBatch();
        this.revokeAllByUser();
    }
    getAll() {
        this.router.get("/refresh-tokens", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const params = (0, QueryParsed_1.QueryParsed)(req);
                const result = yield refreshToken_service_1.RefreshTokenService.findAll(params);
                this.handleSuccess(res, {
                    data: result.data,
                    pagination: {
                        page: result.meta.page,
                        limit: result.meta.limit,
                        total_items: result.meta.total,
                        total_pages: result.meta.totalPages,
                    },
                }, "Refresh tokens fetched successfully");
            }
            catch (err) {
                this.handleError(res, err);
            }
        }));
    }
    revokeToken() {
        this.router.delete("/refresh-tokens/:id", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const deletedToken = yield refreshToken_service_1.RefreshTokenService.revokeToken(req.params.id);
                yield (0, activityLogger_1.logActivity)(req, "REVOKE_SESSION", `Revoked specific session: ${req.params.id}`);
                const currentRefreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                let isCurrentSession = false;
                if (currentRefreshToken && deletedToken.token === currentRefreshToken) {
                    res.clearCookie("refreshToken");
                    isCurrentSession = true;
                }
                this.handleSuccess(res, { isCurrentSession }, "Refresh token revoked successfully");
            }
            catch (err) {
                this.handleError(res, err);
            }
        }));
    }
    revokeAllByUser() {
        this.router.delete("/refresh-tokens/user/:userId", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log("=======");
                console.log(req.params.userId);
                console.log("=======");
                yield refreshToken_service_1.RefreshTokenService.revokeAllByUser(req.params.userId);
                yield (0, activityLogger_1.logActivity)(req, "REVOKE_ALL_SESSIONS", `Revoked all sessions for user: ${req.params.userId}`);
                const currentRefreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                let isCurrentSession = false;
                // If we revoked all sessions for a user, we should check if the current requester is that user
                // OR if their current session token was one of those revoked.
                // Since deleteMany doesn't return data, we check by userId if possible, 
                // or just check if the current token is now invalid (simplified: just check if target userId is current user)
                // @ts-ignore
                if (req.user && req.user.id === req.params.userId) {
                    res.clearCookie("refreshToken");
                    isCurrentSession = true;
                }
                this.handleSuccess(res, { isCurrentSession }, "All user sessions revoked successfully");
            }
            catch (err) {
                this.handleError(res, err);
            }
        }));
    }
    revokeBatch() {
        this.router.post("/refresh-tokens/revoke-batch", auth_1.authenticateToken, (0, auth_1.authorizeRoles)("MANAJER"), (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { ids } = req.body;
                if (!ids || !Array.isArray(ids) || ids.length === 0) {
                    throw new Error("Invalid IDs provided");
                }
                const currentRefreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                let isCurrentSession = false;
                if (currentRefreshToken) {
                    // Check if the current token is in the list of IDs being revoked
                    const isRevokingCurrent = yield client_1.prisma.refreshToken.findFirst({
                        where: {
                            id: { in: ids },
                            token: currentRefreshToken
                        }
                    });
                    if (isRevokingCurrent) {
                        res.clearCookie("refreshToken");
                        isCurrentSession = true;
                    }
                }
                yield refreshToken_service_1.RefreshTokenService.revokeBatch(ids);
                yield (0, activityLogger_1.logActivity)(req, "REVOKE_BATCH_SESSIONS", `Revoked ${ids.length} sessions`);
                this.handleSuccess(res, { isCurrentSession }, "Sessions revoked successfully");
            }
            catch (err) {
                this.handleError(res, err);
            }
        }));
    }
}
exports.default = RefreshTokenController;
