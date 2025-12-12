import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
//import api from "../api/axios"; 
import { getFullExternalBook } from "../api/externalBooks";

import type { CreateBookDto } from "../@types/books";
import type { ExternalBookDisplayData } from "../@types/externalBooks";

import { BookCover } from "../components/BookCover";
import { BookHeaderInfo } from "../components/BookHeaderInfo";
import { BookDataGrid } from "../components/BookDataGrid";
import { BookStatusAction } from "../components/BookStatusAction";
import { Button } from "../components/ui/button";

// TODO when back is connected --- HELPERS ---

// const formatDateForDB = (dateString: string): string => {
//   if (!dateString) return new Date().toISOString().split('T')[0];
//   const date = new Date(dateString);
  
//   // If date parsing fails, try extracting just the year
//   if (Number.isNaN(date.getTime())) {
//     const yearRegex = /\d{4}/;
//     const yearMatch = yearRegex.exec(dateString);
//     return yearMatch ? `${yearMatch[0]}-01-01` : new Date().toISOString().split('T')[0];
//   }
//   return date.toISOString().split('T')[0];
// };

// --- MAIN COMPONENT ---

const BookDetails = () => {
  //const { isbn } = useParams<{ isbn?: string }>(); // Uncomment to use dynamic URL parameter
  const isbn = "9780140328721"; // Hardcoded ISBN for development/testing

  // QUERY: Fetch book details from OpenLibrary
  const { 
    data: book, 
    isLoading, 
    isError, 
    error 
  } = useQuery<ExternalBookDisplayData>({
    queryKey: ['external-book', isbn],
    queryFn: () => getFullExternalBook(isbn), 
    enabled: !!isbn,
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });

  //  TODO when back is connected MUTATION: Save the book to the internal NestJS backend
  // const addBookMutation = useMutation({
  //   mutationFn: async (bookData: ExternalBookDisplayData) => {
  //     const payload: CreateBookDto = {
  //       name: bookData.title,
  //       coverId: bookData.cover,
  //       author: bookData.authors[0],
  //       description: bookData.description || "Pas de description",
  //       isbn: bookData.isbn,
  //       publishingHouse: bookData.publisher,
  //       publishedAt: formatDateForDB(bookData.publishedAt),
  //     };
  //     const response = await api.post('/books', payload); 
  //     return response.data;
  //   },
  //   onSuccess: () => {
  //     alert("Succès : Livre ajouté à ta bibliothèque !");
  //   },
  //   onError: (err: any) => {
  //     console.error("Backend error:", err);
  //     const message = err.response?.data?.message || "Erreur lors de l'ajout.";
  //     alert(`Erreur: ${message}`);
  //   }
  // });

  // const handleAddToLibrary = () => {
  //   if (book) {
  //     addBookMutation.mutate(book);
  //   }
  // };

  // --- LOADING / ERROR STATES ---

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Recherche des infos...</span>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-destructive font-semibold text-lg">
          Oups ! {(error as Error)?.message || "Impossible de charger ce livre."}
        </p>
        <Button variant="outline" onClick={() => globalThis.history.back()}>
          Retour
        </Button>
      </div>
    );
  }

  // --- FRONTEND ---

  return (
    <div className="container mx-auto p-6 max-w-5xl animate-in fade-in zoom-in-95 duration-500">
      
      {/* 0. Back Navigation */}
      <div className="mb-6">
        <Link 
          to="/library"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la recherche
        </Link>
      </div>

      <div className="flex flex-col items-center space-y-10">

        {/* COVER AND HEADER INFO */}
        <div className="flex flex-col items-center text-center space-y-6 w-full max-w-2xl">
          <div className="relative group shadow-2xl rounded-lg">
             <BookCover 
              src={book.cover} 
              alt={book.title} 
              className="w-full max-w-[220px] md:max-w-[260px] rounded-lg transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          <div className="flex flex-col items-center">
            <BookHeaderInfo 
              title={book.title}
              author={book.authors[0]}
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full items-start">
          <div className="lg:col-span-2 w-full">
             <BookDataGrid 
              publisher={book.publisher}
              publishedAt={book.publishedAt}
              pages={book.pages}
              isbn={book.isbn}
              language={book.language}
              categories={book.categories}
            />
          </div>
          <div className="lg:col-span-1 w-full lg:sticky lg:top-6">
            <BookStatusAction 
              status={null} // TODO: Fetch user's book status from backend
              onAddToLibrary={() => {}} //TODO: {handleAddToLibrary}
              isAdding={false} // TODO: {addBookMutation.isLoading}
            />
          </div>

        </div>

        {/* SUMMARY */}
        <div className="w-full pt-6 border-t border-border">
          <h3 className="text-xl font-semibold tracking-tight mb-4">Résumé</h3>
          <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
            {book.description || (
              <span className="italic opacity-70">Aucune description fournie par l'éditeur.</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookDetails;