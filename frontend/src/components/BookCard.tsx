import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useLibraryStore } from "@/stores/libraryStore"; // <-- nécessaire
import { type Book } from "@/stores/libraryStore";

type Props = {
  book: Book & { status?: "Lu" | "En cours" | "À lire" };
};

export function BookCard({ book }: Props) {
  const removeBook = useLibraryStore((s) => s.removeBook); // <-- action Zustand

  return (
    <Card className="w-full max-w-md shadow-lg relative rounded-xl overflow-hidden p-0">
      {/* Book cover */}
      <div className="relative">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-70 object-cover"
          />
        ) : (
          <div className="bg-gray-200 w-full h-56 animate-pulse" />
        )}

        {/* Status badge */}
        {book.status && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow bg-bookcream text-bookdark">
            {book.status}
          </span>
        )}

        {/* Delete button */}
        <button
          onClick={() => removeBook(book.id)}
          className="absolute top-3 right-3 p-1 bg-white/80 rounded-full shadow hover:bg-white transition"
        >
          <Trash2 size={16} className="text-red-600" />
        </button>
      </div>

      <CardContent className="p-4 flex flex-col gap-3 items-start">
        <div className="text-left">
          <h3 className="font-semibold text-lg">{book.title}</h3>
          <p className="text-sm text-gray-600">{book.author}</p>
          {book.description && (
            <p className="text-sm text-gray-700 mt-1">{book.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
