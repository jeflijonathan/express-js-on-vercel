import { OrderBy } from "@common/utils/const";
import { Response } from "express";

export interface PaginationType {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
}

export type ApiResponse<T = any> = {
  res: Response;
  status?: boolean;
  statusCode: number;
  message: string;
  data: T;
  pagination?: PaginationType;
};

export type ErrorType = {
  statusCode: number;
  message: string;
  details?: any;
};

export type Filtering = {
  label: string | number;
  key: string | number;
};

export interface StringFilter {
  order_by?: OrderBy;
  sort?: string;
}

export type FetchParams = {
  params: {
    [key: string]: string | number;
  };
};

export type FilterParams = {
  [key: string]: string | number | undefined | string[] | number[];
};

export type WithPaginations<T> = {
  data: T;
  pagination: PaginationType;
};
