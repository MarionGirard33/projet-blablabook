// LibraryPage displays the user's personal book collection with basic
// filtering, counters by reading status, and a modal to add new books.
// Data is fetched via TanStack Query and updates automatically after mutations.
import { useEffect, useState } from "react";
import { BookCard } from "@/components/BookCard";
import { Plus, Search } from "lucide-react";
import type { Book } from "../@types/books";
import { AddBookModal } from "@/components/AddBookModal";
import { useAuthStore } from "@/stores/authStore";
import { useUserBooks } from "@/hooks/useUserBooks";

export default function LibraryPage() {
  const { user } = useAuthStore();
  const userId = user?.id;

  // Use custom hook for all book operations
  const { books, refetch, removeBook, updateStatus } = useUserBooks(userId);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  // Load books when a userId is set (or changes)
  useEffect(() => {
    if (userId) refetch();
  }, [userId, refetch]);

  // Client-side filtering by title
  const filteredBooks: Book[] =
    books?.filter((b: Book) => {
      const searchLower = search.toLowerCase();
      return b.name.toLowerCase().includes(searchLower);
    }) || [];

  // Reading status counters for quick stats
  const readCount = books?.filter((b: Book) => b.status === "Lu").length || 0;
  const readingCount =
    books?.filter((b: Book) => b.status === "En cours").length || 0;
  const toReadCount =
    books?.filter((b: Book) => b.status === "À lire").length || 0;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Banner: page title + open AddBook modal */}
      <div className="bg-bookcream/70 border border-bookbeige rounded-2xl p-6 shadow-md flex flex-col items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-bookdark">
          Ma Bibliothèque
        </h1>
        <button
          onClick={() => setOpen(true)}
          className="px-5 py-2.5 bg-bookterracotta text-white rounded-full flex items-center gap-2 text-sm shadow hover:bg-bookochre transition-colors"
          aria-label="Ajouter un livre"
        >
          <Plus size={16} />
          Ajouter
        </button>
        {/* AddBook modal controlled by `open` state */}
        <AddBookModal
          isOpen={open}
          onClose={() => setOpen(false)}
          userId={userId}
        />
      </div>

      {/* Status: counters by reading status */}
      <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm text-bookdark">
        <span className="px-3 py-1.5 bg-bookbeige/70 rounded-full shadow-sm">
          Lus : <strong>{readCount}</strong>
        </span>

        <span className="px-3 py-1.5 bg-bookbeige/70 rounded-full shadow-sm">
          En cours : <strong>{readingCount}</strong>
        </span>

        <span className="px-3 py-1.5 bg-bookbeige/70 rounded-full shadow-sm">
          À lire : <strong>{toReadCount}</strong>
        </span>
      </div>

      {/* Search input (client-side filtering only) */}
      <div className="mt-6 flex items-center gap-2">
        <input
          type="text"
          placeholder="Rechercher un livre..."
          className="flex-1 px-4 py-2.5 border border-bookbeige rounded-full text-sm bg-white text-bookdark shadow-sm focus:outline-none focus:ring-2 focus:ring-bookochre/30"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
        <button className="p-2.5 bg-bookochre rounded-full text-white shadow hover:opacity-90 transition-opacity">
          <Search size={18} />
        </button>
      </div>

      {/* Books list: show empty state when no results */}
      <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">
            Aucun livre trouvé.
          </p>
        ) : (
          filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onRemove={() => removeBook(book.id)}
              onStatusChange={(newStatus) =>
                updateStatus({
                  bookId: book.id,
                  status: newStatus,
                  currentBook: book,
                })
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
