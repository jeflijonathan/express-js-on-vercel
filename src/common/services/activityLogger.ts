import { Request } from "express";
import { ActivityLogService } from "@domains/activityLog/activityLog.service";

export const logActivity = async (req: Request, action: string, description?: string) => {
    const userId = (req as any).user?.id;
    if (!userId) return;

    const ipAddress = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || req.ip;
    const userAgent = req.headers["user-agent"];

    try {
        await ActivityLogService.createLog({
            userId,
            action,
            description,
            ipAddress,
            userAgent,
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};
