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
const client_1 = require("src/config/database/client");
const dateFilter_1 = require("@common/filter/dateFilter/dateFilter");
const sigleSearch_1 = require("@common/filter/sigleSearch/sigleSearch");
const statusFilter_1 = __importDefault(require("@common/filter/statusFilter/statusFilter"));
const repository_1 = require("src/repository");
const groupTeamUpdate_dto_1 = __importDefault(require("./dto/groupTeamUpdate.dto"));
const groupTeamCreate_dto_1 = __importDefault(require("./dto/groupTeamCreate.dto"));
class GroupTeamService {
    constructor() {
        this._groupTeamRepository = new repository_1.GroupTeamRepository();
        this._teamRepository = new repository_1.TeamRepository();
    }
    findAll(_a, params_1) {
        return __awaiter(this, arguments, void 0, function* ({ skip, take }, params) {
            try {
                const stringUsername = (0, sigleSearch_1.buildSingleSearch)("username", params.value);
                const dateOrderBy = (0, dateFilter_1.buildDateFilter)(params);
                const statusFilter = (0, statusFilter_1.default)("status", params.status);
                const orderBy = [];
                if (dateOrderBy)
                    orderBy.push(dateOrderBy);
                const matchedTims = yield this._teamRepository.findAll(Object.assign({}, stringUsername));
                const groupTimIds = [
                    ...new Set(matchedTims.map((tim) => tim.idGroupTeam)),
                ];
                if (groupTimIds.length === 0) {
                    return { data: [], total: 0 };
                }
                const groupTimList = yield client_1.prisma.groupTeam.findMany({
                    where: Object.assign({ id: {
                            in: groupTimIds,
                        } }, statusFilter),
                    skip,
                    take,
                    orderBy: orderBy,
                    include: {
                        team: {
                            include: {
                                employee: true,
                            },
                        },
                    },
                });
                const mappedData = groupTimList.map((group) => ({
                    idGroupTeam: group.id,
                    GroupTeam: {
                        status: group.status,
                        createdAt: group.createdAt,
                        updatedAt: group.updatedAt,
                    },
                    ListTeam: group.team.map((item) => {
                        var _a;
                        return ({
                            id: item.id,
                            namaLengkap: ((_a = item.employee) === null || _a === void 0 ? void 0 : _a.namaLengkap) || "Unknown",
                        });
                    }),
                }));
                return { data: mappedData, total: groupTimIds.length };
            }
            catch (err) {
                console.error("@GroupTeamService:findAll:error", err);
                throw err;
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield client_1.prisma.groupTeam.findUnique({
                    where: { id },
                    select: {
                        status: true,
                    },
                });
                return [result];
            }
            catch (err) {
                console.error("@GroupTeamService:findById:error", err);
                throw err;
            }
        });
    }
    handleCreateTimGroup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(data);
                const parsed = yield groupTeamCreate_dto_1.default.fromCreateGroupTeam(data);
                const inputTimSet = [...parsed.idTeamList].sort();
                const allGroups = yield client_1.prisma.groupTeam.findMany({
                    include: {
                        team: true,
                    },
                });
                const isDuplicate = allGroups.some((group) => {
                    const existingTimSet = group.team.map((t) => t.kdTeam).sort();
                    return (existingTimSet.length === inputTimSet.length &&
                        existingTimSet.every((val, idx) => val === inputTimSet[idx]));
                });
                if (isDuplicate) {
                    throw {
                        statusCode: 400,
                        message: "This team combination already exists.",
                    };
                }
                const createdGroupTim = yield this._groupTeamRepository.create({
                    data: {
                        status: true,
                    },
                });
                const teamsToCreate = parsed.idTeamList.map((kdTeam) => ({
                    kdTeam,
                    idGroupTeam: createdGroupTim.id,
                }));
                const team = yield this._teamRepository.createMany({
                    data: teamsToCreate,
                });
                return team;
            }
            catch (err) {
                console.error("@GroupTeamService:handleUpdateGroupTim:error", err);
                throw err;
            }
        });
    }
    handleUpdateGroupTim(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parsed = yield groupTeamUpdate_dto_1.default.fromUpdateContainer(data);
                const { status } = parsed;
                const result = yield this._groupTeamRepository.updateGroupTeam(id, {
                    status: status,
                });
                return result;
            }
            catch (err) {
                console.error("@GroupTeamService:handleUpdateGroupTim:error", err);
                throw err;
            }
        });
    }
    handleDeleteGroupTim(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingGroup = yield this._groupTeamRepository.findOne({
                    id,
                });
                if (!existingGroup) {
                    throw {
                        statusCode: 404,
                        message: "Group team not found.",
                    };
                }
                yield client_1.prisma.team.deleteMany({
                    where: { idGroupTeam: id },
                });
                const deletedGroup = yield this._groupTeamRepository.delete({
                    id,
                });
                return deletedGroup;
            }
            catch (err) {
                console.error("@GroupTeamService:findAll:error", err);
                throw err;
            }
        });
    }
}
exports.default = GroupTeamService;
