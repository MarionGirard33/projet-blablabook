import BookCarousel from "@/components/CarouselDisplay";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { searchExternalBooks } from "@/api/externalBooks";
import type { ExternalBook } from "@/@types/externalBooks";

export default function HomePage() {
  const [search, setSearch] = useState("");

  const { data: searchResults = [] } = useQuery<ExternalBook[]>({
    queryKey: ["externalBooks", search],
    queryFn: () =>
      searchExternalBooks({ type: "searchText", searchText: search }),
  });

  const { data: randomResults = [] } = useQuery({
    queryKey: ["random-external-books"],
    queryFn: () => searchExternalBooks({ type: "random" }),
  });

  const { data: byCategoryResults = [] } = useQuery({
    queryKey: ["by-category-external-books"],
    queryFn: () =>
      searchExternalBooks({ type: "category", categoryName: "bestsellers" }),
  });

  return (
    <div className="flex-col w-full">
      <Hero />
      <SearchBar onSearch={setSearch} />
      {search.length >= 3 ? (
        <BookCarousel
          title={`Résultats pour "${search}"`}
          books={searchResults}
        />
      ) : (
        <>
          <BookCarousel title={"Suggestions Aléatoire"} books={randomResults} />
          <BookCarousel title={"Le top du top"} books={byCategoryResults} />
        </>
      )}
    </div>
  );
}
