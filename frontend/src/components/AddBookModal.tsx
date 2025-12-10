import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import axios from "axios";

import type { BookType } from "@/types/books";

type SearchExternalBookModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddBookModal({
  isOpen,
  onClose,
}: SearchExternalBookModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(false);

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
          
          max-w-3xl 
          h-full 
          sm:h-auto 
          p-6 
          rounded-none sm:rounded-lg 
          overflow-y-auto
        "
      >
        <DialogHeader>
          <DialogTitle>Rechercher un livre</DialogTitle>
          <DialogClose asChild>
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
              <X size={20} />
            </button>
          </DialogClose>
        </DialogHeader>

        {/* Search Input */}
        <div className="flex gap-2 mb-4 mt-2">
          <Input
            placeholder="Rechercher un livre (OpenLibrary)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            className="flex bg-bookterracotta items-center gap-2"
          >
            <Search size={16} />
            Rechercher
          </Button>
        </div>

        {loading && <p>Chargement...</p>}

        {/* Results */}
        <div className="max-h-80 overflow-y-auto mt-2">
          {results.map((book) => (
            <div
              key={book.key}
              className=" bg-bookcream flex items-center gap-3 mb-3 p-2 border rounded hover:bg-gray-50"
            >
              {book.cover_i ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                  alt={book.title}
                  className="w-12 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-16 bg-gray-200 rounded" />
              )}

              <div>
                <p className="font-semibold">{book.title}</p>
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
