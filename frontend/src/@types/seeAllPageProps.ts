import type { BookDisplay } from "./books";

export type SearchParamsSeeAllPage = {
  title: string;
  books?: BookDisplay[];
  mode: "random" | "category";
  categoryName?: string;
};
