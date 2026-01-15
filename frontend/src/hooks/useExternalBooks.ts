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
        queryKey: ["externalBooks", mode, param],
        queryFn: () =>
          searchExternalBooks({ type: "searchText", searchText: param! }),
        staleTime: 1000 * 60 * 5, //5mins
        enabled: !!param && param.length > 0,
      });

    case "random":
      return useQuery<ExternalBook[]>({
        queryKey: ["random-external-books", mode],
        queryFn: () => searchExternalBooks({ type: "random" }),
        staleTime: 1000 * 60 * 5, //5mins
      });

    case "category":
      return useQuery<ExternalBook[]>({
        queryKey: ["by-category-external-books", mode, param],
        queryFn: () =>
          searchExternalBooks({ type: "category", categoryName: param! }),
        staleTime: 1000 * 60 * 5, //5mins
      });
  }
};
