import { useState, useEffect } from "react";
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
import { Search, X } from "lucide-react";
import axios from "axios";

import type { BookType } from "@/types/books";

type SearchExternalBookModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

export function AddBookModal({
  isOpen,
  onClose,
}: SearchExternalBookModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setLoading(false);
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get("https://openlibrary.org/search.json", {
        params: { q: query, limit: 10 },
      });

      const books: BookType[] = res.data.docs.map((doc: any) => ({
        key: doc.key,
        author_name: doc.author_name || [],
        first_publish_year: doc.first_publish_year,
        language: doc.language || [],
        title: doc.title,
        cover_id: doc.cover_id,
        cover_i: doc.cover_i,
        edition_count: doc.edition_count,
      }));

      setResults(books);
    } catch (err) {
      console.error("Error searching external books:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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

        {loading && <p>Chargement...</p>}

        <div className="max-h-[500px] overflow-y-auto mt-4">
          {results.map((book) => (
            <div
              key={book.key}
              className="
                bg-bookcream
                flex items-center gap-4
                mb-4 p-3
                border rounded-lg
                hover:bg-gray-50
              "
            >
              {book.cover_i ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                  alt={book.title}
                  className="w-16 h-24 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-24 bg-gray-200 rounded" />
              )}

              <div>
                <p className="font-semibold text-lg">{book.title}</p>
                <p className="text-sm text-gray-600">
                  {book.author_name?.[0] || "Unknown"}
                </p>

                {book.first_publish_year && (
                  <p className="text-xs text-gray-500">
                    {book.first_publish_year}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
