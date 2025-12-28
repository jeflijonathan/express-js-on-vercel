import { buildSingleSearch } from "@common/filter/sigleSearch/sigleSearch";
import { encrypt } from "@common/utils/encrypt";
import JwtServices from "src/services/jwtService";
import buildStatusFilter from "@common/filter/statusFilter/statusFilter";
import CreateUserDTO, {
  IUserCreatePayload,
  IUserWithEmployeePayload,
} from "./dto/userCreate.dto";
import { Prisma } from "@prisma/client";
import UpdateUserDTO from "./dto/userUpdate.dto";
import {
  EmployeeRepository,
  RoleRepository,
  UserRepository,
} from "src/repository";
import { StatusBadRequest } from "@common/consts/statusCodes";
import { Sorter } from "@common/base/basePrismaService";
import { selectDataUser } from "./User.model";
import { UpdateUserModel, UserFilterParams } from "./User.type";

class UserService {
  private jwtService = new JwtServices();

  _userRepository;
  _employeeRepository;
  _roleRepository;

  constructor() {
    this._userRepository = new UserRepository();
    this._employeeRepository = new EmployeeRepository();
    this._roleRepository = new RoleRepository();
  }

  async findAllUser(params: UserFilterParams = {}) {
    try {
      const { page = 1, limit = 10, value, status = true } = params;

      const searchFilter = buildSingleSearch("namaLengkap", value);
      const statusFilter = buildStatusFilter("status", status);

      const where: Prisma.UserWhereInput = {
        employee: {
          ...searchFilter,
          ...statusFilter,
        },
      };

      let sorter: Sorter | undefined;

      if (params.sort && params.order_by) {
        const orderLower = params.order_by.toLowerCase();

        if (orderLower === "asc" || orderLower === "desc") {
          const order = orderLower as "asc" | "desc";

          sorter = {
            employee: {
              [params.sort]: order,
            },
          };
        }
      }

      const data = await this._userRepository.findAll(
        where,
        {
          page,
          limit,
        },
        {
          select: {
            id: true,
            username: true,
            employee: {
              select: {
                id: true,
                namaLengkap: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                status: true,
              },
            },
          },
        },
        sorter
      );

      const total = await this._userRepository.count({ query: where });

      const pagination = {
        page,
        limit,
        total_items: total,
        total_pages: Math.ceil(total / limit),
      };

      return { data, pagination };
    } catch (error) {
      console.log("@UserService:findAllUsers:error", error);
      throw error;
    }
  }

  async findUserById(id: string) {
    try {
      const result = await this._userRepository.findById(id, {
        ...selectDataUser,
      });

      return result;
    } catch (error) {
      console.log("@UserService:findUserById:error", error);
      throw error;
    }
  }

  async handleCreateUserWithEmployeeId(data: IUserCreatePayload) {
    try {
      const parsed = await CreateUserDTO.fromCreateUserWithEmployeeId(data);

      const { employeeId, roleId, password, username } = parsed;

      const employeeCheck = await this._employeeRepository.findOne({
        id: employeeId,
      });

      if (!employeeCheck) {
        throw {
          statusCode: StatusBadRequest,
          message: `Employee with id ${employeeId} not found`,
        };
      }

      const userCheck = await this._userRepository.findOne({
        employee: { id: employeeId },
      });

      if (userCheck) {
        throw {
          statusCode: StatusBadRequest,
          message: `User with employeeId '${employeeId}' already created`,
        };
      }

      await this._employeeRepository.updateEmployee(employeeId, {
        role: { connect: { id: roleId } },
      });

      return await this._userRepository.createUser({
        username,
        employee: {
          connect: { id: employeeId },
        },
        password: await encrypt(password),
      });
    } catch (error) {
      console.log("@UserService:handleCreateUserWithEmployeeId:error", error);
      throw error;
    }
  }

  async handleCreateUserAndEmployee(data: IUserWithEmployeePayload) {
    try {
      console.log(data);
      const parsed = await CreateUserDTO.fromCreateUserWithEmployee(data);

      const { email, roleId, password, namaLengkap, username } = parsed;

      const isEmailDuplicate = await this._employeeRepository.findOne({
        email,
      });

      if (isEmailDuplicate) {
        throw {
          statusCode: StatusBadRequest,
          message: `Email '${email}' already exists`,
        };
      }

      const employee = await this._employeeRepository.createEmployee({
        namaLengkap,
        email,
        role: { connect: { id: roleId } },
        status: true,
      });

      if (!employee) {
        throw {
          statusCode: StatusBadRequest,
          message: "error create employeeid",
        };
      }
      return await this._userRepository.createUser({
        username,
        employee: { connect: { id: employee.id } },
        password: await encrypt(password),
      });
    } catch (error) {
      console.log("@UserService:handleCreateUserAndEmployee:error", error);
      throw error;
    }
  }

  async updateUser(id: string, body: UpdateUserModel) {
    const parsed = await UpdateUserDTO.fromUpdateUser(body);

    const {
      password,
      confirmationPassword,
      username,
      email,
      roleId,
      status,
      namaLengkap,
    } = parsed;

    var hashedPassword: string | undefined = undefined;

    if (password || confirmationPassword) {
      hashedPassword = await encrypt(password!);
    }

    const roleResult = await this._roleRepository.findOne({ id: roleId });
    const role = ["ADMIN", "MANAJER", "SPV"];

    if (!role.includes(roleResult?.name)) {
      throw {
        statusCode: StatusBadRequest,
        message: "You are not allowed to change this role",
      };
    }

    const user = await this._userRepository.updateUser(id, {
      username: username,
      password: hashedPassword,
      employee: {
        update: {
          namaLengkap: namaLengkap,
          email: email,
          roleId: roleId,
          status: status,
        },
      },
    });

    return user;
  }
}

export default UserService;
