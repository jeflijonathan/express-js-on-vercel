import BasePrismaService, {
  Paginator,
  Sorter,
} from "@common/base/basePrismaService";
import { Sort } from "@common/utils/const";
import { Prisma } from "@prisma/client";
import { prisma } from "src/config/database/client";

class EmployeeRepository extends BasePrismaService<
  typeof prisma.employee,
  Prisma.EmployeeWhereInput,
  Prisma.EmployeeSelect,
  Prisma.EmployeeInclude
> {
  constructor() {
    super(prisma.employee);
  }

  async findAll(
    where: Prisma.EmployeeWhereInput = {},
    paginator?: Paginator,
    options?: {
      select?: Prisma.EmployeeSelect;
      include?: Prisma.EmployeeInclude;
    },
    sorter?: Sorter
  ) {
    return this.find({ query: where, sorter: sorter }, paginator, options);
  }

  async findById(
    id: string,
    options?: {
      select?: Prisma.EmployeeSelect;
      include?: Prisma.EmployeeInclude;
    }
  ) {
    return this.findOne({ id }, options);
  }

  async createEmployee(data: Prisma.EmployeeCreateInput) {
    return prisma.employee.create({ data });
  }

  async updateEmployee(id: string, data: Prisma.EmployeeUpdateInput) {
    return this.update({ id }, data);
  }

  async deleteEmployee(id: string) {
    return this.delete({ id });
  }
}

export default EmployeeRepository;
