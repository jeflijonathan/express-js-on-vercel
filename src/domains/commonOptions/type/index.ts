export type FilterEmployeeParams = {
  
  value: string;
}
export type RoleModel = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type TransportMethodModel = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
export type OptionsReponseModel = {
  id: string;
  name: string;
};

export type OperationTypeModel = {
  id: string;
  name: string;
};

export type CategoryItemModel = {
  id: string;
  name: string;
};

export type PegawaiModel = {
  id: string;
  name: string;
};

export type GroupTimResponseModel = {
  id: string;
  status: boolean;
};

export type TimResponseModel = {
  id: string;
  kdTim: string;
  idGroupTim: string;
  groupTim: GroupTimResponseModel;
  createdAt: string;
  updatedAt: string;
};
