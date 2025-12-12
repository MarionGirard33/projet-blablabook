import BookCarousel from "@/components/CarouselDisplay";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getExternalBooks } from "@/api/externalBooks";

export default function HomePage() {
  const [search, setSearch] = useState("");

  const { data: searchResults = [] } = useQuery({
    queryKey: ["search-books", search],
    queryFn: () =>
      search.length >= 3
        ? getExternalBooks({ type: "search", searchText: search }).then(
            (res) => res.data.docs || []
          )
        : [],
    enabled: search.length >= 3,
  });

  const { data: randomResults = [] } = useQuery({
    queryKey: ["random-books"],
    queryFn: () =>
      getExternalBooks({ type: "random" }).then((res) => res.data.docs || []),
  });

  const { data: categoryResults = [] } = useQuery({
    queryKey: ["category-books", "horror"],
    queryFn: () =>
      getExternalBooks({
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
          <BookCarousel title={"Horreur"} books={categoryResults} />
        </>
      )}
    </div>
  );
}
