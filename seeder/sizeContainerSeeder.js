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
const client_1 = require("src/config/database/client");
const containerSizeItemSeeder = () => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.prisma.containerSize.createMany({
        data: [
            { name: "20 feet" },
            { name: "40 feet" },
            { name: "LCL(merah)" },
            { name: "LCL(hijau)" },
            { name: "ALL" },
        ],
        skipDuplicates: true,
    });
    console.log("ContainerSize size item done.");
});
exports.default = containerSizeItemSeeder;
