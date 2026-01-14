import CarouselDisplay from "@/components/CarouselDisplay";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";
import { useExternalBooks } from "@/hooks/useExternalBooks";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [search, setSearch] = useState("");

  const { data: searchResults = [], isLoading: isSearchLoading } =
    useExternalBooks({
      mode: "search",
      param: search,
    });

  const { data: randomResults = [], isLoading: isRandomLoading } =
    useExternalBooks({
      mode: "random",
    });

  const { data: byCategoryResults = [], isLoading: isCategoryLoading } =
    useExternalBooks({
      mode: "category",
      param: "bestsellers",
    });

  let content;
  if (isSearchLoading) {
    content = (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  } else if (searchResults.length > 0) {
    content = (
      <CarouselDisplay
        title={`Résultats pour "${search}"`}
        books={searchResults}
        isLoading={isSearchLoading}
      />
    );
  } else {
    content = (
      <>
        <CarouselDisplay
          title={"Suggestions Aléatoire"}
          books={randomResults}
          mode={"random"}
          isLoading={isRandomLoading}
        />
        <CarouselDisplay
          title={"Tendances du moment"}
          books={byCategoryResults}
          mode={"category"}
          categoryName={"bestsellers"}
          isLoading={isCategoryLoading}
        />
      </>
    );
  }

  return (
    <div className="flex-col w-full">
      <div className="sticky top-0 z-20 bg-white pb-2">
        <Hero />
        <SearchBar onSearch={setSearch} />
      </div>
      {content}
    </div>
  );
}
