import { Sorter } from "@common/base/basePrismaService";
import { StatusBadRequest } from "@common/consts/statusCodes";
import CreateBongkarMuatDTO, {
  ITarifBongkarMuatPayload,
} from "./dto/tarifBongkarCreate.dto";
import { Prisma } from "@prisma/client";
import UpdateBongkarMuatDTO, {
  ITarifBongkarMuatUpdatePayload,
} from "./dto/tarifBongkarUpdate.dto";
import TarifBongkarMuatRepository from "src/repository/tarifBongkarMuat/tarifBongkarMuat.repository";
import BarangRepository from "src/repository/barang/barang.repository";
import TarifBongkarBatchDTO, {
  ITarifBongkarBatchPayload,
} from "./dto/tarifBongkarBatch.dto";

class TarifBongkarService {
  private _bongkarRepository;
  private _barangRepository;

  constructor() {
    this._bongkarRepository = new TarifBongkarMuatRepository();
    this._barangRepository = new BarangRepository();
  }

  findTarifBongkarMuat = async (req: any, params: any = {}, queryParams: any = {}) => {
    const { value, page = 1, limit = 10 } = queryParams;

    let where: any = {};

    if (value && value.trim() !== "") {
      where.OR = [
        { barang: { name: { contains: value } } },
        { angkut: { name: { contains: value } } },
        { tradeType: { name: { contains: value } } },
        { containerSize: { name: { contains: value } } }
      ];
    }

    if (queryParams.idBarang) where.idBarang = Number(queryParams.idBarang);
    if (queryParams.idAngkut) where.idAngkut = Number(queryParams.idAngkut);
    if (queryParams.idTradeType) where.idTradeType = Number(queryParams.idTradeType);
    if (queryParams.idContainerSize) where.idContainerSize = Number(queryParams.idContainerSize);

    let sorter: Sorter | undefined;

    if (queryParams.sort && queryParams.order_by) {
      const order = queryParams.order_by.toLowerCase();
      if (order === "asc" || order === "desc") {
        sorter = {
          [queryParams.sort]: order,
        };
      }
    }

    const [data, total] = await Promise.all([
      this._bongkarRepository.findAll(
        where,
        {
          page,
          limit,
        },
        {
          select: {
            id: true,
            amount: true,
            jasaWrapping: true,
            barang: {
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
              },
            },
            tradeType: {
              select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            angkut: {
              select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
        sorter
      ),
      this._bongkarRepository.count({ query: where }),
    ]);

    return { data, total };
  };

  findTarifBongkarMuatById = async (id: number) => {
    const result = await this._bongkarRepository.findById(id, {
      select: {
        id: true,
        amount: true,
        jasaWrapping: true,
        barang: {
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
          },
        },
        tradeType: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        angkut: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return result;
  };

  createTarifBongkarMuat = async (body: ITarifBongkarMuatPayload) => {
    const parsed = await CreateBongkarMuatDTO.fromCreateBongkarMuat(body);
    const { idBarang, idContainerSize, idTradeType, idAngkut, amount, jasaWrapping } =
      parsed;

    const barangAll = await this._barangRepository.findOne({ name: "ALL" });
    if (!barangAll) throw { statusCode: 400, message: "Barang ALL not found" };

    if (idBarang === barangAll.id) {
      const existing = await this._bongkarRepository.findOne({
        idContainerSize,
        idTradeType,
        idAngkut,
      });
      if (existing) {
        throw {
          statusCode: StatusBadRequest,
          message: `Conflict: A rate for this Size/Type/Angkut combination already exists. Remove specific items before adding 'ALL'.`,
        };
      }
    } else {
      const existingAll = await this._bongkarRepository.findOne({
        idBarang: barangAll.id,
        idContainerSize,
        idTradeType,
        idAngkut,
      });
      if (existingAll) {
        throw {
          statusCode: StatusBadRequest,
          message: `Conflict: An 'ALL' rate already exists for this combination. Remove 'ALL' before adding specific items.`,
        };
      }
    }

    const checkTarifBongkarMuat = await this._bongkarRepository.findOne({
      idBarang: idBarang,
      idContainerSize: idContainerSize,
      idTradeType: idTradeType,
      idAngkut: idAngkut,
    });

    if (checkTarifBongkarMuat) {
      throw {
        statusCode: StatusBadRequest,
        message: `Tarif bongkar muat with the same parameters already exists`,
      };
    }

    const data: Prisma.TarifBongkarCreateInput = {
      barang: { connect: { id: idBarang } },
      containerSize: { connect: { id: idContainerSize } },
      tradeType: { connect: { id: idTradeType } },
      angkut: { connect: { id: idAngkut } },
      amount: amount,
      jasaWrapping: jasaWrapping ?? false,
    };

    return await this._bongkarRepository.createTarifBongkar(data);
  };

  updateTarifBongkarMuat = async (
    id: number,
    body: ITarifBongkarMuatUpdatePayload
  ) => {
    const parsed = await UpdateBongkarMuatDTO.fromUpdateBongkarMuat(body);

    const { amount, jasaWrapping } = parsed;

    const data: Prisma.TarifBongkarUpdateInput = {
      amount: amount,
      jasaWrapping: jasaWrapping,
    };

    return await this._bongkarRepository.updateTarifBongkar(id, data);
  };

  deleteTarifBongkarMuat = async (id: number) => {
    return this._bongkarRepository.deleteTarifBongkar(id);
  };

  batchSaveTarifBongkarMuat = async (body: ITarifBongkarBatchPayload) => {
    const parsed = await TarifBongkarBatchDTO.fromBatchTarifBongkar(body);
    const { items } = parsed;

    const results = [];

    for (const item of items) {
      const {
        idTradeType,
        idContainerSize,
        idAngkut,
        idBarang,
        amount,
        jasaWrapping,
      } = item;

      const existing = await this._bongkarRepository.findOne({
        idBarang,
        idContainerSize,
        idTradeType,
        idAngkut,
        jasaWrapping,
      });

      if (existing) {
        results.push(
          await this._bongkarRepository.updateTarifBongkar(existing.id, {
            amount,
          })
        );
      } else {
        results.push(
          await this._bongkarRepository.createTarifBongkar({
            barang: { connect: { id: idBarang } },
            containerSize: { connect: { id: idContainerSize } },
            tradeType: { connect: { id: idTradeType } },
            angkut: { connect: { id: idAngkut } },
            amount: amount,
            jasaWrapping: jasaWrapping,
          })
        );
      }
    }

    return results;
  };
}
export default TarifBongkarService;
