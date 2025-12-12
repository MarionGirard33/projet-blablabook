import { Link, useParams, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Plus, CheckCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import externalApi from "../api/axiosExternal"; 

// Composants UI (je suppose qu'ils existent dans ton projet)
import { BookCover } from "../components/BookCover";
import { BookHeaderInfo } from "../components/BookHeaderInfo";
import { BookDataGrid } from "../components/BookDataGrid";
import { Button } from "../components/ui/button";

// --- TYPES ---
interface BookDisplayData {
  title: string;
  authors: string[];
  cover: string;
  description: string;
  isbn: string;
  publisher: string;
  publishedAt: string;
  pages: number;
  language: string;
  categories: string[];
}

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
  // Si la date est invalide (ex: "2004"), on essaie d'extraire l'année
  if (isNaN(date.getTime())) {
    const yearMatch = dateString.match(/\d{4}/);
    return yearMatch ? `${yearMatch[0]}-01-01` : new Date().toISOString().split('T')[0];
  }
  return date.toISOString().split('T')[0];
};

// --- COMPOSANT PRINCIPAL ---

const BookDetails = () => {
  //const { isbn } = useParams({ strict: false }) as { isbn: string };
  const isbn = 9780140328721
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. QUERY : Récupération depuis OpenLibrary
  const { data: book, isLoading, isError, error } = useQuery<BookDisplayData>({
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
    staleTime: 1000 * 60 * 60, // Cache 
    retry: 1,
  });

  // 2. MUTATION : Envoi vers Backend NestJS
  const addBookMutation = useMutation({
    mutationFn: async (bookData: BookDisplayData) => {
      const payload: CreateBookDto = {
        name: bookData.title,
        coverId: bookData.cover,
        author: bookData.authors[0],
        description: bookData.description || "Pas de description",
        isbn: bookData.isbn,
        publishingHouse: bookData.publisher,
        publishedAt: formatDateForDB(bookData.publishedAt),
      };
      // POST BOOK IN LIBRARY
      const response = await externalApi.post('/books', payload); 
      return response.data;
    },
    onSuccess: () => {
      // TODO ?
      // queryClient.invalidateQueries({ queryKey: ['my-library'] });
      
      // TODO to delete or modify
      alert("Succès : Livre ajouté à ta bibliothèque !");
      
      // TODO ? Rediriger vers la bibliothèque
      // navigate({ to: '/library' });
    },
    onError: (err: any) => {
      console.error("Erreur backend:", err);
      // Gestion d'erreur basique
      const message = err.response?.data?.message || "Erreur lors de l'ajout.";
      alert(`Erreur: ${message}`);
    }
  });

  // Handler du clic
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
    <div className="container mx-auto p-6 max-w-5xl space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Bouton Retour */}
      <Link 
        to="/library" // Adapte selon ta route parente
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la recherche
      </Link>

      <div className="flex flex-col md:flex-row gap-10">
        {/* COLONNE GAUCHE : VISUEL & ACTIONS */}
        <div className="flex flex-col items-center gap-6 md:w-1/3 min-w-[250px]">
          <div className="relative group">
             <BookCover 
              src={book.cover} 
              alt={book.title} 
              className="w-full max-w-[280px] shadow-2xl rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <Button 
            onClick={handleAddToLibrary}
            disabled={addBookMutation.isPending || addBookMutation.isSuccess}
            className={`w-full max-w-[280px] h-12 text-base shadow-md transition-all ${
              addBookMutation.isSuccess ? "bg-green-600 hover:bg-green-700" : ""
            }`} 
            size="lg"
          >
            {addBookMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Envoi en cours...
              </>
            ) : addBookMutation.isSuccess ? (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Ajouté !
              </>
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" />
                Ajouter à ma bibliothèque
              </>
            )}
          </Button>
          
          {addBookMutation.isError && (
             <p className="text-sm text-red-500 text-center px-4">
               Une erreur est survenue lors de l'ajout.
             </p>
          )}
        </div>

        {/* COLONNE DROITE : CONTENU */}
        <div className="flex flex-col flex-1 space-y-8 bg-card rounded-xl p-1 md:p-0">
          
          <BookHeaderInfo 
            title={book.title}
            author={book.authors[0]}
            categories={book.categories}
          />

          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight border-b pb-2">Résumé</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
              {book.description || (
                <span className="italic opacity-70">Aucune description fournie par l'éditeur.</span>
              )}
            </div>
          </div>

          <div className="pt-4">
             <BookDataGrid 
              publisher={book.publisher}
              publishedAt={book.publishedAt}
              pages={book.pages}
              isbn={book.isbn}
              language={book.language}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;