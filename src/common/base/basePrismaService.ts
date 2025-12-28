import { StatusBadRequest } from "@common/consts/statusCodes";

export interface Sorter {
  [field: string]: "asc" | "desc" | Sorter;
}

interface Filter<TWhere> {
  query?: TWhere;
  sorter?: Sorter | null;
}

export interface Paginator {
  page: number;
  limit: number;
}

export default class BasePrismaService<
  TDelegate extends {
    findMany: any;
    count: any;
    findFirst: any;
    create: any;
    createMany: any;
    update: any;
    delete: any;
  },
  TWhere,
  TSelect,
  TInclude
> {
  protected model: TDelegate;

  constructor(model: TDelegate) {
    this.model = model;
  }

  getPrisma() {
    return (this.model as any)._prisma || (this.model as any).prisma || require("src/config/database/client").prisma;
  }

  async find(
    filter: Filter<TWhere> = { query: {} as TWhere, sorter: null },
    paginator?: Paginator,
    options?: {
      select?: TSelect;
      include?: TInclude;
    }
  ) {
    try {
      const queryOptions: any = {
        where: filter.query,
      };

      if (paginator) {
        const pageNum = Number(paginator.page) || 1;
        const limitNum = Number(paginator.limit) || 10;

        if (!Number.isInteger(limitNum) || limitNum <= 0) {
          throw {
            statusCode: StatusBadRequest,
            message: "Invalid paginator.limit: must be a positive integer",
          };
        }

        queryOptions.skip = limitNum * (pageNum - 1);
        queryOptions.take = limitNum;
      }

      if (filter.sorter) {
        queryOptions.orderBy = filter.sorter;
      }

      if (options?.select) {
        queryOptions.select = options.select;
      }

      if (options?.include) {
        queryOptions.include = options.include;
      }

      return await this.model.findMany(queryOptions);
    } catch (error) {
      const msg = (error && (error as any).message) || "";
      if (
        typeof msg === "string" &&
        /namaLengkap|Unknown column|does not exist/i.test(msg)
      ) {
        throw {
          statusCode: 500,
          message:
            "Database schema is missing the column 'Employee.namaLengkap'.\nRun a Prisma migration to add the column and copy data from 'username' (see backend/scripts/copyEmployeeUsernamesToNamaLengkap.ts). Example:\n  npx prisma migrate dev --name add_namaLengkap_to_employee\n  npx ts-node -r tsconfig-paths/register scripts/copyEmployeeUsernamesToNamaLengkap.ts",
        };
      }

      throw error;
    }
  }

  async findMany(
    filter: Filter<TWhere> = { query: {} as TWhere, sorter: null },
    options?: {
      select?: TSelect;
      include?: TInclude;
    }
  ) {
    try {
      const queryOptions: any = {
        where: filter.query,
      };

      if (filter.sorter) {
        queryOptions.orderBy = filter.sorter;
      }

      if (options?.select) {
        queryOptions.select = options.select;
      }

      if (options?.include) {
        queryOptions.include = options.include;
      }

      return await this.model.findMany(queryOptions);
    } catch (error) {
      const msg = (error && (error as any).message) || "";
      if (
        typeof msg === "string" &&
        /namaLengkap|Unknown column|does not exist/i.test(msg)
      ) {
        throw {
          statusCode: 500,
          message:
            "Database schema is missing the column 'Employee.namaLengkap'.\nRun a Prisma migration to add the column and copy data from 'username' (see backend/scripts/copyEmployeeUsernamesToNamaLengkap.ts). Example:\n  npx prisma migrate dev --name add_namaLengkap_to_employee\n  npx ts-node -r tsconfig-paths/register scripts/copyEmployeeUsernamesToNamaLengkap.ts",
        };
      }

      throw error;
    }
  }

  async count(filter: Filter<TWhere> = { query: {} as TWhere }) {
    try {
      return await this.model.count({
        where: filter.query,
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(
    filter: TWhere = {} as TWhere,
    options?: {
      select?: TSelect;
      include?: TInclude;
    }
  ) {
    try {
      return await this.model.findFirst({
        where: filter,
        select: options?.select,
        include: options?.include,
      });
    } catch (error) {
      throw error;
    }
  }

  async create(data: any) {
    try {
      const payload =
        data &&
          typeof data === "object" &&
          "data" in data &&
          Object.keys(data).length === 1
          ? data.data
          : data;

      return await this.model.create({
        data: payload,
      });
    } catch (err) {
      throw err;
    }
  }

  async createMany<T>(data: T) {
    try {
      const payload =
        data &&
          typeof data === "object" &&
          "data" in data &&
          Object.keys(data).length === 1
          ? data.data
          : data;

      return await this.model.createMany({
        data: payload,
      });
    } catch (err) {
      throw err;
    }
  }

  async update<T>(
    filter: TWhere,
    updateData: T,
    options?: {
      select?: TSelect;
      include?: TInclude;
    }
  ) {
    try {
      return await this.model.update({
        where: filter,
        data: updateData,
        select: options?.select,
        include: options?.include,
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(filter: any) {
    try {
      return await this.model.delete({
        where: filter,
      });
    } catch (error) {
      throw error;
    }
  }
}
