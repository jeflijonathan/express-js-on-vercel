import { Sorter } from "@common/base/basePrismaService";
import { StatusBadRequest } from "@common/consts/statusCodes";
import { Prisma } from "@prisma/client";
import GajiKuliRepository from "src/repository/gajiKuli/gajiKuli.repository";
import CreateGajiKuliDTO, { IGajiKuliCreatePayload } from "./dto/gajiKuliCreate.dto";
import UpdateGajiKuliDTO, { IGajiKuliUpdatePayload } from "./dto/gajiKuliUpdate.dto";
import GajiKuliBatchDTO, { IGajiKuliBatchPayload } from "./dto/gajiKuliBatch.dto";

class GajiKuliService {
    private _gajiKuliRepository;

    constructor() {
        this._gajiKuliRepository = new GajiKuliRepository();
    }

    findGajiKuli = async (req: any, params: any = {}, queryParams: any = {}) => {
        const { value, page = 1, limit = 10 } = queryParams;

        let employeeWhere: any = {
            gaji: { some: {} }
        };

        if (value && value.trim() !== "") {
            employeeWhere.namaLengkap = { contains: value };
        }

        if (queryParams.koorlapId) {
            employeeWhere.id = queryParams.koorlapId;
        }

        const totalEmployees = await this._gajiKuliRepository.prisma.employee.count({
            where: employeeWhere
        });

        const paginatedEmployees = await this._gajiKuliRepository.prisma.employee.findMany({
            where: employeeWhere,
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            select: { id: true },
            orderBy: queryParams.sort === "updatedAt" ? { updatedAt: queryParams.order_by || "desc" } : { createdAt: queryParams.order_by || "desc" }
        });

        const employeeIds = paginatedEmployees.map(e => e.id);

        const data = await this._gajiKuliRepository.findAll(
            {
                koorlapId: { in: employeeIds }
            },
            undefined,
            {
                select: {
                    id: true,
                    gaji: true,
                    angkut: {
                        select: {
                            id: true,
                            name: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    containerSize: {
                        select: {
                            id: true,
                            name: true,
                            createdAt: true,
                            updatedAt: true,
                        }
                    },
                    tradeType: {
                        select: {
                            id: true,
                            name: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    koorlap: {
                        select: {
                            id: true,
                            namaLengkap: true,
                        }
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            },
            queryParams.sort && queryParams.order_by ? { [queryParams.sort]: queryParams.order_by } : undefined
        );

        return { data, total: totalEmployees };
    };

    findGajiKuliById = async (id: number) => {
        const result = await this._gajiKuliRepository.findById(id, {
            select: {
                id: true,
                gaji: true,
                angkut: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                containerSize: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                },
                tradeType: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                koorlap: {
                    select: {
                        id: true,
                        namaLengkap: true,
                    }
                },
                createdAt: true,
                updatedAt: true,
            },
        });

        return result;
    };

    createGajiKuli = async (body: IGajiKuliCreatePayload) => {
        const parsed = await CreateGajiKuliDTO.fromCreateGajiKuli(body);
        let { angkutId, tradeTypeId, containerSizeId, gaji, koorlapId } = parsed;

        const containerSize = await this._gajiKuliRepository.prisma.containerSize.findUnique({
            where: { id: containerSizeId }
        });

        if (containerSize && (containerSize.name === "LCL(merah)" || containerSize.name === "LCL(hijau)")) {
            const angkutAll = await this._gajiKuliRepository.prisma.angkut.findFirst({
                where: { name: "ALL" }
            });
            if (angkutAll) {
                angkutId = angkutAll.id;
            }
        }

        const checkGajiKuli = await this._gajiKuliRepository.findOne({
            angkutId,
            tradeTypeId,
            containerSizeId,
            koorlapId
        });

        if (checkGajiKuli) {
            throw {
                statusCode: StatusBadRequest,
                message: `Gaji Kuli with the same parameters already exists`,
            };
        }

        return await this._gajiKuliRepository.createGajiKuli({
            angkut: { connect: { id: angkutId } },
            tradeType: { connect: { id: tradeTypeId } },
            containerSize: { connect: { id: containerSizeId } },
            koorlap: { connect: { id: koorlapId } },
            gaji: gaji,
        });
    };

    updateGajiKuli = async (id: number, body: IGajiKuliUpdatePayload) => {
        const parsed = await UpdateGajiKuliDTO.fromUpdateGajiKuli(body);
        const { gaji, koorlapId } = parsed;

        const data: Prisma.GajiUpdateInput = {
            gaji: gaji,
        };

        if (koorlapId) {
            data.koorlap = { connect: { id: koorlapId } };
        }

        return await this._gajiKuliRepository.updateGajiKuli(id, data);
    };

    deleteGajiKuli = async (id: number) => {
        return this._gajiKuliRepository.deleteGajiKuli(id);
    };

    batchSaveGajiKuli = async (body: IGajiKuliBatchPayload) => {
        const parsed = await GajiKuliBatchDTO.fromBatchGajiKuli(body);
        const { koorlapId, items, isCreateMode } = parsed;

        if (isCreateMode) {
            const existing = await this._gajiKuliRepository.count({
                query: { koorlapId }
            });
            if (existing > 0) {
                throw {
                    statusCode: StatusBadRequest,
                    message: `Wage data for this Coordinator already exists. Please use Edit instead.`,
                };
            }
        }

        const results = [];

        for (const item of items) {
            const { angkutId, tradeTypeId, containerSizeId, gaji } = item;

            const checkGajiKuli = await this._gajiKuliRepository.findOne({
                angkutId,
                tradeTypeId,
                containerSizeId,
                koorlapId
            });

            if (checkGajiKuli) {
                results.push(await this._gajiKuliRepository.updateGajiKuli(checkGajiKuli.id, {
                    gaji,
                }));
            } else {
                results.push(await this._gajiKuliRepository.createGajiKuli({
                    angkut: { connect: { id: angkutId } },
                    tradeType: { connect: { id: tradeTypeId } },
                    containerSize: { connect: { id: containerSizeId } },
                    koorlap: { connect: { id: koorlapId } },
                    gaji: gaji,
                }));
            }
        }

        return results;
    };
}
export default GajiKuliService;
