import BookCarousel from "@/components/CarouselDisplay";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  getRandomExternalBooks,
  searchExternalBooks,
} from "@/api/externalBooks";
import type { ExternalBook } from "@/@types/externalBooks";

export default function HomePage() {
  const [search, setSearch] = useState("");

  const { data: searchResults = [] } = useQuery<ExternalBook[]>({
    enabled: false,
    queryKey: ["externalBooks", search],
    queryFn: () => searchExternalBooks(search),
  });

  const { data: randomResults = [] } = useQuery({
    queryKey: ["random-external-books"],
    queryFn: () =>
      getRandomExternalBooks({ type: "random" }).then(
        (res) => res.data.docs || []
      ),
  });

  const { data: categoryResults = [] } = useQuery({
    queryKey: ["category-external-books", "bestsellers"],
    queryFn: () =>
      getRandomExternalBooks({
        type: "category",
        categoryName: "bestsellers",
      }).then((res) => res.data.docs || []),
  });

  return (
    <div className="flex-col w-full">
      <Hero />
      <SearchBar onSearch={setSearch} />
      {search.length >= 3 && searchResults.length > 0 ? (
        <BookCarousel
          title={`Résultats pour "${search}"`}
          books={searchResults}
        />
      ) : (
        <>
          <BookCarousel title={"Suggestions Aléatoire"} books={randomResults} />
          <BookCarousel title={"Le top du top"} books={categoryResults} />
        </>
      )}
    </div>
  );
}
