import { Application } from "express";
import CommonOptionsController from "@domains/commonOptions/commonOption.controller";
import BongkarMuatController from "@domains/bongkarMuat/bongkarMuat.controller";
import AuthController from "@domains/auth/auth.controller";
import UserController from "@domains/user/User.controller";
import EmployeeController from "@domains/Employee/Employee.controller";
import GroupTimController from "@domains/GroupTeam/GroupTeam.controller";
import GajiKuliController from "@domains/gajiKuli/gajiKuli.controller";
import TarifBongkarController from "@domains/tarifBongkarMuat/tarifBongkar.controller";
import DashboardController from "@domains/dashboard/dashboard.controller";
import LaporanBongkarMuatController from "@domains/laporanBongkarMuat/laporanBongkarMuat.controller";
import ActivityLogController from "@domains/activityLog/activityLog.controller";
import RefreshTokenController from "@domains/refreshToken/refreshToken.controller";
import ExportExcelLaporanBongkarMuat from "@domains/laporanBongkarMuat/exportExcel";

export default class Router {
  app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  routerAPI() {
    this.app.use("/api", new EmployeeController().getRouter());
    this.app.use("/api", new GroupTimController().getRouter());
    this.app.use("/api/options", new CommonOptionsController().getRouter());
    this.app.use("/api", new UserController().getRouter());
    this.app.use("/api", new BongkarMuatController().getRouter());
    this.app.use("/api", new GajiKuliController().getRouter());
    this.app.use("/api", new TarifBongkarController().getRouter());
    this.app.use("/api", new DashboardController().getRouter());
    this.app.use("/api", new LaporanBongkarMuatController().getRouter());
    this.app.use("/api", new ActivityLogController().getRouter());
    this.app.use("/api", new RefreshTokenController().getRouter());
    this.app.use("/api", new AuthController().getRouter());
  }

  routerExcel() {
    this.app.use("/api/export/laporan-bongkar", new ExportExcelLaporanBongkarMuat().getRouter());
  }
}

