import { prisma } from "src/config/database/client";
import { buildSingleSearch } from "@common/filter/sigleSearch/sigleSearch";
import { buildDateFilter } from "@common/filter/dateFilter/dateFilter";
import { Prisma } from "@prisma/client";

export default class CommonOptionsServices {
  public async findRole(params: any) {
    const search = buildSingleSearch("name", params.value);
    console.log("dataRole", params.role);

    let rolesArray: string[] | undefined;
    if (params.role == null) {
      rolesArray = undefined;
    } else if (Array.isArray(params.role)) {
      rolesArray = params.role.map(String);
    } else if (typeof params.role === "string") {
      try {
        const parsed = JSON.parse(params.role);
        rolesArray = Array.isArray(parsed)
          ? parsed.map(String)
          : [String(parsed)];
      } catch {
        rolesArray = params.role
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
    } else {
      rolesArray = [String(params.role)];
    }

    const where: any = {
      ...(params.value ? search : {}),
      ...(rolesArray && rolesArray.length ? { name: { in: rolesArray } } : {}),
    };

    const roles = await prisma.role.findMany({
      where: where,
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return roles;
  }

  public async findTransportMethod(params: any) {
    const search = buildSingleSearch("name", params.value);

    const where: any = params.value ? search : {};

    if (params.filter === "true") {
      where.name = {
        not: "ALL",
      };
    }

    const data = await prisma.angkut.findMany({
      where,
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return data;
  }

  public findCategoryItem = async (params: any) => {
    const search = buildSingleSearch("name", params.value);
    const where: any = {
      ...(params.value ? search : {}),
      status: true,
    };

    if (params.filter === "true") {
      where.name = {
        not: "ALL",
      };
    }

    const data = await prisma.barang.findMany({
      where,
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return data;
  };

  public findEmployee = async (params: any = {}) => {
    const { role, value } = params;

    let roleCondition = {};

    if (Array.isArray(role)) {
      roleCondition = {
        role: {
          name: {
            in: role,
          },
        },
      };
    }

    const whereQuery: Prisma.EmployeeWhereInput = {
      status: true,
      ...(value ? buildSingleSearch("namaLengkap", value) : {}),
      ...roleCondition,
    };

    return await prisma.employee.findMany({
      where: whereQuery,
      select: {
        id: true,
        namaLengkap: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  };

  public async findGroupTim(params: any) {
    const stringUsername = buildSingleSearch("username", params.value);
    const dateOrderBy = buildDateFilter(params);
    const orderBy = [];

    if (dateOrderBy) orderBy.push(dateOrderBy);

    const matchedTims = await prisma.team.findMany({
      where: {
        employee: {
          ...stringUsername,
        },
      },
      select: {
        idGroupTeam: true,
      },
    });

    const groupTimIds = [...new Set(matchedTims.map((tim) => tim.idGroupTeam))];

    if (groupTimIds.length === 0) {
      return { data: [], total: 0 };
    }

    const groupTimList = await prisma.groupTeam.findMany({
      where: {
        id: {
          in: groupTimIds,
        },
        status: true,
      },
      orderBy: orderBy,
      include: {
        team: {
          include: {
            employee: true,
          },
        },
      },
    });

    const mappedData = groupTimList.map((group) => ({
      idGroupTeam: group.id,
      GroupTeam: {
        status: group.status,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
      },
      ListTeam: group.team.map((item) => ({
        id: item.id,
        namaLengkap: item.employee.namaLengkap,
      })),
    }));
    return mappedData;
  }

  public async findContainerSize(params: any = {}) {
    const where: any = {};
    if (params.filter === "true") {
      where.name = { not: "ALL" };
    }
    return await prisma.containerSize.findMany({ where });
  }

  public async findTradeType(params: any = {}) {
    const where: any = {};
    if (params.filter === "true") {
      where.name = { not: "ALL" };
    }
    return await prisma.tradeType.findMany({ where });
  }


  public async findTim() {
    return await prisma.team.findMany();
  }

  public async findStatusBongkar() {
    return prisma.statusBongkar.findMany();
  }
}
