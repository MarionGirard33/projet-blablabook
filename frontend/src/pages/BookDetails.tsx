import { Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { addBookToUserList } from "../api/books";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useUserBooks } from "../hooks/useUserBooks";
import { bookDetailsRoute } from "../routes/routes";
import { getFullExternalBook } from "../api/externalBooks";

import type { ExternalBookDisplayData } from "../@types/externalBooks";

import { BookCover } from "../components/BookCover";
import { BookHeaderInfo } from "../components/BookHeaderInfo";
import { BookDataGrid } from "../components/BookDataGrid";
import { BookStatusAction } from "../components/BookStatusAction";
import { Button } from "../components/ui/button";

// --- MAIN COMPONENT ---
const BookDetails = () => {
  const { isbn } = bookDetailsRoute.useParams();
  const { data: currentUser } = useCurrentUser();

  // Fetch the book details from external API
  const { data: book, isLoading, isError, error } = useQuery<ExternalBookDisplayData>({
    queryKey: ["external-book", isbn],
    queryFn: () => getFullExternalBook(isbn),
    enabled: !!isbn,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });

  // Fetch the user's books
  const { books: userBooks, refetch, updateStatus, isUpdatingStatus } = useUserBooks(currentUser?.id);

  // Format a date string for DB compatibility
  const formatDateForDB = (dateString: string): string => {
    if (!dateString) return new Date().toISOString().split("T")[0];
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      const yearMatch = /\d{4}/.exec(dateString);
      return yearMatch ? `${yearMatch[0]}-01-01` : new Date().toISOString().split("T")[0];
    }
    return date.toISOString().split("T")[0];
  };

  // Mutation to add the book to the user's library
  const addBookMutation = useMutation({
    mutationFn: async (bookData: ExternalBookDisplayData) => {
      if (!currentUser?.id) throw new Error("User not logged in");
      const payload = {
        name: bookData.title,
        coverId: bookData.cover,
        author: bookData.authors[0],
        description: bookData.description || "No description provided",
        isbn: bookData.isbn,
        publishingHouse: bookData.publisher,
        publishedAt: formatDateForDB(bookData.publishedAt),
      };
      return addBookToUserList(currentUser.id, payload);
    },
    onSuccess: () => {
      alert("Success: Book added to your library!");
      refetch();
    },
    onError: (err: any) => {
      console.error("Backend error:", err);
      const message = err.response?.data?.message || err.message || "Failed to add book.";
      alert(`Error: ${message}`);
    },
  });

  const handleAddToLibrary = () => {
    if (book) addBookMutation.mutate(book);
  };

  // Check if the book is already in the user's library
  const isInLibrary = userBooks.some((b) => b.isbn === book?.isbn);

  // Handler to change the status of a book in the user's library
  const handleChangeStatus = (newStatus: "Lu" | "En cours" | "À lire") => {
    const userBook = userBooks.find((b) => b.isbn === book?.isbn);
    if (userBook?.id) updateStatus({ bookId: userBook.id, status: newStatus, currentBook: userBook });
  };

  // --- LOADING & ERROR STATES ---
  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Fetching book details...</span>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-destructive font-semibold text-lg">
          Oops! {(error as Error)?.message || "Unable to load this book."}
        </p>
        <Button variant="outline" onClick={() => globalThis.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  // --- FRONTEND RENDER ---
  return (
    <div className="container mx-auto p-6 max-w-5xl animate-in fade-in zoom-in-95 duration-500">
      
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          to="/library"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to search
        </Link>
      </div>

      <div className="flex flex-col items-center space-y-10">
        {/* Cover & Header */}
        <div className="flex flex-col items-center text-center space-y-6 w-full max-w-2xl">
          <div className="relative group shadow-2xl rounded-lg">
            <BookCover
              src={book.cover}
              alt={book.title}
              className="w-full max-w-[220px] md:max-w-[260px] rounded-lg transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <BookHeaderInfo title={book.title} author={book.authors[0]} />
        </div>

        {/* Details & Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full items-start">
          <div className="lg:col-span-2 w-full">
            <BookDataGrid
              publisher={book.publisher}
              publishedAt={book.publishedAt}
              pages={book.pages}
              isbn={book.isbn}
              language={book.language}
              categories={book.categories.slice(0, 5)} // TODO: show most used categories from API
            />
          </div>
          <div className="lg:col-span-1 w-full lg:sticky lg:top-6">
            <BookStatusAction
              status={isInLibrary ? (userBooks.find((b) => b.isbn === book.isbn)?.status ?? null) : null}
              onAddToLibrary={handleAddToLibrary}
              isAdding={addBookMutation.status === "pending"}
              book={isInLibrary ? userBooks.find((b) => b.isbn === book.isbn) : undefined}
              onChangeStatus={handleChangeStatus}
              isUpdatingStatus={isUpdatingStatus}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="w-full pt-6 border-t border-border">
          <h3 className="text-xl font-semibold tracking-tight mb-4">Summary</h3>
          <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
            {book.description || <span className="italic opacity-70">No description provided by the publisher.</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;