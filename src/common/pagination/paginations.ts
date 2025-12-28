export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export type PaginationParams = {
  skip: number;
  take: number;
  page: number;
  limit: number;
};

export function getPagination(props: PaginationQuery): PaginationParams {
  const { page = "1", limit = "10" } = props;
  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.max(parseInt(limit), 1);
  const skip = (pageNum - 1) * limitNum;

  return {
    skip,
    take: limitNum,
    page: pageNum,
    limit: limitNum,
  };
}
