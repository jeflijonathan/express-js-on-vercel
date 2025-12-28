import { FilterParams } from "@common/types";
import { Request } from "express";
import QueryString from "qs";

export function QueryParsed(req: Request): FilterParams {
  const url = new URL(req.originalUrl, `http://${req.headers.host}`);
  const parsed = QueryString.parse(url.search.slice(1));

  return (parsed.params as FilterParams) ?? parsed;
}
