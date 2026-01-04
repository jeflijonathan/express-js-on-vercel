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
class RoleRepository extends basePrismaService_1.default {
    constructor() {
        super(client_1.prisma.role);
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (where = {}, paginator, options) {
            return this.find({ query: where }, paginator, options);
        });
    }
    findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({ id }, options);
        });
    }
}
exports.default = RoleRepository;
