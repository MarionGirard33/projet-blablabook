import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { BookType } from "@/types";

export default function BookCard({ book }: { book: BookType }) {
  return (
    <Card className="cursor-pointer flex flex-col p-0 h-full transition-transform duration-200 hover:scale-105 hover:shadow-xl bg-orange-100 rounded-xl overflow-hidden">
      <img
        src={book.cover}
        alt={book.title}
        className="w-full h-40 object-cover rounded-t-xl"
      />
      <CardHeader className="flex-1">
        <CardTitle className="text-base mb-1">{book.title}</CardTitle>
        <CardDescription className="text-sm text-gray-600 mb-2">
          {book.author}
        </CardDescription>
        <p className="text-xs text-gray-500 mb-2">
          {book.genre} • {book.year}
        </p>
        <p className="text-xs text-gray-700 mb-2 line-clamp-2">
          {book.description}
        </p>
      </CardHeader>
      <CardContent className="flex items-center justify-between px-4 pb-4">
        <span className="text-yellow-500 font-semibold">★ {book.rating}</span>
        <span className="text-xs text-gray-400">{book.pages} pages</span>
      </CardContent>
    </Card>
  );
}
