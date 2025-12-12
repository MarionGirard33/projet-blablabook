import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import externalApi from "../api/axiosExternal"; 

import { BookCover } from "../components/BookCover";
import { BookHeaderInfo } from "../components/BookHeaderInfo";
import { BookDataGrid } from "../components/BookDataGrid";
import { BookStatusAction } from "../components/BookStatusAction"; // Ton nouveau composant
import { Button } from "../components/ui/button";
import type { CreateBookDto } from "../@types/books";
import type { ExternalBookDisplayData } from "../@types/externalBooks";

// --- HELPERS ---
const parseDescription = (desc: any): string => {
  if (!desc) return '';
  if (typeof desc === 'string') return desc;
  if (typeof desc === 'object' && desc.value) return desc.value;
  return '';
};

const formatDateForDB = (dateString: string): string => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    const yearRegex = /\d{4}/;
    const yearMatch = yearRegex.exec(dateString);
    return yearMatch ? `${yearMatch[0]}-01-01` : new Date().toISOString().split('T')[0];
  }
  return date.toISOString().split('T')[0];
};

// --- COMPOSANT PRINCIPAL ---

const BookDetails = () => {
  // const { isbn } = useParams({ strict: false }) as { isbn: string };
  const isbn = "9780140328721"; 

  // 1. QUERY
  const { data: book, isLoading, isError, error } = useQuery<ExternalBookDisplayData>({
    queryKey: ['book', isbn],
    queryFn: async () => {
      if (!isbn) throw new Error('ISBN manquant');
      const resIsbn = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
      if (!resIsbn.ok) throw new Error('Livre introuvable sur OpenLibrary');
      const dataIsbn = await resIsbn.json();

      const workKey = dataIsbn.works?.[0]?.key;
      const authorKey = dataIsbn.authors?.[0]?.key;

      const [dataWork, dataAuthor] = await Promise.all([
        workKey 
          ? fetch(`https://openlibrary.org${workKey}.json`).then(r => r.json()).catch(() => ({})) 
          : Promise.resolve({}),
        authorKey 
          ? fetch(`https://openlibrary.org${authorKey}.json`).then(r => r.json()).catch(() => ({ name: 'Auteur inconnu' }))
          : Promise.resolve({ name: 'Auteur inconnu' })
      ]);

      const coverId = dataIsbn.covers?.[0] || dataWork.covers?.[0];
      
      return {
        title: dataIsbn.title,
        authors: [dataAuthor.name || 'Inconnu'],
        cover: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : '', 
        description: parseDescription(dataWork.description),
        isbn: isbn,
        publisher: dataIsbn.publishers?.[0] || 'Éditeur inconnu',
        publishedAt: dataIsbn.publish_date,
        pages: dataIsbn.number_of_pages || 0,
        language: dataIsbn.languages?.[0]?.key?.split('/').pop() || 'en',
        categories: dataWork.subjects || []
      };
    },
    enabled: !!isbn,
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });

  // 2. MUTATION
  const addBookMutation = useMutation({
    mutationFn: async (bookData: ExternalBookDisplayData) => {
      const payload: CreateBookDto = {
        name: bookData.title,
        coverId: bookData.cover,
        author: bookData.authors[0],
        description: bookData.description || "Pas de description",
        isbn: bookData.isbn,
        publishingHouse: bookData.publisher,
        publishedAt: formatDateForDB(bookData.publishedAt),
      };
      const response = await externalApi.post('/books', payload); 
      return response.data;
    },
    onSuccess: () => {
      alert("Succès : Livre ajouté à ta bibliothèque !");
    },
    onError: (err: any) => {
      console.error("Erreur backend:", err);
      const message = err.response?.data?.message || "Erreur lors de l'ajout.";
      alert(`Erreur: ${message}`);
    }
  });

  const handleAddToLibrary = () => {
    if (book) {
      addBookMutation.mutate(book);
    }
  };

  // --- RENDU ---

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
        <Button variant="outline" onClick={() => window.history.back()}>
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl animate-in fade-in zoom-in-95 duration-500">
      
      {/* 0. Navigation Retour (Toujours en haut à gauche) */}
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

        {/* 1. ZONE HAUTE : COUVERTURE & INFOS (CENTRÉ) */}
        <div className="flex flex-col items-center text-center space-y-6 w-full max-w-2xl">
          <div className="relative group shadow-2xl rounded-lg">
             <BookCover 
              src={book.cover} 
              alt={book.title} 
              className="w-full max-w-[220px] md:max-w-[260px] rounded-lg transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          {/* On force le centrage du texte pour le header info */}
          <div className="flex flex-col items-center">
            <BookHeaderInfo 
              title={book.title}
              author={book.authors[0]}
              categories={book.categories}
            />
          </div>
        </div>

        {/* 2. ZONE MILIEU : GRILLE SPLIT (DataGrid à gauche / Action à droite) */}
        {/* En mobile : colonne unique. En Desktop : Grid 3 colonnes (2 pour data, 1 pour action) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full items-start">
          
          {/* Gauche : Détails techniques (Prend 2/3 de la largeur) */}
          <div className="lg:col-span-2 w-full">
             <BookDataGrid 
              publisher={book.publisher}
              publishedAt={book.publishedAt}
              pages={book.pages}
              isbn={book.isbn}
              language={book.language}
            />
          </div>

          {/* Droite : Action / Statut (Prend 1/3 de la largeur) */}
          <div className="lg:col-span-1 w-full lg:sticky lg:top-6">
            <BookStatusAction 
              status={null} // TODO: Brancher le vrai statut ici
              onAddToLibrary={handleAddToLibrary}
              isAdding={addBookMutation.isPending}
            />
          </div>

        </div>

        {/* 3. ZONE BAS : RÉSUMÉ (Pleine largeur) */}
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