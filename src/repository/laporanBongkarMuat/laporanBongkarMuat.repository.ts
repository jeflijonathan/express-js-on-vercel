import BasePrismaService, {
    Paginator,
    Sorter,
} from "@common/base/basePrismaService";
import { Prisma } from "@prisma/client";
import { prisma } from "src/config/database/client";

class LaporanBongkarMuatRepository extends BasePrismaService<
    typeof prisma.laporan,
    Prisma.LaporanWhereInput,
    Prisma.LaporanSelect,
    Prisma.LaporanInclude
> {
    constructor() {
        super(prisma.laporan);
    }

    async findAll(
        where: Prisma.LaporanWhereInput = {},
        paginator?: Paginator,
        options?: {
            select?: Prisma.LaporanSelect;
            include?: Prisma.LaporanInclude;
        },
        sorter?: Sorter
    ) {
        return this.find({ query: where, sorter: sorter }, paginator, options);
    }

    async findById(
        id: number,
        options?: {
            select?: Prisma.LaporanSelect;
            include?: Prisma.LaporanInclude;
        }
    ) {
        return this.findOne({ id }, options);
    }

    async createLaporan(data: Prisma.LaporanCreateInput) {
        return this.create({ data });
    }

    async updateLaporan(id: number, data: Prisma.LaporanUpdateInput) {
        return this.update({ id }, data);
    }

    async deleteLaporan(id: number) {
        return this.delete({ id });
    }
}

export default LaporanBongkarMuatRepository;
