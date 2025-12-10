import type { GetBooksParams } from "@/types/books";
import api from "./axios";

export function getBooks(params: GetBooksParams) {
  const query: Record<string, string> = {};
  if (params.type) query.type = params.type;
  if (params.categoryName) query.categoryName = params.categoryName;
  if (params.searchText) query.searchText = params.searchText;

  return api.get(`/books`, { params: query });
}
