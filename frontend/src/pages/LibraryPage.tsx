import { useLibraryStore } from "@/stores/libraryStore";
import { LibraryBookCard } from "@/components/BookCard";

export default function LibraryPage() {
  // Get books and removeBook action from Zustand store
  const books = useLibraryStore((s) => s.books);
  const removeBook = useLibraryStore((s) => s.removeBook);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Library</h1>

      {books.length === 0 ? (
        <p className="text-gray-500">Your library is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <LibraryBookCard
              key={book.id}
              book={book}
              onRemove={() => removeBook(book.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
