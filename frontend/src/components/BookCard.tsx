// BookCard renders a single book in the user's library with a cover,
// optional status badge, basic metadata, and a delete action.
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import type { Book } from "../@types/books";

type Props = {
  readonly book: Book;
  readonly onRemove: () => void;
};

export function BookCard({ book, onRemove }: Props) {
  return (
    <Card className="w-full max-w-md shadow-lg relative rounded-xl overflow-hidden p-0 flex flex-col">
      {/* Book cover (fallback placeholder when no cover) */}
      <div className="relative flex-shrink-0">
        {book.coverId ? (
          <img
            //src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
            src={book.coverId} // dev
            alt={book.name}
            className="w-full h-36 object-cover"
          />
        ) : (
          <div className="bg-gray-200 w-full h-36 animate-pulse" />
        )}

        {/* Status badge: displays reading status if available */}
        {book.status && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow bg-bookcream text-bookdark">
            {book.status}
          </span>
        )}

        {/* Delete button: removes the book from the user's list */}
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 p-1 bg-white/80 rounded-full shadow hover:bg-white transition"
        >
          <Trash2 size={16} className="text-red-600" />
        </button>
      </div>

      <CardContent className="p-4 flex flex-col gap-3 items-start">
        <div className="text-left w-full">
          <h3 className="font-semibold text-lg">{book.name}</h3>
          <p className="text-sm text-gray-600">{book.author}</p>
          {book.description && (
            <div className="mt-2 max-h-32 overflow-y-auto pr-2">
              {/* Scroll container to prevent card overflow with long descriptions */}
              <p className="text-sm text-gray-700">{book.description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
