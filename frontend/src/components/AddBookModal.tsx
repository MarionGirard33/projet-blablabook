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
import { searchExternalBooks, getUserBooks } from "@/api/books";

import type { BookType } from "@/types/books";

type AddBookModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly userId?: number;
};

export function AddBookModal({ isOpen, onClose, userId }: AddBookModalProps) {
  const [query, setQuery] = useState("");
  const { data: userBooks = [] } = useQuery({
    queryKey: ["userBooks", userId],
    queryFn: () => getUserBooks(userId!),
    enabled: !!userId,
  });

  // Reset query and results when modal closes
  const handleClose = () => {
    setQuery("");
    onClose();
  };

  // TanStack Query to look for books
  const {
    data: results = [],
    isFetching,
    refetch,
  } = useQuery<BookType[]>({
    enabled: false, // don't fetch on mount
    queryKey: ["externalBooks", query],
    queryFn: () => searchExternalBooks(query),
  });

  const handleSearch = () => {
    if (!query.trim()) return;
    refetch();
  };

  const navigate = useNavigate();

  const handleCardClick = (book: BookType) => {
    // Extract the last segment of the key (e.g., “works/OL82586W” -> “OL82586W”)
    const rawKey = book.key?.toString() ?? "";
    const id = rawKey.includes("/") ? rawKey.split("/").pop() : rawKey;
    if (!id) return;
    navigate({ to: `/books/${id}` });
  };

  // Check if a book result is already in the library
  const isInLibrary = (externalBook: BookType) => {
    if (!externalBook.isbn?.length) return false;

    return userBooks.some((b) => externalBook.isbn!.includes(b.isbn));
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

        <div className="max-h-[500px] overflow-y-auto mt-4">
          {results.map((book) => {
            const alreadyInLibrary = isInLibrary(book);

            return (
              <button
                key={book.key}
                onClick={() => !alreadyInLibrary && handleCardClick(book)}
                disabled={alreadyInLibrary}
                className={`
                  relative w-full bg-bookcream flex items-center gap-4
                  mb-4 p-3 border rounded-lg text-left
                  ${alreadyInLibrary ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}
                `}
              >
                {alreadyInLibrary && (
                  <Check
                    className="absolute top-2 right-2 text-green-600"
                    size={22}
                  />
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
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
