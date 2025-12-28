import BaseController from "@common/base/baseController";
import { RefreshTokenService } from "./refreshToken.service";
import { authenticateToken, authorizeRoles } from "@middlewares/auth";
import { QueryParsed } from "@common/QueryParsed";
import { logActivity } from "@common/services/activityLogger";
import { prisma } from "src/config/database/client";

class RefreshTokenController extends BaseController {
    constructor() {
        super();
        this.getAll();
        this.revokeToken();
        this.revokeBatch();
        this.revokeAllByUser();
    }

    getAll() {
        this.router.get(
            "/refresh-tokens",
            authenticateToken,
            authorizeRoles("MANAJER"),
            async (req, res) => {
                try {
                    const params = QueryParsed(req);
                    const result = await RefreshTokenService.findAll(params);

                    this.handleSuccess(
                        res,
                        {
                            data: result.data,
                            pagination: {
                                page: result.meta.page,
                                limit: result.meta.limit,
                                total_items: result.meta.total,
                                total_pages: result.meta.totalPages,
                            },
                        },
                        "Refresh tokens fetched successfully"
                    );
                } catch (err: any) {
                    this.handleError(res, err);
                }
            }
        );
    }

    revokeToken() {
        this.router.delete(
            "/refresh-tokens/:id",
            authenticateToken,
            authorizeRoles("MANAJER"),
            async (req, res) => {
                try {
                    const deletedToken = await RefreshTokenService.revokeToken(req.params.id);
                    await logActivity(req, "REVOKE_SESSION", `Revoked specific session: ${req.params.id}`);

                    const currentRefreshToken = req.cookies?.refreshToken;
                    let isCurrentSession = false;

                    if (currentRefreshToken && deletedToken.token === currentRefreshToken) {
                        res.clearCookie("refreshToken");
                        isCurrentSession = true;
                    }

                    this.handleSuccess(res, { isCurrentSession }, "Refresh token revoked successfully");
                } catch (err: any) {
                    this.handleError(res, err);
                }
            }
        );
    }

    revokeAllByUser() {
        this.router.delete(
            "/refresh-tokens/user/:userId",
            authenticateToken,
            authorizeRoles("MANAJER"),
            async (req, res) => {
                try {
                    console.log("=======");
                    console.log(req.params.userId);
                    console.log("=======");
                    await RefreshTokenService.revokeAllByUser(req.params.userId);
                    await logActivity(req, "REVOKE_ALL_SESSIONS", `Revoked all sessions for user: ${req.params.userId}`);

                    const currentRefreshToken = req.cookies?.refreshToken;
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
                } catch (err: any) {
                    this.handleError(res, err);
                }
            }
        );
    }

    revokeBatch() {
        this.router.post(
            "/refresh-tokens/revoke-batch",
            authenticateToken,
            authorizeRoles("MANAJER"),
            async (req, res) => {
                try {
                    const { ids } = req.body;
                    if (!ids || !Array.isArray(ids) || ids.length === 0) {
                        throw new Error("Invalid IDs provided");
                    }

                    const currentRefreshToken = req.cookies?.refreshToken;
                    let isCurrentSession = false;

                    if (currentRefreshToken) {
                        // Check if the current token is in the list of IDs being revoked
                        const isRevokingCurrent = await prisma.refreshToken.findFirst({
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

                    await RefreshTokenService.revokeBatch(ids);
                    await logActivity(req, "REVOKE_BATCH_SESSIONS", `Revoked ${ids.length} sessions`);

                    this.handleSuccess(res, { isCurrentSession }, "Sessions revoked successfully");
                } catch (err: any) {
                    this.handleError(res, err);
                }
            }
        );
    }
}

export default RefreshTokenController;
