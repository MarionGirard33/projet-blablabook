// AddBookModal lets the user search books from the external API,
// preview results, navigate to details, or add a book directly
// to their library. Uses TanStack Query for fetching and mutation.
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Search, X } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { getUserBooks } from "@/api/books";
import type { ExternalBook } from "@/@types/externalBooks";
import { searchExternalBooks } from "@/api/externalBooks";
import { useAddBook } from "@/hooks/useAddBook";

type AddBookModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly userId?: number;
};

export function AddBookModal({ isOpen, onClose, userId }: AddBookModalProps) {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  // User's current library, used to mark items already added
  const { data: userBooks = [] } = useQuery({
    queryKey: ["userBooks", userId],
    queryFn: () => getUserBooks(userId!),
    enabled: !!userId,
  });

  // Mutation hook to add a book to the user's list
  const addBookMutation = useAddBook(userId);

  // Reset query and results when modal closes
  const handleClose = () => {
    setQuery("");
    setHasSearched(false);
    onClose();
  };

  // TanStack Query to look for books
  const {
    data: results = [],
    isFetching,
    refetch,
  } = useQuery<ExternalBook[]>({
    enabled: false, // don't fetch on mount
    queryKey: ["externalBooks", query],
    queryFn: () => searchExternalBooks(query),
  });

  // Trigger a search only when input is non-empty
  const handleSearch = () => {
    if (!query.trim()) return;
    setHasSearched(true);
    refetch();
  };

  const navigate = useNavigate();

  // Navigate to internal book details page using the ISBN
  const handleCardClick = (book: ExternalBook) => {
    if (!book.isbn) return;
    navigate({ to: `/books/${book.isbn}` });
  };

  // Check if a book result is already in the library
  const isInLibrary = (externalBook: ExternalBook) => {
    if (!externalBook.isbn?.length) return false;

    return userBooks.some((b) => externalBook.isbn.includes(b.isbn));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="
          w-full
          max-w-4xl
          lg:max-w-5xl
          h-full
          sm:h-auto
          p-6
          rounded-none sm:rounded-xl
          overflow-y-auto
        "
      >
        <DialogDescription className="sr-only">
          Rechercher un livre.
        </DialogDescription>

        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Rechercher un livre
          </DialogTitle>

          {/* Close button (asChild to keep semantics of the child button) */}
          <DialogClose asChild>
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
              <X size={22} />
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="flex gap-2 mb-4 mt-2">
          <Input
            placeholder="Rechercher un livre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />

          <Button
            onClick={handleSearch}
            className="flex items-center gap-2 bg-bookterracotta hover:bg-bookochre"
          >
            <Search size={18} />
            Rechercher
          </Button>
        </div>

        {isFetching && <p>Chargement...</p>}

        {/* Empty state: show message only after an explicit search */}
        {!isFetching && hasSearched && results.length === 0 && (
          <p className="mt-4 text-sm text-gray-600">Aucun livre trouvé.</p>
        )}

        <div className="max-h-[500px] overflow-y-auto mt-4">
          {results.map((book) => {
            const alreadyInLibrary = isInLibrary(book);

            // Keyboard support for the whole clickable row (Enter/Space)
            const handleKeyDown = (e: React.KeyboardEvent) => {
              if ((e.key === "Enter" || e.key === " ") && !alreadyInLibrary) {
                handleCardClick(book);
              }
            };

            return (
              // Use a div with role=button to avoid nesting a button inside a button
              <div
                key={book.key}
                role="button"
                tabIndex={alreadyInLibrary ? -1 : 0}
                onClick={() => !alreadyInLibrary && handleCardClick(book)}
                onKeyDown={handleKeyDown}
                className={`
          relative w-full bg-bookcream flex items-center gap-4
          mb-4 p-3 border rounded-lg text-left
          ${alreadyInLibrary ? "opacity-50 cursor-default" : "hover:bg-gray-50 cursor-pointer"}
        `}
              >
                {/* ✔️ Already in library */}
                {alreadyInLibrary && (
                  <Check
                    className="absolute top-2 right-2 text-green-600"
                    size={22}
                  />
                )}

                {/* ➕ Add to library */}
                {!alreadyInLibrary && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent triggering the row click
                      addBookMutation.mutate(book);
                    }}
                    className="
              absolute top-2 right-2
              p-1 rounded-full
              bg-bookterracotta text-white
              hover:bg-bookochre
            "
                    aria-label="Ajouter à la librairie"
                  >
                    +
                  </button>
                )}

                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-24 bg-gray-200 rounded" />
                )}

                <div>
                  <p className="font-semibold text-lg">{book.title}</p>
                  <p className="text-sm text-gray-600">
                    {book.author || "Unknown"}
                  </p>
                  {book.publishDate && (
                    <p className="text-xs text-gray-500">{book.publishDate}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
