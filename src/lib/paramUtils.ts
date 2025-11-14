import { SearchParams } from "@/types";
import { ReadonlyURLSearchParams } from "next/navigation";

export function parseSearchParams(params: SearchParams) {
  const page = parseInt(params.page as string, 10) || 1;
  const search = (params.search as string) || "";

  return { page, search };
}

export function parseParamsFromURLParams(params: ReadonlyURLSearchParams) {
  const page = parseInt(params.get("page") as string, 10) || 1;
  const search = (params.get("search") as string) || "";

  return { page, search };
}
