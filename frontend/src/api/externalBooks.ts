import type { GetExternalBooksParams } from "@/@types/externalBooks";
import { getRandomQuery } from "../lib/utils";
import externalApi from "./axiosExternal";

export function getExternalBooks(params: GetExternalBooksParams) {
  let url = "/search.json";
  let query: Record<string, string> = {};

  const randomKey = getRandomQuery();

  if (params.type === "random") {
    query.q = randomKey;
    query.sort = "random";
    query.limit = "10";
  } else if (params.type === "category") {
    if (!params.categoryName) {
      throw new Error("No category provided for category search.");
    }
    query.q = params.categoryName;
    query.limit = "10";
  } else if (params.type === "search") {
    query.q = params.searchText || "";
    query.limit = "10";
  }

  return externalApi.get(url, { params: query });
}
