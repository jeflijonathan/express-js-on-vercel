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
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = require("@common/consts/statusCodes");
class BasePrismaService {
    constructor(model) {
        this.model = model;
    }
    getPrisma() {
        return this.model._prisma || this.model.prisma || require("src/config/database/client").prisma;
    }
    find() {
        return __awaiter(this, arguments, void 0, function* (filter = { query: {}, sorter: null }, paginator, options) {
            try {
                const queryOptions = {
                    where: filter.query,
                };
                if (paginator) {
                    const pageNum = Number(paginator.page) || 1;
                    const limitNum = Number(paginator.limit) || 10;
                    if (!Number.isInteger(limitNum) || limitNum <= 0) {
                        throw {
                            statusCode: statusCodes_1.StatusBadRequest,
                            message: "Invalid paginator.limit: must be a positive integer",
                        };
                    }
                    queryOptions.skip = limitNum * (pageNum - 1);
                    queryOptions.take = limitNum;
                }
                if (filter.sorter) {
                    queryOptions.orderBy = filter.sorter;
                }
                if (options === null || options === void 0 ? void 0 : options.select) {
                    queryOptions.select = options.select;
                }
                if (options === null || options === void 0 ? void 0 : options.include) {
                    queryOptions.include = options.include;
                }
                return yield this.model.findMany(queryOptions);
            }
            catch (error) {
                const msg = (error && error.message) || "";
                if (typeof msg === "string" &&
                    /namaLengkap|Unknown column|does not exist/i.test(msg)) {
                    throw {
                        statusCode: 500,
                        message: "Database schema is missing the column 'Employee.namaLengkap'.\nRun a Prisma migration to add the column and copy data from 'username' (see backend/scripts/copyEmployeeUsernamesToNamaLengkap.ts). Example:\n  npx prisma migrate dev --name add_namaLengkap_to_employee\n  npx ts-node -r tsconfig-paths/register scripts/copyEmployeeUsernamesToNamaLengkap.ts",
                    };
                }
                throw error;
            }
        });
    }
    findMany() {
        return __awaiter(this, arguments, void 0, function* (filter = { query: {}, sorter: null }, options) {
            try {
                const queryOptions = {
                    where: filter.query,
                };
                if (filter.sorter) {
                    queryOptions.orderBy = filter.sorter;
                }
                if (options === null || options === void 0 ? void 0 : options.select) {
                    queryOptions.select = options.select;
                }
                if (options === null || options === void 0 ? void 0 : options.include) {
                    queryOptions.include = options.include;
                }
                return yield this.model.findMany(queryOptions);
            }
            catch (error) {
                const msg = (error && error.message) || "";
                if (typeof msg === "string" &&
                    /namaLengkap|Unknown column|does not exist/i.test(msg)) {
                    throw {
                        statusCode: 500,
                        message: "Database schema is missing the column 'Employee.namaLengkap'.\nRun a Prisma migration to add the column and copy data from 'username' (see backend/scripts/copyEmployeeUsernamesToNamaLengkap.ts). Example:\n  npx prisma migrate dev --name add_namaLengkap_to_employee\n  npx ts-node -r tsconfig-paths/register scripts/copyEmployeeUsernamesToNamaLengkap.ts",
                    };
                }
                throw error;
            }
        });
    }
    count() {
        return __awaiter(this, arguments, void 0, function* (filter = { query: {} }) {
            try {
                return yield this.model.count({
                    where: filter.query,
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    findOne() {
        return __awaiter(this, arguments, void 0, function* (filter = {}, options) {
            try {
                return yield this.model.findFirst({
                    where: filter,
                    select: options === null || options === void 0 ? void 0 : options.select,
                    include: options === null || options === void 0 ? void 0 : options.include,
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = data &&
                    typeof data === "object" &&
                    "data" in data &&
                    Object.keys(data).length === 1
                    ? data.data
                    : data;
                return yield this.model.create({
                    data: payload,
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
    createMany(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = data &&
                    typeof data === "object" &&
                    "data" in data &&
                    Object.keys(data).length === 1
                    ? data.data
                    : data;
                return yield this.model.createMany({
                    data: payload,
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
    update(filter, updateData, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.update({
                    where: filter,
                    data: updateData,
                    select: options === null || options === void 0 ? void 0 : options.select,
                    include: options === null || options === void 0 ? void 0 : options.include,
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.delete({
                    where: filter,
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = BasePrismaService;
