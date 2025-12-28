"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commonOption_controller_1 = __importDefault(require("@domains/commonOptions/commonOption.controller"));
const bongkarMuat_controller_1 = __importDefault(require("@domains/bongkarMuat/bongkarMuat.controller"));
const auth_controller_1 = __importDefault(require("@domains/auth/auth.controller"));
const User_controller_1 = __importDefault(require("@domains/user/User.controller"));
const Employee_controller_1 = __importDefault(require("@domains/Employee/Employee.controller"));
const GroupTeam_controller_1 = __importDefault(require("@domains/GroupTeam/GroupTeam.controller"));
const gajiKuli_controller_1 = __importDefault(require("@domains/gajiKuli/gajiKuli.controller"));
const tarifBongkar_controller_1 = __importDefault(require("@domains/tarifBongkarMuat/tarifBongkar.controller"));
const dashboard_controller_1 = __importDefault(require("@domains/dashboard/dashboard.controller"));
const laporanBongkarMuat_controller_1 = __importDefault(require("@domains/laporanBongkarMuat/laporanBongkarMuat.controller"));
const activityLog_controller_1 = __importDefault(require("@domains/activityLog/activityLog.controller"));
const refreshToken_controller_1 = __importDefault(require("@domains/refreshToken/refreshToken.controller"));
const exportExcel_1 = __importDefault(require("@domains/laporanBongkarMuat/exportExcel"));
class Router {
    constructor(app) {
        this.app = app;
    }
    routerAPI() {
        this.app.use("/api", new Employee_controller_1.default().getRouter());
        this.app.use("/api", new GroupTeam_controller_1.default().getRouter());
        this.app.use("/api/options", new commonOption_controller_1.default().getRouter());
        this.app.use("/api", new User_controller_1.default().getRouter());
        this.app.use("/api", new bongkarMuat_controller_1.default().getRouter());
        this.app.use("/api", new gajiKuli_controller_1.default().getRouter());
        this.app.use("/api", new tarifBongkar_controller_1.default().getRouter());
        this.app.use("/api", new dashboard_controller_1.default().getRouter());
        this.app.use("/api", new laporanBongkarMuat_controller_1.default().getRouter());
        this.app.use("/api", new activityLog_controller_1.default().getRouter());
        this.app.use("/api", new refreshToken_controller_1.default().getRouter());
        this.app.use("/api", new auth_controller_1.default().getRouter());
    }
    routerExcel() {
        this.app.use("/api/export/laporan-bongkar", new exportExcel_1.default().getRouter());
    }
}
exports.default = Router;
