// BookCard renders a single book in the user's library with a cover,
// optional status badge, basic metadata, and a delete action.
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, ChevronDown } from "lucide-react";
import type { Book } from "../@types/books";
import { useRouter } from "@tanstack/react-router";

type Props = {
  readonly book: Book;
  readonly onRemove: () => void;
  readonly onStatusChange?: (newStatus: "Lu" | "En cours" | "À lire") => void;
};

export function BookCard({ book, onRemove, onStatusChange }: Props) {
  const statuses: Array<"Lu" | "En cours" | "À lire"> = [
    "À lire",
    "En cours",
    "Lu",
  ];

  const router = useRouter();

  function goToBookDetails() {
    router.navigate({
      to: "/books/$isbn",
      params: { isbn: book.isbn },
    });
  }

  // Render status badge based on whether it's interactive or not
  const renderStatusBadge = () => {
    if (!book.status) return null;

    if (onStatusChange) {
      // Interactive dropdown menu
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow bg-bookcream text-bookdark hover:bg-bookcream/90 transition-colors flex items-center gap-1">
              {book.status}
              <ChevronDown size={12} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {statuses.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => onStatusChange(status)}
                className="cursor-pointer"
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    // Static badge
    return (
      <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow bg-bookcream text-bookdark">
        {book.status}
      </span>
    );
  };

  return (
    <Card
      onClick={() => goToBookDetails()}
      className="w-full max-w-md shadow-lg relative rounded-xl overflow-hidden p-0 gap-2 flex flex-col cursor-pointer"
    >
      {/* Book cover (fallback placeholder when no cover) */}
      <div className="relative flex-shrink-0">
        {book.coverId ? (
          <img
            //src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
            src={book.coverId} // dev
            alt={book.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="bg-gray-200 w-full h-48 animate-pulse" />
        )}

        {/* Status badge: displays reading status if available with dropdown to change it */}
        {renderStatusBadge()}

        {/* Delete button: removes the book from the user's list */}
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 p-1 bg-white/80 rounded-full shadow hover:bg-white transition"
        >
          <Trash2 size={16} className="text-red-600" />
        </button>
      </div>

      <CardContent className="px-4 pt-0 pb-4 flex flex-col items-start">
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
