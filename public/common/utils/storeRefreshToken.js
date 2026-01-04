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
const date_fns_1 = require("date-fns");
const client_1 = require("src/config/database/client");
const hash_1 = require("@common/utils/hash");
const storeRefreshToken = (_a) => __awaiter(void 0, [_a], void 0, function* ({ token, userId, ipAddress, userAgent, }) {
    const expiresAt = (0, date_fns_1.addDays)(new Date(), 7);
    return client_1.prisma.refreshToken.create({
        data: {
            token,
            tokenHash: (0, hash_1.hashToken)(token),
            userId,
            ipAddress,
            userAgent,
            expiresAt,
        },
    });
});
exports.default = storeRefreshToken;
