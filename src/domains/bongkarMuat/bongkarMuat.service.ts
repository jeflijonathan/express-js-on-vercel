import { Sorter } from "@common/base/basePrismaService";
import { StatusBadRequest } from "@common/consts/statusCodes";
import { buildSingleSearch } from "@common/filter/sigleSearch/sigleSearch";
import BongkarMuatRepository from "src/repository/bongkarMuat/bongkarMuat.repository";
import { Prisma } from "@prisma/client";
import UpdateBongkarMuatDTO, {
  IBongkarMuatUpdatePayload,
} from "./dto/bongkarMuatUpdate.dto";
import CreateImportBongkarMuatDTO from "./dto/importBongkarMuatCreate.dto";
import BarangRepository from "src/repository/barang/barang.repository";
import CreateExportBongkarMuatDTO from "./dto/exportBongkarMuatCreate.dto";
import {
  ContainerSizeRepository,
  EmployeeRepository,
  GroupTeamRepository,
  TransportMethodRepository,
} from "src/repository";
import { prisma } from "@config/database/client";

class BongkarMuatService {
  private _bongkarRepository;
  private _barangRepository;
  private _groupTeamRepository;
  private _containerSizeRepository;
  private _angkutRepository;
  private _employeeRepository;

  constructor() {
    this._bongkarRepository = new BongkarMuatRepository();
    this._barangRepository = new BarangRepository();
    this._groupTeamRepository = new GroupTeamRepository();
    this._containerSizeRepository = new ContainerSizeRepository();
    this._angkutRepository = new TransportMethodRepository();
    this._employeeRepository = new EmployeeRepository();
  }

