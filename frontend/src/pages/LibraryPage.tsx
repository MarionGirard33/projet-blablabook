import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookCard } from "@/components/BookCard";
import { Plus, Search } from "lucide-react";
import type { Book } from "../@types/books";
//import { useAuth } from "@/contexts/AuthContext";

export default function LibraryPage() {
  //const { userId } = useAuth();
  const userId = 2; // dev (updated to match seeded DB)
  const { data: books = [], refetch } = useQuery({
    queryKey: ["userBooks", userId],
    queryFn: () => getUserBooks(userId),
    enabled: !!userId,
  });

  const queryClient = useQueryClient();

  const removeMutation = useMutation({
    mutationFn: (bookId: number) => removeBookFromUserList(userId, bookId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["userBooks", userId] }),
  });

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  // Load books
  useEffect(() => {
    if (userId) refetch();
  }, [userId, refetch]);

  const filteredBooks: Book[] =
    books?.filter((b: Book) => {
      const searchLower = search.toLowerCase();
      return b.name.toLowerCase().includes(searchLower);
    }) || [];

  const readCount = books?.filter((b: Book) => b.status === "Lu").length || 0;
  const readingCount =
    books?.filter((b: Book) => b.status === "En cours").length || 0;
  const toReadCount =
    books?.filter((b: Book) => b.status === "À lire").length || 0;

  return (
    <div className="p-2 w-full">
      {/* Banner */}
      <div className="bg-bookcream rounded-xl p-6 shadow-md flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-3 text-bookdark">
          Ma Bibliothèque
        </h1>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-bookterracotta text-white rounded-lg flex items-center gap-2 text-sm shadow hover:bg-bookochre"
          aria-label="Search books"
        >
          <Plus size={16} />
          Ajouter
        </button>
        {/* Modale */}
        <AddBookModal
          isOpen={open}
          onClose={() => setOpen(false)}
          userId={userId}
        />
      </div>

      {/* Status */}
      <div className="flex justify-center gap-4 mt-4 text-sm text-bookdark">
        <span className="px-2 py-1 bg-bookbeige rounded-lg">
          Lus : <strong>{readCount}</strong>
        </span>

        <span className="px-2 py-1 bg-bookbeige rounded-lg">
          En cours : <strong>{readingCount}</strong>
        </span>

        <span className="px-2 py-1 bg-bookbeige rounded-lg">
          À lire : <strong>{toReadCount}</strong>
        </span>
      </div>

      {/* Search */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Rechercher un livre..."
          className="flex-1 p-2 border border-bookbeige rounded-lg text-sm bg-white text-bookdark"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
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
              onRemove={() => removeMutation.mutate(book.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
