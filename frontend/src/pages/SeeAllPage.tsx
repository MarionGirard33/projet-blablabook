import type { Book } from "@/@types/books";
import type { SearchParamsSeeAllPage } from "@/@types/externalBooks";
import BookCardCarousel from "@/components/BookCardCarousel";
import SearchBar from "@/components/SearchBar";
import { useExternalBooks } from "@/hooks/useExternalBooks";
import { seeAllRoute } from "@/routes/routes";
import { useMemo, useState } from "react";

export default function SeeAllPage() {
  const searchParams = seeAllRoute.useSearch() as SearchParamsSeeAllPage;
  const mode = searchParams.mode;
  const title = searchParams.title;
  const categoryName = searchParams.categoryName;
  const param = mode === "category" ? categoryName : undefined;

  const [query, setQuery] = useState("");
  const internalBooks = (searchParams.books ?? []) as Book[];

  const { data: books = [], isLoading: isBooksLoading } = useExternalBooks({
    mode,
    param,
  });

  const filteredBooks = useMemo(() => {
    if (!query.trim()) return books;
    const lowerQuery = query.toLowerCase();
    return books.filter(
      (book) =>
        book.title?.toLowerCase().includes(lowerQuery) ||
        book.author?.toLowerCase().includes(lowerQuery),
    );
  }, [books, query]);

  let content;
  if (isBooksLoading) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {internalBooks?.map((book) => (
          <BookCardCarousel key={book.id} book={book} />
        ))}
      </div>
    );
  } else if (filteredBooks.length > 0) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <BookCardCarousel key={book.key} book={book} />
        ))}
      </div>
    );
  } else {
    content = (
      <div className="text-center text-gray-500 py-12">
        Aucun résultat trouvé.
      </div>
    );
  }

  return (
    <div className="min-h-screen text-center flex flex-col bg-white">
      <div className="sticky top-0">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <SearchBar onSearch={setQuery} />
        </div>
      </div>
      <div className="flex-1 min-h-0 max-w-5xl mx-auto w-full px-4 py-6">
        {content}
      </div>
    </div>
  );
}
