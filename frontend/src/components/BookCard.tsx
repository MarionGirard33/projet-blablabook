import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Book } from "@/stores/libraryStore";

type Props = {
  book: Book;
  onRemove: () => void;
};

export function LibraryBookCard({ book, onRemove }: Props) {
  return (
    <Card className="w-full max-w-xs shadow-md">
      <CardContent className="p-4 flex flex-col gap-3">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="rounded-md shadow"
          />
        ) : (
          <div className="bg-gray-200 w-full h-40 rounded-md animate-pulse" />
        )}

        <div>
          <h3 className="font-semibold text-lg">{book.title}</h3>
          <p className="text-sm text-gray-600">{book.author}</p>
        </div>

        <Button variant="destructive" onClick={onRemove}>
          Remove
        </Button>
      </CardContent>
    </Card>
  );
}
