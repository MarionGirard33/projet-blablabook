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
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Search } from "lucide-react";
import { Loader } from "@/components/Loader";

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
    queryFn: () =>
      searchExternalBooks({ type: "searchText", searchText: query }),
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
          bg-bookcream text-bookdark border border-bookbeige
          rounded-none sm:rounded-2xl
          overflow-y-auto
        "
      >
        <DialogDescription className="sr-only">
          Rechercher un livre.
        </DialogDescription>

        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl font-semibold text-bookdark">
            Rechercher un livre
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4 mt-2">
          <Input
            placeholder="Rechercher un livre..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (hasSearched) setHasSearched(false);
            }}
            className="flex-1 bg-white border-bookbeige rounded-full shadow-sm focus:ring-2 focus:ring-bookochre/30"
          />

          <Button
            onClick={handleSearch}
            className="flex items-center gap-2 bg-bookterracotta hover:bg-bookochre rounded-full shadow"
          >
            <Search size={18} />
            Rechercher
          </Button>
        </div>

        {isFetching && <Loader className="text-sm" />}

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
          relative w-full bg-white/80 flex items-center gap-4
          mb-4 p-3 border border-bookbeige rounded-xl shadow-sm text-left
          ${alreadyInLibrary ? "opacity-50 cursor-default" : "hover:bg-white cursor-pointer"}
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
                      e.stopPropagation();
                      addBookMutation.mutate(book);
                    }}
                    className="
              absolute top-2 right-2
              w-8 h-8 flex items-center justify-center
              rounded-full
              bg-bookterracotta text-white text-lg font-semibold
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
                    className="w-20 h-32 object-cover rounded flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-32 bg-gray-200 rounded flex-shrink-0" />
                )}

                <div>
                  <p className="font-semibold text-lg">{book.title}</p>
                  <p className="text-sm text-gray-600">
                    {book.author || "Unknown"}
                  </p>
                  {book.publishDate && (
                    <p className="text-xs text-gray-500">{book.publishDate}</p>
                  )}
                  {book.categories && book.categories.length > 0 && (
                    <span className="inline-block mt-2 px-3 py-1.5 text-xs font-semibold rounded-full bg-bookterracotta/20 text-bookterracotta border border-bookterracotta/30">
                      {book.categories[0]}
                    </span>
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
