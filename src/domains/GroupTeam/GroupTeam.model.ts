export type GroupTimResponseModel = {
  id: string;
  status: boolean;
};

export type UserResponseModel = {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TimResponseModel = {
  GroupTim: GroupTimResponseModel;
  ListTim: UserResponseModel[];
};
