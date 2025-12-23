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

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserBooks, addBookToUserList } from "@/api/books";
import type { CreateBookDto, Book } from "@/@types/books";
import type { ExternalBook } from "@/@types/externalBooks";
import { searchExternalBooks } from "@/api/externalBooks";

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

  const queryClient = useQueryClient();

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
  } = useQuery<ExternalBook[]>({
    enabled: false, // don't fetch on mount
    queryKey: ["externalBooks", query],
    queryFn: () => searchExternalBooks(query),
  });

  const handleSearch = () => {
    if (!query.trim()) return;
    refetch();
  };

  const navigate = useNavigate();

  const handleCardClick = (book: ExternalBook) => {
    // Extract the last segment of the key (e.g., “works/OL82586W” -> “OL82586W”)
    const rawKey = book.key?.toString() ?? "";
    const id = rawKey.includes("/") ? rawKey.split("/").pop() : rawKey;
    if (!id) return;
    navigate({ to: `/books/${id}` });
  };

  // Check if a book result is already in the library
  const isInLibrary = (externalBook: ExternalBook) => {
    if (!externalBook.isbn?.length) return false;

    return userBooks.some((b) => externalBook.isbn.includes(b.isbn));
  };

  // Normalize publishDate to YYYY-MM-DD format
  const toIsoDate = (publishDate?: string): string => {
    if (!publishDate) return new Date().toISOString().split("T")[0];

    // Try parsing as date
    const parsed = new Date(publishDate);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split("T")[0];
    }

    // If year only (YYYY), pad with -01-01
    const yearMatch = publishDate.match(/^(\d{4})$/);
    if (yearMatch) return `${yearMatch[1]}-01-01`;

    // Default to today
    return new Date().toISOString().split("T")[0];
  };

  // Mutation to add a book
  const addBookMutation = useMutation<Book, Error, ExternalBook>({
    mutationFn: (externalBook) => {
      if (!userId) throw new Error("UserId is required");
      const createBookDto: CreateBookDto = {
        name: externalBook.title || "Unknown Title",
        author: externalBook.author || "Unknown Author",
        isbn: Array.isArray(externalBook.isbn)
          ? externalBook.isbn[0] || "N/A"
          : externalBook.isbn || "N/A",
        coverId: externalBook.cover || "default_cover.png",
        description: "No description", // TODO : à rajouter lorsque les types seront finalisés
        publishingHouse: "Unknown publisher", // TODO : à rajouter lorsque les types seront finalisés
        publishedAt: toIsoDate(externalBook.publishDate),
      };

      return addBookToUserList(userId, createBookDto);
    },
    onSuccess: () => {
      // Invalidate and refetch the user's library
      queryClient.invalidateQueries({ 
        queryKey: ["userBooks", userId],
        refetchType: 'active'
      });
    },
  });

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
              <div
                key={book.key}
                role="button"
                tabIndex={0}
                onClick={() => !alreadyInLibrary && handleCardClick(book)}
                className={`
          relative w-full bg-bookcream flex items-center gap-4
          mb-4 p-3 border rounded-lg text-left
          ${alreadyInLibrary ? "opacity-50" : "hover:bg-gray-50"}
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
                      e.stopPropagation(); // prevent triggering the card click
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
