import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchBookDetails } from "../api/books";

import { BookCover } from "../components/BookCover";
import { BookHeaderInfo } from "../components/BookHeaderInfo";
import { BookDataGrid } from "../components/BookDataGrid";
import { Button } from "../components/ui/button";
// import Header from "../components/Header";
// import Footer from "../components/Footer";

// BookDetails page displays all information about a single book
const BookDetails: React.FC = () => {
  // TODO: Replace with: const { id } = useParams({ from: '/books/$id' }) when router is ready
  const id = "OL12345M";

  // Fetch book details (mock or API)
  const { data: book, isLoading, isError } = useQuery({
    queryKey: ["book", id],
    queryFn: () => fetchBookDetails(id),
    enabled: true, 
  });

  if (isLoading) {
    // Loading spinner while fetching data
    return (
      <div className="flex h-screen items-center justify-center bg-bookcream">
        <Loader2 className="w-10 h-10 animate-spin text-bookochre" />
      </div>
    );
  }

  if (isError || !book) {
    // Error state if book not found
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-bookcream">
        <p className="text-destructive font-medium">Livre introuvable.</p>
        <Link to=".." className="text-bookdark underline hover:text-bookochre">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bookcream pb-20 font-serif text-foreground">
      {/* Header placeholder (TODO) */}
      {/* <Header /> */}

      {/* Main container */}
      <main className="w-full px-4 sm:px-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Back navigation */}
        <nav className="mb-8">
          <Link to=".." className="inline-flex items-center p-2 rounded-full hover:bg-bookbeige transition-colors group">
            <ArrowLeft className="w-8 h-8 text-bookochre group-hover:text-bookterracotta transition-colors" />
            <span className="sr-only">Retour à l'accueil</span>
          </Link>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
          
          <div className="md:col-span-5 lg:col-span-4">
             <div className="top-24"> 
                <BookCover url={book.cover} title={book.name} />
             </div>
          </div>

          {/* Book information */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-8">
            
            {/* 1. Header (title, author, rating, etc.) */}
            {/* Uncomment the following props when available:
                category={book.categories?.[0] || "Roman"}
                rating={book.reviews || 0}
                pages={book.numberOfPages || 0}
                year={book.publicationYear}
            */}
            <BookHeaderInfo 
                          title={(book as any).title ?? (book as any).name ?? "Titre inconnu"}
                          author={book.author} pages={0} year={""}            />

            {/* 2. Book summary */}
            <div className="prose prose-stone max-w-none">
              <h3 className="font-serif text-2xl font-bold text-bookdark mb-4 border-b border-bookbeige pb-2">
                Résumé
              </h3>
              <p className="text-bookdark/80 text-lg leading-relaxed text-justify whitespace-pre-line font-sans">
                {book.description || "Aucune description disponible pour ce livre."}
              </p>
            </div>

            {/* 3. Technical details grid */}
            <div>
                 <h3 className="font-serif text-xl font-bold text-bookdark mb-4">Détails techniques</h3>
                 {/* Uncomment and pass these props when available: language, pages */}
                 <BookDataGrid 
                              isbn={book.ISBN || "-"}
                              publisher={book.publishing_house || "Not specified"} language={""} pages={""}                />
            </div>

            {/* Mobile-only button (add to library) */}
            <div className="mt-4 bottom-4 z-10">
                <Button className="w-full py-4 text-lg rounded-xl shadow-xl bg-bookochre text-white hover:bg-bookterracotta">
                    <Plus className="w-5 h-5 mr-2" />
                    Ajouter à ma bibliothèque
                </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer placeholder (TODO) */}
      {/* <Footer /> */}
    </div>
  );
};

export default BookDetails;