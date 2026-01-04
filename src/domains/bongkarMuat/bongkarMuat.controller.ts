import BaseController from "@common/base/baseController";
import { ErrorType } from "@common/types";
import BongkarMuatService from "./bongkarMuat.service";
import { authenticateToken, authorizeRoles } from "@middlewares/auth";
import { QueryParsed } from "@common/QueryParsed";
import { logActivity } from "@common/services/activityLogger";

class BongkarMuatController extends BaseController {
  private bongkarMuatService;
  constructor() {
    super();
    this.bongkarMuatService = new BongkarMuatService();
    this.getAll();
    this.createImportSesiBongkarMuat();
    this.createExportSesiBongkarMuat();
    this.getById();
    this.update();
    this.delete();
  }

  getAll() {
    this.router.get("/bongkar-muat", authenticateToken, authorizeRoles("ADMIN", "MANAJER", "SPV"), async (req, res) => {
      try {
        const params = QueryParsed(req);
        const { page = 1, limit = 10 } = params;
        const { data, total } =
          await this.bongkarMuatService.findSesiBongkarMuat(req, params);

        this.handleSuccess(
          res,
          {
            data: data,
            pagination: {
              page: Number(page),
              limit: Number(limit),
              total_items: total,
              total_pages: Math.ceil(total / Number(limit)),
            },
          },
          "Bongkar Muat fetched successfully"
        );
      } catch (err: ErrorType | any) {
        this.handleError(res, err);
      }
    });
  }

  getById() {
    this.router.get("/bongkar-muat/:id", authenticateToken, authorizeRoles("ADMIN", "MANAJER", "SPV"), async (req, res) => {
      try {
        const result = await this.bongkarMuatService.findSesiBongkarMuatById(
          req.params.id
        );

        this.handleSuccess(res, result, "Successfully fetched bongkar muat");
      } catch (err: ErrorType | any) {
        this.handleError(res, err);
      }
    });
  }

  createImportSesiBongkarMuat() {
    this.router.post("/bongkar-muat/import", authenticateToken, authorizeRoles("ADMIN", "MANAJER", "SPV"), async (req, res) => {
      try {
        const result =
          await this.bongkarMuatService.handleCreateImportSesiBongkarMuat(
            req.body
          );

        await logActivity(req, "CREATE_SESI_BONGKAR_IMPORT", `Container: ${result.noContainer}`);

        this.handleSuccess(
          res,
          result,
          "Successfully created sesi bongkar muat"
        );
      } catch (err: ErrorType | any) {
        this.handleError(res, err);
      }
    });
  }

  createExportSesiBongkarMuat() {
    this.router.post("/bongkar-muat/export", authenticateToken, authorizeRoles("ADMIN", "MANAJER", "SPV"), async (req, res) => {
      try {
        const result =
          await this.bongkarMuatService.handleCreateExportSesiBongkarMuat(
            req.body
          );

        await logActivity(req, "CREATE_SESI_BONGKAR_EXPORT", `Container: ${result.noContainer}`);

        this.handleSuccess(
          res,
          result,
          "Successfully created sesi bongkar muat"
        );
      } catch (err: ErrorType | any) {
        this.handleError(res, err);
      }
    });
  }

  update() {
    this.router.put("/bongkar-muat/:id", authenticateToken, authorizeRoles("MANAJER", "SPV"), async (req: any, res) => {
      try {
        const userRole = (req as any).user?.roleName?.toUpperCase();

        const result = await this.bongkarMuatService.updateSesiBongkarMuat(
          req.params.id,
          req.body,
          userRole
        );

        await logActivity(req, "UPDATE_SESI_BONGKAR", `Container: ${result.noContainer} (Role: ${userRole})`);

        this.handleSuccess(res, result, "Successfully updated bongkar muat");
      } catch (err: ErrorType | any) {
        this.handleError(res, err);
      }
    });
  }

  delete() {
    this.router.delete(
      "/bongkar-muat/:noContainer",
      authenticateToken,
      authorizeRoles("MANAJER"),
      async (req, res) => {
        try {
          const result = await this.bongkarMuatService.deleteSesiBongkarMuat(
            req.params.noContainer
          );

          await logActivity(req, "DELETE_SESI_BONGKAR", `Container: ${req.params.noContainer}`);

          this.handleSuccess(res, result, "Successfully deleted bongkar muat");
        } catch (err: any) {
          this.handleError(res, err);
        }
      }
    );
  }
}
export default BongkarMuatController;
