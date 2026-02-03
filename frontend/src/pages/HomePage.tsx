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

  const { data: bestSellerResults = [], isLoading: isBestSellerLoading } =
    useExternalBooks({
      mode: "category",
      param: "bestsellers",
    });

  const { data: horrorResults = [], isLoading: isHorrorLoading } =
    useExternalBooks({
      mode: "category",
      param: "horror",
    });

  let content;
  if (isSearchLoading) {
    content = (
      <div
        className="flex justify-center items-center h-64"
        role="status"
        aria-live="polite"
      >
        <Loader2
          className="h-12 w-12 animate-spin text-primary"
          aria-hidden="true"
        />
        <span className="sr-only">Chargement des résultats...</span>
      </div>
    );
  } else if (searchResults.length > 0) {
    content = (
      <CarouselDisplay
        title={`Résultats pour "${search}"`}
        books={searchResults}
        isLoading={isSearchLoading}
        seeAllButton={false}
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
          seeAllButton={true}
        />
        <CarouselDisplay
          title={"Tendances du moment"}
          books={bestSellerResults}
          mode={"category"}
          categoryName={"bestsellers"}
          isLoading={isBestSellerLoading}
          seeAllButton={true}
        />
        <CarouselDisplay
          title={"Frissons et Horreur"}
          books={horrorResults}
          mode={"category"}
          categoryName={"horror"}
          isLoading={isHorrorLoading}
          seeAllButton={true}
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
      <div className="min-h-[500px]">{content}</div>
    </div>
  );
}
