import CarouselDisplay from "@/components/CarouselDisplay";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";
import { useExternalBooks } from "@/hooks/useExternalBooks";
import { getBooks } from "@/api/books";
import type { Book } from "@/@types/books";
import type { ExternalBook } from "@/@types/externalBooks";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [internalBooks, setInternalBooks] = useState<Book[]>();

  function mapBookToExternalBook(book: Book): ExternalBook {
    return {
      key: book.id.toString(),
      title: book.name,
      author: book.author,
      cover: book.coverId ?? "",
      isbn: book.isbn,
      categories: book.categories,
    };
  }

  useEffect(() => {
    getBooks().then((books: Book[]) => {
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
          books={
            isRandomLoading
              ? (internalBooks || []).map(mapBookToExternalBook)
              : randomResults
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
                  .map(mapBookToExternalBook)
              : bestSellerResults
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
                  .map(mapBookToExternalBook)
              : horrorResults
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
