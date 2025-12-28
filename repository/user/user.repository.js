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
const basePrismaService_1 = __importDefault(require("@common/base/basePrismaService"));
const client_1 = require("src/config/database/client");
const hash_1 = require("@common/utils/hash");
class UserRepository extends basePrismaService_1.default {
    constructor() {
        super(client_1.prisma.user);
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (where = {}, paginator, options, sorter) {
            return this.find({ query: where, sorter }, paginator, options);
        });
    }
    findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({ id }, options);
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.create({ data });
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.update({ id }, data);
        });
    }
    createRefreshToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Defensive: ensure tokenHash is present. Some callers may not supply it.
            const payload = Object.assign({}, data);
            if (!payload.tokenHash && payload.token) {
                payload.tokenHash = (0, hash_1.hashToken)(payload.token);
            }
            return client_1.prisma.refreshToken.create({ data: payload });
        });
    }
    findRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenHash = (0, hash_1.hashToken)(token);
            return client_1.prisma.refreshToken.findFirst({
                where: { tokenHash },
            });
        });
    }
    revokeRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenHash = (0, hash_1.hashToken)(token);
            return client_1.prisma.refreshToken.updateMany({
                where: { tokenHash },
                data: { isRevoked: true },
            });
        });
    }
    deleteRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenHash = (0, hash_1.hashToken)(token);
            return client_1.prisma.refreshToken.deleteMany({
                where: { tokenHash },
            });
        });
    }
    deleteExpiredTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            return client_1.prisma.refreshToken.deleteMany({
                where: { expiresAt: { lt: new Date() } },
            });
        });
    }
}
exports.default = UserRepository;
