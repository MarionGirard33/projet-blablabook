import { useEffect, useState } from "react";
import { useLibraryStore } from "@/stores/libraryStore";
import { BookCard } from "@/components/BookCard";
import { Plus, Search } from "lucide-react";
//import { useAuth } from "@/contexts/AuthContext";

export default function LibraryPage() {
  //const { userId } = useAuth();
  const userId = 1; // dev
  const books = useLibraryStore((s) => s.books);
  const loadBooks = useLibraryStore((s) => s.loadBooks);
  const removeBook = useLibraryStore((s) => s.removeBook);

  const [search, setSearch] = useState("");

  // Load books
  useEffect(() => {
    if (userId) {
      loadBooks(userId);
    }
  }, [userId]);

  const filteredBooks =
    books?.filter((b) => b.name.toLowerCase().includes(search.toLowerCase())) ||
    [];

  const readCount = books?.filter((b) => b.status === "Lu").length || 0;
  const readingCount =
    books?.filter((b) => b.status === "En cours").length || 0;
  const toReadCount = books?.filter((b) => b.status === "À lire").length || 0;

  return (
    <div className="p-2 w-full">
      {/* Banner */}
      <div className="bg-bookcream rounded-xl p-6 shadow-md flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-3 text-bookdark">
          Ma Bibliothèque
        </h1>
        <button className="px-4 py-2 bg-bookterracotta text-white rounded-lg flex items-center gap-2 text-sm shadow">
          <Plus size={16} />
          Ajouter
        </button>
      </div>

      {/* Status */}
      <div className="flex justify-center gap-4 mt-4 text-sm text-bookdark">
        <span className="px-2 py-1 bg-bookbeige rounded-full">
          Lus : <strong>{readCount}</strong>
        </span>

        <span className="px-2 py-1 bg-bookbeige rounded-full">
          En cours : <strong>{readingCount}</strong>
        </span>

        <span className="px-2 py-1 bg-bookbeige rounded-full">
          À lire : <strong>{toReadCount}</strong>
        </span>
      </div>

      {/* Search */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Rechercher un livre, un auteur..."
          className="flex-1 p-2 border border-bookbeige rounded-lg text-sm bg-white text-bookdark"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="p-2 bg-bookochre rounded-lg text-white shadow">
          <Search size={18} />
        </button>
      </div>

      {/* Books list */}
      <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">
            Aucun livre trouvé.
          </p>
        ) : (
          filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onRemove={() => removeBook(userId, book.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
