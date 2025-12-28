import { Sorter } from "@common/base/basePrismaService";
import { Prisma } from "@prisma/client";
import LaporanBongkarMuatRepository from "src/repository/laporanBongkarMuat/laporanBongkarMuat.repository";
import CreateLaporanBongkarMuatDTO, {
    ILaporanBongkarMuatCreatePayload,
} from "./dto/laporanBongkarMuatCreate.dto";
import UpdateLaporanBongkarMuatDTO, {
    ILaporanBongkarMuatUpdatePayload,
} from "./dto/laporanBongkarMuatUpdate.dto";
import { prisma } from "src/config/database/client";
import { StatusBadRequest, StatusNotFound } from "@common/consts/statusCodes";

class LaporanBongkarMuatService {
    private _laporanRepository: LaporanBongkarMuatRepository;

    constructor() {
        this._laporanRepository = new LaporanBongkarMuatRepository();
    }

    findAll = async (queryParams: any = {}) => {
        const { value, search, page = 1, limit = 10 } = queryParams;
        const searchVal = search || value;

        let where: Prisma.LaporanWhereInput = {};

        if (queryParams.startDate && queryParams.endDate) {
            const startSearch = new Date(queryParams.startDate);
            startSearch.setHours(0, 0, 0, 0);
            const endSearch = new Date(queryParams.endDate);
            endSearch.setHours(23, 59, 59, 999);

            where.tanggalAwal = { gte: startSearch };
            where.tanggalAkhir = { lte: endSearch };
        }

        if (searchVal) {
            const isNumeric = !isNaN(Number(searchVal));
            where.OR = [
                {
                    detailLaporan: {
                        some: {
                            idSesiBongkar: {
                                contains: searchVal,
                            }
                        }
                    }
                }
            ];

            if (isNumeric) {
                where.OR.push({ id: Number(searchVal) });
            }
        }

        let sorter: Sorter | undefined;

        if (queryParams.sort && queryParams.order_by) {
            const order = queryParams.order_by.toLowerCase();
            if (order === "asc" || order === "desc") {
                sorter = {
                    [queryParams.sort]: order,
                };
            }
        } else {
            sorter = { createdAt: "desc" };
        }

        const [data, total] = await Promise.all([
            this._laporanRepository.findAll(
                where,
                { page, limit },
                {
                    include: {
                        detailLaporan: {
                            include: {
                                sesiBongkar: {
                                    include: {
                                        groupTeam: {
                                            include: {
                                                team: {
                                                    include: {
                                                        employee: true,
                                                    },
                                                },
                                            },
                                        },
                                        containerSize: true,
                                        tradeType: true,
                                        angkut: true,
                                        barang: true,
                                        statusBongkar: true,
                                    },
                                },
                            },
                        },
                    },
                },
                sorter
            ),
            this._laporanRepository.count({ query: where }),
        ]);

        return { data, total };
    };

    findById = async (id: number) => {
        const result = await this._laporanRepository.findById(id, {
            include: {
                detailLaporan: {
                    include: {
                        sesiBongkar: {
                            include: {
                                groupTeam: {
                                    include: {
                                        team: {
                                            include: {
                                                employee: true,
                                            },
                                        },
                                    },
                                },
                                containerSize: true,
                                tradeType: true,
                                angkut: true,
                                barang: true,
                                statusBongkar: true,
                            },
                        },
                    },
                },
            },
        });

        if (!result) {
            throw {
                statusCode: StatusNotFound,
                message: "Laporan tidak ditemukan",
            };
        }

        return result;
    };

    create = async (body: ILaporanBongkarMuatCreatePayload) => {
        const parsed = await CreateLaporanBongkarMuatDTO.fromCreate(body);
        const { tanggalAwal, tanggalAkhir } = parsed;

        const startDate = new Date(tanggalAwal);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(tanggalAkhir);
        endDate.setHours(23, 59, 59, 999);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw {
                statusCode: StatusBadRequest,
                message: "Format tanggal tidak valid",
            };
        }

