import BaseController from "@common/base/baseController";
import { ActivityLogService } from "./activityLog.service";
import { authenticateToken, authorizeRoles } from "@middlewares/auth";
import { QueryParsed } from "@common/QueryParsed";

class ActivityLogController extends BaseController {
    constructor() {
        super();
        this.getAll();
    }

    getAll() {
        this.router.get(
            "/activity-logs",
            authenticateToken,
            authorizeRoles("MANAJER"),
            async (req, res) => {
                try {
                    const params = QueryParsed(req);
                    const result = await ActivityLogService.findAll(params);

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
                        "Activity logs fetched successfully"
                    );
                } catch (err: any) {
                    this.handleError(res, err);
                }
            }
        );
    }

}

export default ActivityLogController;
