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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting update of ContainerSize "ALL" to "ALLLCL"...');
        const containerSize = yield prisma.containerSize.findFirst({
            where: { name: 'ALL' },
        });
        if (containerSize) {
            yield prisma.containerSize.update({
                where: { id: containerSize.id },
                data: { name: 'ALLLCL' },
            });
            console.log(`Successfully updated ContainerSize ID ${containerSize.id} from "ALL" to "ALLLCL".`);
        }
        else {
            console.log('No ContainerSize with name "ALL" found.');
            const existingAllLcl = yield prisma.containerSize.findFirst({
                where: { name: 'ALLLCL' },
            });
            if (existingAllLcl) {
                console.log('ContainerSize "ALLLCL" already exists.');
            }
        }
    });
}
main()
    .catch((e) => {
    console.error('Error during update:', e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
