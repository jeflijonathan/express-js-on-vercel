import { Sorter } from "@common/base/basePrismaService";
import { StatusBadRequest } from "@common/consts/statusCodes";
import { buildSingleSearch } from "@common/filter/sigleSearch/sigleSearch";
import BongkarMuatRepository from "src/repository/bongkarMuat/bongkarMuat.repository";
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


            barang: {
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
            groupTeam: {
              include: {
                team: {
                  include: {
                    employee: true,
                  },
                },
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

          barang: {
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
          groupTeam: {
            include: {
              team: {
                include: {
                  employee: true,
                },
              },
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
        platContainer,
        startAT,
        endAT,
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
        throw { statusCode: 400, message: `Group team ${idGroupTeam} not found` };
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

      const data: any = {
        noContainer: noContainer.toUpperCase(),
        koorlap: {
          connect: {
            id: idKoorlap,
          },
        },
        barang: {
          connect: {
            id: idBarang,
          },
        },
        groupTeam: {
          connect: {
            id: idGroupTeam,
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
        platContainer: platContainer,
        startAT: new Date(startAT),
        endAT: endAT ? new Date(endAT) : null,
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
        platContainer,
        startAT,
        endAT,
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
        throw { statusCode: 400, message: `Group team ${idGroupTeam} not found` };
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

      const data: any = {
        noContainer: noContainer.toUpperCase(),
        koorlap: { connect: { id: idKoorlap } },
        groupTeam: { connect: { id: idGroupTeam } },
        barang: { connect: { id: barangAll.id } },
        containerSize: { connect: { id: idContainerSize } },
        tradeType: { connect: { id: 1 } },
        angkut: { connect: { id: idAngkut } },
        jasaWrapping: false,
        platContainer: platContainer,
        startAT: new Date(startAT),
        endAT: endAT ? new Date(endAT) : null,
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
    userRole: string
  ) => {
    try {
      const parsed = await UpdateBongkarMuatDTO.fromUpdateBongkarMuat(body);
      const {
        ownerCode,
        seriContainer,
        idKoorlap,
        idGroupTeam,
        jasaWrapping,

        idBarang,
        idContainerSize,
        idAngkut,
        idTradeType,
        platContainer,
        startAT,
        endAT,
      } = parsed;

      const existing = await this._bongkarRepository.findById(id, {
        include: {
          tradeType: true,
        },
      });
      if (!existing) {
        throw { statusCode: 404, message: "Bongkar muat not found" };
      }

      const isManajer = userRole === "MANAJER" || userRole === "ADMIN";

      // Manajer/Admin can edit anything
      if (!isManajer) {
        // Non-managers have limited editing capabilities
        // You can add additional restrictions here if needed
      }

      const newNoContainer =
        ownerCode !== undefined && seriContainer !== undefined
          ? `${ownerCode}-${seriContainer}`
          : existing.noContainer;
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

      if (idKoorlap) {
        const koorlap = await this._employeeRepository.findOne({ id: idKoorlap });
        if (!koorlap) {
          throw { statusCode: 400, message: "Koorlap not found" };
        }
      }

      if (idGroupTeam) {
        const groupTeam = await this._groupTeamRepository.findOne({
          id: idGroupTeam,
        });
        if (!groupTeam) {
          throw { statusCode: 400, message: `Group team ${idGroupTeam} not found` };
        }
      }



      const finalTradeTypeId = idTradeType ?? existing.tradeType.id;
      const isExport = finalTradeTypeId === 1;

      let finalIdBarang = idBarang;
      if (isExport) {
        const barangAll = await this._barangRepository.findOne({ name: "ALL" });
        if (barangAll) {
          finalIdBarang = barangAll.id;
        }
      }

      const data: any = {
        noContainer: newNoContainer,
        platContainer: platContainer ?? existing.platContainer,
        jasaWrapping: isExport ? false : (jasaWrapping ?? existing.jasaWrapping),
        groupTeam: idGroupTeam ? { connect: { id: idGroupTeam } } : undefined,
        barang: finalIdBarang ? { connect: { id: finalIdBarang } } : undefined,
        containerSize: idContainerSize
          ? { connect: { id: idContainerSize } }
          : (existing.idContainerSize ? { connect: { id: existing.idContainerSize } } : undefined),
        angkut: idAngkut ? { connect: { id: idAngkut } } : (existing.idAngkut ? { connect: { id: existing.idAngkut } } : undefined),
      };

      if (idKoorlap) {
        data.koorlap = { connect: { id: idKoorlap } };
      }


      if (idTradeType && idTradeType !== existing.tradeType.id) {
        data.tradeType = { connect: { id: idTradeType } };
      }

      // Update startAT and endAT logic
      if (isManajer) {
        if (startAT) {
          data.startAT = new Date(startAT);
        }
        if (endAT !== undefined) {
          data.endAT = endAT ? new Date(endAT) : null;
        }
      } else if (userRole === "SPV") {
        // SPV strict validation
        if (
          newNoContainer !== existing.noContainer ||
          (idKoorlap && idKoorlap !== existing.koorlapId) ||
          (idGroupTeam && idGroupTeam !== existing.idGroupTeam) ||
          (jasaWrapping !== undefined && jasaWrapping !== existing.jasaWrapping) ||
          (idBarang && idBarang !== existing.idBarang) ||
          (idContainerSize && idContainerSize !== existing.idContainerSize) ||
          (idAngkut && idAngkut !== existing.idAngkut) ||
          (idTradeType && idTradeType !== existing.tradeType.id) ||
          (platContainer && platContainer !== existing.platContainer) ||
          (startAT && new Date(startAT).getTime() !== new Date(existing.startAT).getTime())
        ) {
          throw {
            statusCode: StatusBadRequest,
            message:
              "SPV only allowed to update End Time. Other information is read-only.",
          };
        }

        if (endAT !== undefined) {
          if (existing.endAT !== null) {
            throw {
              statusCode: StatusBadRequest,
              message: "End Time has already been set and cannot be changed by SPV."
            };
          }
          data.endAT = endAT ? new Date(endAT) : null;
        } else {
          // If SPV is not updating endAT, there's nothing for them to do here
          throw {
            statusCode: StatusBadRequest,
            message: "No changes provided or not allowed for SPV."
          };
        }

        // Clean up data object for SPV to be absolutely sure only endAT is updated
        // prisma connect/set might still be in 'data' from initialization above
        const spvData: any = { endAT: data.endAT };
        return await this._bongkarRepository.updateSesiBongkar(id, spvData);
      }

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
