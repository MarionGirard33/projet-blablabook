import { Card, CardContent } from "@/components/ui/card";
import { type Book } from "@/stores/libraryStore";

type Props = {
  book: Book & { status?: "Lu" | "En cours" | "À lire" };
};

export function BookCard({ book }: Props) {
  return (
    <Card className="w-full max-w-md shadow-lg relative rounded-xl overflow-hidden p-0">
      {/* Book cover */}
      {book.coverUrl ? (
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-70 object-cover rounded-t-xl"
        />
      ) : (
        <div className="bg-gray-200 w-full h-56 rounded-t-xl animate-pulse" />
      )}

      {/* Status badge */}
      {book.status && (
        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow bg-bookcream text-bookdark">
          {book.status}
        </span>
      )}

      <CardContent className="p-4 flex flex-col gap-3 items-start">
        {/* Book info */}
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
