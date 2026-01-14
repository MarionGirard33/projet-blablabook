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

  const { data: books = [] } = useExternalBooks({ mode, param });

  const filteredBooks = useMemo(() => {
    if (!query.trim()) return books;
    const lowerQuery = query.toLowerCase();
    return books.filter(
      (book) =>
        book.title?.toLowerCase().includes(lowerQuery) ||
        book.author?.toLowerCase().includes(lowerQuery)
    );
  }, [books, query]);

  return (
    <>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <SearchBar onSearch={setQuery} />

      {filteredBooks.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {filteredBooks.map((book) => (
            <BookCardCarousel key={book.key} book={book} />
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500">
          Aucun résultat trouvé.
        </div>
      )}
    </>
  );
}