        const sesiBongkarList = await prisma.sesiBongkar.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
                statusBongkar: {
                    name: "DONE",
                },
            },
            include: {
                containerSize: true,
                tradeType: true,
                angkut: true,
                groupTeam: {
                    include: {
                        team: true,
                    },
                },
            },
        });

        if (sesiBongkarList.length === 0) {
            throw {
                statusCode: StatusBadRequest,
                message: "Tidak ada data Sesi Bongkar yang sudah DONE pada rentang tanggal tersebut",
            };
        }

        const tarifBongkar = await prisma.tarifBongkar.findMany({
            include: { barang: true, angkut: true, containerSize: true },
        });
        const gajiTable = await prisma.gaji.findMany({
            include: { angkut: true }
        });

        const laporan = await prisma.laporan.create({
            data: {
                tanggalAwal: startDate,
                tanggalAkhir: endDate,
            },
        });

        const detailLaporanData = sesiBongkarList.map((sesi) => {
            const resolvePrice = (isWrapping: boolean) => {
                const subset = tarifBongkar.filter(
                    (t) => t.idTradeType === sesi.idTradeType && t.jasaWrapping === isWrapping
                );

                const getScore = (t: typeof tarifBongkar[0]) => {
                    let score = 0;
                    if (t.idContainerSize === sesi.idContainerSize) score += 100;
                    else if (t.containerSize?.name?.toLowerCase() === "all" || t.containerSize?.name?.toLowerCase() === "all size") score += 50;
                    else return -1;

                    if (t.idBarang === sesi.idBarang) score += 10;
                    else if (t.barang?.name?.toLowerCase() === "all") score += 5;
                    else return -1;

                    if (t.idAngkut === sesi.idAngkut) score += 2;
                    else if (t.angkut?.name?.toLowerCase() === "all") score += 1;
                    else return -1;

                    return score;
                };

                const ScoredCandidates = subset
                    .map(t => ({ tariff: t, score: getScore(t) }))
                    .filter(item => item.score >= 0)
                    .sort((a, b) => b.score - a.score);

                if (ScoredCandidates.length > 0) {
                    return ScoredCandidates[0].tariff.amount;
                }

                return 0;
            };

            const basePrice = resolvePrice(false);
            let wrappingPrice = 0;
            const isExport = sesi.tradeType?.name?.toUpperCase() === "EXPORT";

            if (sesi.jasaWrapping && !isExport) {
                wrappingPrice = resolvePrice(true);
            }

            const gajiCandidates = gajiTable.filter(
                (g) =>
                    g.containerSizeId === sesi.idContainerSize &&
                    g.tradeTypeId === sesi.idTradeType &&
                    g.koorlapId === sesi.idKoorLap
            );

            let gajiEntry = gajiCandidates.find(g => g.angkutId === sesi.idAngkut);
            if (!gajiEntry) {
                gajiEntry = gajiCandidates.find(g => g.angkut?.name?.toUpperCase() === "ALL");
            }

            const teamMemberCount = sesi.groupTeam?.team?.length || 1;
            const gajiKaryawan = (gajiEntry?.gaji || 0) * teamMemberCount;

            return {
                idSesiBongkar: sesi.noContainer,
                gajiKaryawan,
                hargaBongkar: basePrice,
                biayaWrapping: wrappingPrice,
                idLaporan: laporan.id,
            };
        });

        if (detailLaporanData.length > 0) {
            await prisma.detailLaporan.createMany({
                data: detailLaporanData,
            });
        }

        return this.findById(laporan.id);
    };

    update = async (id: number, body: ILaporanBongkarMuatUpdatePayload) => {
        const parsed = await UpdateLaporanBongkarMuatDTO.fromUpdate(body);

        const existingLaporan = await this._laporanRepository.findById(id);
        if (!existingLaporan) {
            throw {
                statusCode: StatusNotFound,
                message: "Laporan tidak ditemukan",
            };
        }

        const tanggalAwal = parsed.tanggalAwal
            ? new Date(parsed.tanggalAwal)
            : existingLaporan.tanggalAwal;
        tanggalAwal.setHours(0, 0, 0, 0);

        const tanggalAkhir = parsed.tanggalAkhir
            ? new Date(parsed.tanggalAkhir)
            : existingLaporan.tanggalAkhir;
        tanggalAkhir.setHours(23, 59, 59, 999);

        await prisma.detailLaporan.deleteMany({
            where: { idLaporan: id },
        });

        const sesiBongkarList = await prisma.sesiBongkar.findMany({
            where: {
                createdAt: {
                    gte: tanggalAwal,
                    lte: tanggalAkhir,
                },
                statusBongkar: {
                    name: "DONE",
                },
            },
            include: {
                containerSize: true,
                tradeType: true,
                angkut: true,
                groupTeam: {
                    include: {
                        team: true,
                    },
                },
            },
        });

        if (sesiBongkarList.length === 0) {
            throw {
                statusCode: StatusBadRequest,
                message: "Tidak ada data Sesi Bongkar pada rentang tanggal tersebut",
            };
        }

        const tarifBongkar = await prisma.tarifBongkar.findMany({
            include: { barang: true, angkut: true, containerSize: true },
        });
        const gajiTable = await prisma.gaji.findMany({
            include: { angkut: true }
        });

        const detailLaporanData = sesiBongkarList.map((sesi) => {
            const resolvePrice = (isWrapping: boolean) => {
                const subset = tarifBongkar.filter(
                    (t) => t.idTradeType === sesi.idTradeType && t.jasaWrapping === isWrapping
                );

                const getScore = (t: typeof tarifBongkar[0]) => {
                    let score = 0;
                    if (t.idContainerSize === sesi.idContainerSize) score += 100;
                    else if (t.containerSize?.name?.toLowerCase() === "all" || t.containerSize?.name?.toLowerCase() === "all size") score += 50;
                    else return -1;

                    if (t.idBarang === sesi.idBarang) score += 10;
                    else if (t.barang?.name?.toLowerCase() === "all") score += 5;
                    else return -1;

                    if (t.idAngkut === sesi.idAngkut) score += 2;
                    else if (t.angkut?.name?.toLowerCase() === "all") score += 1;
                    else return -1;

                    return score;
                };

                const ScoredCandidates = subset
                    .map(t => ({ tariff: t, score: getScore(t) }))
                    .filter(item => item.score >= 0)
                    .sort((a, b) => b.score - a.score);

                if (ScoredCandidates.length > 0) {
                    return ScoredCandidates[0].tariff.amount;
                }

                return 0;
            };

            const basePrice = resolvePrice(false);
            let wrappingPrice = 0;
            const isExport = sesi.tradeType?.name?.toUpperCase() === "EXPORT";

            if (sesi.jasaWrapping && !isExport) {
                wrappingPrice = resolvePrice(true);
            }


            const gajiCandidates = gajiTable.filter(
                (g) =>
                    g.containerSizeId === sesi.idContainerSize &&
                    g.tradeTypeId === sesi.idTradeType &&
                    g.koorlapId === sesi.idKoorLap
            );

            let gajiEntry = gajiCandidates.find(g => g.angkutId === sesi.idAngkut);
            if (!gajiEntry) {
                gajiEntry = gajiCandidates.find(g => g.angkut?.name?.toUpperCase() === "ALL");
            }

            const teamMemberCount = sesi.groupTeam?.team?.length || 1;
            const gajiKaryawan = (gajiEntry?.gaji || 0) * teamMemberCount;

            return {
                idSesiBongkar: sesi.noContainer,
                gajiKaryawan,
                hargaBongkar: basePrice,
                biayaWrapping: wrappingPrice,
                idLaporan: id,
            };
        });

        if (detailLaporanData.length > 0) {
            await prisma.detailLaporan.createMany({
                data: detailLaporanData,
            });
        }

        await this._laporanRepository.updateLaporan(id, {
            tanggalAwal,
            tanggalAkhir,
        });

        return this.findById(id);
    };

    delete = async (id: number) => {
        const existingLaporan = await this._laporanRepository.findById(id);
        if (!existingLaporan) {
            throw {
                statusCode: StatusNotFound,
                message: "Laporan tidak ditemukan",
            };
        }

        return this._laporanRepository.deleteLaporan(id);
    };
}

export default LaporanBongkarMuatService;
