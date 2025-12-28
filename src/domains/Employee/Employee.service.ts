import { buildSingleSearch } from "@common/filter/sigleSearch/sigleSearch";
import buildStatusFilter from "@common/filter/statusFilter/statusFilter";
import { prisma } from "src/config/database/client";
import createHttpError from "http-errors";
import CreateEmployeeDTO, {
  IEmployeeCreatePayload,
} from "./dto/employeeCreate.dto";
import { StatusBadRequest, StatusConflict } from "@common/consts/statusCodes";
import UpdateEmployeeDTO from "./dto/employeeUpdate.dto";
import { EmployeeRepository } from "src/repository";
import { Sorter } from "@common/base/basePrismaService";

export default class EmployeeService {
  _employeeRepository;

  constructor() {
    this._employeeRepository = new EmployeeRepository();
  }
  async findAll(req: any, params: any = {}) {
    const { value, status, page = 1, limit = 10 } = params;

    const searchFilter = buildSingleSearch("namaLengkap", value);
    const statusFilter = buildStatusFilter("status", status);

    const where = {
      role: {
        name: {
          in: ["TIM", "KOORLAP"],
        },
      },
      ...searchFilter,
      ...statusFilter,
    };

    let sorter: Sorter | undefined;

    if (params.sort && params.order_by) {
      const order = params.order_by.toLowerCase();
      if (order === "asc" || order === "desc") {
        sorter = {
          [params.sort]: order,
        };
      }
    }

    const [data, total] = await Promise.all([
      this._employeeRepository.findAll(
        where,
        {
          page,
          limit,
        },
        {
          select: {
            id: true,
            email: true,
            namaLengkap: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            status: true,
          },
        },
        sorter
      ),
      this._employeeRepository.count({ query: where }),
    ]);

    return { data, total };
  }

  async findById(id: string) {
    const employee = await prisma.employee.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        namaLengkap: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        status: true,
      },
    });

    if (!employee) throw createHttpError(404, "Employee not found");

    return employee;
  }

  async handleCreateEmployee(data: IEmployeeCreatePayload) {
    const parsed = await CreateEmployeeDTO.fromCreateEmployee(data);
    const { namaLengkap, email, roleId } = parsed;

    const isEmailExist = await prisma.employee.findUnique({
      where: { email },
    });

    if (isEmailExist) {
      throw {
        statusCode: StatusConflict,
        message: `Email '${email}' already exists`,
      };
    }

    const role = await prisma.role.findFirst({
      where: { id: roleId },
    });
    const roleNotAllowed = ["ADMIN", "MANAJER", "SPV"];

    if (roleNotAllowed.find((item) => item == role?.name)) {
      throw {
        statusCode: StatusBadRequest,
        message: "You can't register this role here!",
      };
    }

    return await prisma.employee.create({
      data: {
        namaLengkap,
        email,
        roleId,
        status: true,
      },
      include: { role: true },
    });
  }

  async updateEmployee(id: string, data: any) {
    const parsed = await UpdateEmployeeDTO.fromUpdateEmployee(data);
    const { namaLengkap, email, roleId, status } = parsed;

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        namaLengkap,
        email,
        roleId,
        status,
      },
      include: { role: true },
    });

    return updatedEmployee;
  }
}
