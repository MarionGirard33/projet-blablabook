import CarouselDisplay from "@/components/CarouselDisplay";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";
import { useExternalBooks } from "@/hooks/useExternalBooks";
import { getBooks } from "@/api/books";
import type { BookRow } from "@/@types/books";
import {
  mapBookRowToDisplay,
  mapExternalBookToDisplay,
} from "@/lib/bookDisplayMapper";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [internalBooks, setInternalBooks] = useState<BookRow[]>();

  useEffect(() => {
    getBooks().then((books: BookRow[]) => {
      setInternalBooks(books);
    });
  }, []);

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
  if (isSearchLoading || searchResults.length > 0) {
    content = (
      <CarouselDisplay
        title={`Résultats pour "${search}"`}
        books={searchResults.map(mapExternalBookToDisplay)}
        isLoading={isSearchLoading}
        seeAllButton={false}
      />
    );
  } else {
    content = (
      <>
        <CarouselDisplay
          title={"Suggestions Aléatoire"}
          books={
            isRandomLoading
              ? (internalBooks || []).map(mapBookRowToDisplay)
              : randomResults.map(mapExternalBookToDisplay)
          }
          mode={"random"}
          isLoading={!internalBooks}
          seeAllButton={true}
        />
        <CarouselDisplay
          title={"Tendances du moment"}
          books={
            isBestSellerLoading || bestSellerResults.length === 0
              ? (internalBooks || [])
                  .filter((book) => book.categories?.includes("bestsellers"))
                  .map(mapBookRowToDisplay)
              : bestSellerResults.map(mapExternalBookToDisplay)
          }
          mode={"category"}
          categoryName={"bestsellers"}
          isLoading={!internalBooks}
          seeAllButton={true}
        />
        <CarouselDisplay
          title={"Frissons et Horreur"}
          books={
            isHorrorLoading || horrorResults.length === 0
              ? (internalBooks || [])
                  .filter((book) => book.categories?.includes("horror"))
                  .map(mapBookRowToDisplay)
              : horrorResults.map(mapExternalBookToDisplay)
          }
          mode={"category"}
          categoryName={"horror"}
          isLoading={!internalBooks}
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
      <div className="min-h-125">{content}</div>
    </div>
  );
}
