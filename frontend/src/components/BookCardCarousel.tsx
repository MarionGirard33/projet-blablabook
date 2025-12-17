import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { ExternalBook } from "../@types/externalBooks";

export default function BookCardCarousel({
  book,
}: {
  readonly book: ExternalBook;
}) {
  const cover = book.cover_id || book.cover_i;

  let languageLabel = "Langue inconnue";
  if (Array.isArray(book.language) && book.language.length > 0) {
    if (book.language.includes("fre")) {
      languageLabel = "Français";
    } else if (book.language.includes("eng")) {
      languageLabel = "Anglais";
    } else {
      languageLabel = "Autre langue";
    }
  }

  return (
    <Card className="flex flex-col items-center rounded-xl gap-0 overflow-hidden shadow w-full h-full p-0 min-h-96">
      <CardHeader className="w-full flex flex-col items-center p-4">
        {cover ? (
          <img
            src={`https://covers.openlibrary.org/b/id/${cover}-M.jpg`}
            alt={book.title}
            className="h-48 w-32 object-cover mb-2 rounded shadow"
            style={{ maxHeight: "12rem", minHeight: "12rem" }}
          />
        ) : (
          <div className="h-48 w-32 bg-gray-200 flex items-center justify-center rounded mb-1">
            <span className="text-xs text-gray-500">No cover</span>
          </div>
        )}
        <CardTitle className="font-bold text-base mb-1 text-center line-clamp-2">
          {book.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-700 text-center line-clamp-1">
          {book.author_name ? book.author_name.join(", ") : "Auteur inconnu"}
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full flex flex-col items-center px-4 pb-0">
        <p className="text-xs text-gray-500 mb-1 text-center">
          {languageLabel}
        </p>
        <p className="text-xs text-gray-500 mb-1 text-center">
          {book.first_publish_year
            ? `Première publication : ${book.first_publish_year}`
            : ""}
        </p>
        <p className="text-xs text-gray-500 mb-0 text-center">
          {book.edition_count ? `${book.edition_count} édition(s)` : ""}
        </p>
      </CardContent>
    </Card>
  );
}
