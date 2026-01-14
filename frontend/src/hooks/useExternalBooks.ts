import { useQuery } from "@tanstack/react-query";
import type {
  ExternalBook,
  UseExternalBooksOptions,
} from "@/@types/externalBooks";
import { searchExternalBooks } from "@/api/externalBooks";

export const useExternalBooks = ({ mode, param }: UseExternalBooksOptions) => {
  switch (mode) {
    case "search":
      return useQuery<ExternalBook[]>({
        queryKey: ["externalBooks", param],
        queryFn: () =>
          searchExternalBooks({ type: "searchText", searchText: param! }),
        staleTime: 1000 * 60 * 5,
        enabled: !!param && param.length > 0,
      });

    case "random":
      return useQuery<ExternalBook[]>({
        queryKey: ["random-external-books"],
        queryFn: () => searchExternalBooks({ type: "random" }),
        staleTime: 1000 * 60 * 5,
      });

    case "category":
      return useQuery<ExternalBook[]>({
        queryKey: ["by-category-external-books", param],
        queryFn: () =>
          searchExternalBooks({ type: "category", categoryName: param! }),
        staleTime: 1000 * 60 * 5,
      });
  }
};