  findSesiBongkarMuat = async (req: any, params: any = {}) => {
    const { value, status, page = 1, limit = 10 } = params;

    const searchFilter = buildSingleSearch("noContainer", value);

    const where = {
      ...searchFilter,
    };

    let sorter: Sorter | undefined;

    if (params.status) {
      where["statusBongkar"] = {
        name: params.status,
      };
    }

    if (params.startDate && params.endDate) {
      where["createdAt"] = {
        gte: new Date(params.startDate),
        lte: new Date(params.endDate),
      };
    }

    if (params.sort && params.order_by) {
      const order = params.order_by.toLowerCase();
      if (order === "asc" || order === "desc") {
        sorter = {
          [params.sort]: order,
        };
      }
    }

    const [data, total] = await Promise.all([
      this._bongkarRepository.findAll(
        where,
        { page: page, limit: limit },
        {
          include: {
            koorlap: {
              select: {
                id: true,
                namaLengkap: true,
              },
            },

            groupTeam: {
              select: {
                id: true,
                team: {
                  select: {
                    employee: {
                      select: {
                        id: true,
                        namaLengkap: true,
                      },
                    },
                  },
                },
              },
            },

            barang: {
              select: {
                id: true,
                name: true,
              },
            },

            statusBongkar: {
              select: {
                id: true,
                name: true,
              },
            },

            containerSize: {
              select: {
                id: true,
                name: true,
              },
            },

            tradeType: {
              select: {
                id: true,
                name: true,
              },
            },

            angkut: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        sorter
      ),

      this._bongkarRepository.count({ query: where }),
    ]);

    return { data, total };
  };

  findSesiBongkarMuatById = async (id: string) => {
    try {
      const result = await this._bongkarRepository.findById(id, {
        include: {
          koorlap: {
            select: {
              id: true,
              namaLengkap: true,
            },
          },

          groupTeam: {
            select: {
              id: true,
              team: {
                select: {
                  employee: {
                    select: {
                      id: true,
                      namaLengkap: true,
                    },
                  },
                },
              },
            },
          },

          barang: {
            select: {
              id: true,
              name: true,
            },
          },

          statusBongkar: {
            select: {
              id: true,
              name: true,
            },
          },

          containerSize: {
            select: {
              id: true,
              name: true,
            },
          },
          tradeType: {
            select: {
              id: true,
              name: true,
            },
          },

          angkut: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return result;
    } catch (error) {
      console.log("@BongkarMuatService:findSesiBongkarMuatById:error", error);
      throw error;
    }
  };

  handleCreateImportSesiBongkarMuat = async (body: any) => {
    try {
      const parsed =
        await CreateImportBongkarMuatDTO.fromCreateImportBongkarMuat(body);

      const {
        ownerCode,
        seriContainer,
        idKoorlap,
        idGroupTeam,
        idBarang,
        idContainerSize,
        idAngkut,
        jasaWrapping,
      } = parsed;

      const noContainer = `${ownerCode}-${seriContainer}`;

      const checkNoContainer = await this._bongkarRepository.findOne({
        noContainer: noContainer,
      });

      if (checkNoContainer) {
        throw {
          statusCode: StatusBadRequest,
          message: `bongkar muat with noContainer '${noContainer}' already registerd`,
        };
      }

      const checkbarangAll = await this._barangRepository.findOne({
        id: idBarang,
      });

      if (!checkbarangAll) {
        throw { statusCode: 400, message: "Barang ALL not found" };
      }

      const koorlap = await this._employeeRepository.findOne({ id: idKoorlap });
      if (!koorlap) {
        throw { statusCode: 400, message: "Koorlap not found" };
      }
      const groupTeam = await this._groupTeamRepository.findOne({
        id: idGroupTeam,
      });
      if (!groupTeam) {
        throw { statusCode: 400, message: "Group team not found" };
      }

      const containerSize = await this._containerSizeRepository.findOne({
        id: idContainerSize,
      });

      if (!containerSize) {
        throw { statusCode: 400, message: "Container size not found" };
      }

      const angkut = await this._angkutRepository.findById(idAngkut);
      if (!angkut) {
        throw { statusCode: 400, message: "Transport method not found" };
      }

      const data: Prisma.SesiBongkarCreateInput = {
        noContainer: noContainer.toUpperCase(),
        koorlap: {
          connect: {
            id: idKoorlap,
          },
        },
        groupTeam: {
          connect: {
            id: idGroupTeam,
          },
        },
        barang: {
          connect: {
            id: idBarang,
          },
        },
        containerSize: {
          connect: {
            id: idContainerSize,
          },
        },
        tradeType: {
          connect: {
            id: 2,
          },
        },
        angkut: {
          connect: {
            id: idAngkut,
          },
        },
        jasaWrapping: jasaWrapping,
      };

      if (!data) {
        throw {
          status: "Error",
          message: "Bad Request",
          statusCode: StatusBadRequest,
        };
      }

      return await this._bongkarRepository.createSesiBongkar(data);
    } catch (error) {
      console.log(
        "@BongkarMuatService:handleCreateImportSesiBongkarMuat :error",
        error
      );
      throw error;
    }
  };

  handleCreateExportSesiBongkarMuat = async (body: any) => {
    try {
      const parsed =
        await CreateExportBongkarMuatDTO.fromCreateExportBongkarMuat(body);

      const {
        ownerCode,
        seriContainer,
        idKoorlap,
        idGroupTeam,
        idContainerSize,
        idAngkut,
        jasaWrapping,
      } = parsed;

      const noContainer = `${ownerCode}-${seriContainer}`;

      const checkNoContainer = await this._bongkarRepository.findOne({
        noContainer,
      });

      if (checkNoContainer) {
        throw {
          statusCode: StatusBadRequest,
          message: `bongkar muat with noContainer '${noContainer}' already registered`,
        };
      }

      const barangAll = await this._barangRepository.findOne({
        name: "ALL",
      });

      if (!barangAll) {
        throw { statusCode: 400, message: "Barang ALL not found" };
      }

      const koorlap = await this._employeeRepository.findOne({ id: idKoorlap });
      if (!koorlap) {
        throw { statusCode: 400, message: "Koorlap not found" };
      }

      const groupTeam = await this._groupTeamRepository.findOne({
        id: idGroupTeam,
      });
      if (!groupTeam) {
        throw { statusCode: 400, message: "Group team not found" };
      }

      const containerSize = await this._containerSizeRepository.findOne({
        id: idContainerSize,
      });

      if (!containerSize) {
        throw { statusCode: 400, message: "Container size not found" };
      }

      const angkut = await this._angkutRepository.findOne({ id: idAngkut });
      if (!angkut)
        throw { statusCode: 400, message: "Transport method not found" };

      const data: Prisma.SesiBongkarCreateInput = {
        noContainer: noContainer.toUpperCase(),
        koorlap: { connect: { id: idKoorlap } },
        groupTeam: { connect: { id: idGroupTeam } },
        barang: { connect: { id: barangAll.id } },
        containerSize: { connect: { id: idContainerSize } },
        tradeType: { connect: { id: 1 } },
        angkut: { connect: { id: idAngkut } },
        jasaWrapping: false,
      };

      if (!data) {
        throw {
          status: "Error",
          message: "Bad Request",
          statusCode: StatusBadRequest,
        };
      }

      return await this._bongkarRepository.createSesiBongkar(data);
    } catch (err) {
      console.log("@BongkarMuatService:createExportSesiBongkarMuat:error", err);
      throw err;
    }
  };

  updateSesiBongkarMuat = async (
    id: string,
    body: IBongkarMuatUpdatePayload,
    isOpen: boolean
  ) => {
    try {
      const parsed = await UpdateBongkarMuatDTO.fromUpdateBongkarMuat(body);
      const {
        ownerCode,
        seriContainer,
        idKoorlap,
        idGroupTeam,
        jasaWrapping,
        idStatusBongkar,
        idBarang,
        idContainerSize,
        idAngkut,
      } = parsed;

      const existing = await this._bongkarRepository.findById(id, {
        include: {
          statusBongkar: true,
          tradeType: true,
        },
      });
      if (!existing) {
        throw { statusCode: 404, message: "Bongkar muat not found" };
      }

      const newNoContainer = `${ownerCode}-${seriContainer}`;
      const oldNoContainer = existing.noContainer;

      if (newNoContainer !== oldNoContainer) {
        const duplicate = await this._bongkarRepository.findOne({
          noContainer: newNoContainer,
          NOT: { noContainer: id },
        });

        if (duplicate) {
          throw {
            statusCode: 400,
            message: `bongkar muat with noContainer '${newNoContainer}' already registered`,
          };
        }
      }

      if (isOpen && existing.statusBongkar.name.toUpperCase() === "DONE") {
        throw {
          status: "Error",
          statusCode: 400,
          message: "Data sudah Done dan tidak dapat diedit",
        };
      }

      const koorlap = await this._employeeRepository.findOne({ id: idKoorlap });
      if (!koorlap) {
        throw { statusCode: 400, message: "Koorlap not found" };
      }

      const groupTeam = await this._groupTeamRepository.findOne({
        id: idGroupTeam,
      });
      if (!groupTeam) {
        throw { statusCode: 400, message: "Group team not found" };
      }

      const statusBongkar = await prisma.statusBongkar.findFirst({
        where: {
          id: idStatusBongkar,
        },
      });
      if (!statusBongkar) {
        throw { statusCode: 400, message: "Status bongkar not found" };
      }

      const isExport = existing.tradeType.id === 1;

      const data = {
        noContainer: newNoContainer,
        koorlap: { connect: { id: idKoorlap } },
        groupTeam: { connect: { id: idGroupTeam } },
        jasaWrapping: isExport ? false : jasaWrapping,
        endAT: statusBongkar.name.toUpperCase() === "DONE" ? new Date() : null,
        statusBongkar: { connect: { id: idStatusBongkar } },
        barang: idBarang ? { connect: { id: idBarang } } : undefined,
        containerSize: idContainerSize ? { connect: { id: idContainerSize } } : undefined,
        angkut: idAngkut ? { connect: { id: idAngkut } } : undefined,
      };

      return await this._bongkarRepository.updateSesiBongkar(id, data);
    } catch (error) {
      console.log("@BongkarMuatService:updateSesiBongkarMuat:error", error);
      throw error;
    }
  };

  deleteSesiBongkarMuat = async (id: string) => {
    return this._bongkarRepository.deleteSesiBongkar(id);
  };
}
export default BongkarMuatService;
