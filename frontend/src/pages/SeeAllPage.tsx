import type { SearchParamsSeeAllPage } from "@/@types/seeAllPageProps";
import BookCardCarousel from "@/components/BookCardCarousel";
import SearchBar from "@/components/SearchBar";
import { useExternalBooks } from "@/hooks/useExternalBooks";
import { seeAllRoute } from "@/routes/routes";
import { useMemo, useState } from "react";
import type { BookDisplay } from "@/@types/books";
import { mapExternalBookToDisplay } from "@/lib/bookDisplayMapper";

export default function SeeAllPage() {
  const searchParams = seeAllRoute.useSearch() as SearchParamsSeeAllPage;
  const mode = searchParams.mode;
  const title = searchParams.title;
  const categoryName = searchParams.categoryName;
  const param = mode === "category" ? categoryName : undefined;

  const [query, setQuery] = useState("");

  // Récupère les livres internes bruts
  const internalBooks = searchParams.books ?? [];

  const internalBooksDisplay: BookDisplay[] = internalBooks.filter(
    (book) => book && book.key,
  );
  const { data: books = [], isLoading: isBooksLoading } = useExternalBooks({
    mode,
    param,
  });
  const externalBooksDisplay: BookDisplay[] = books.map(
    mapExternalBookToDisplay,
  );

  const filteredBooksDisplay = useMemo(() => {
    if (!query.trim()) return externalBooksDisplay;
    const lowerQuery = query.toLowerCase();
    return externalBooksDisplay.filter(
      (book) =>
        book.title?.toLowerCase().includes(lowerQuery) ||
        book.author?.toLowerCase().includes(lowerQuery),
    );
  }, [externalBooksDisplay, query]);

  let content;
  if (isBooksLoading) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {internalBooksDisplay.map((book) => (
          <BookCardCarousel key={book.key} book={book} />
        ))}
      </div>
    );
  } else if (filteredBooksDisplay.length > 0) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooksDisplay.map((book) => (
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
