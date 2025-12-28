export type UserFilterParams = {
  page?: number;
  limit?: number;
  value?: string;
  status?: boolean;
  sort?: string;
  order_by?: "asc" | "desc";
};

export type Role = {
  id: number;
  name: string;
  createAt: Date;
  updateAt: Date;
};

export type UserModel = {
  id: string;
  username: string;
  email: string;
  password: string;
  roleId: number;
  role?: Role;
  createdAt: Date;
  updatedAt: Date;
};

export type CeateUserByEmployeeIdModel = {
  employeeId: string;
  roleId: number;
  password: string;
  confirmationPassword: string;
};

export type UpdateUserModel = {
  namaLengkap: string;
  username: string;
  email: string;
  confirmationPassword: string;
  password: string;
  roleId: number;
  status: boolean;
};

export type UserLoginModel = {
  email: string;
  password: string;
};

export type UserLoginResponseModel = {
  username: string;
  role: string;
  token: string;
  refreshToken: string;
};
