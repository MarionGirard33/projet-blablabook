import axios from "axios";
import { getMockBookDetails } from "./mockBooks";
import type { Book } from "../types/Book";

// --- Fetcher: Get book details from OpenLibrary or mock ---
export const fetchBookDetails = async (workId: string): Promise<Book> => {
  // Use mock data if available
  const mockBook = getMockBookDetails(workId);
  if (mockBook) {
    return mockBook;
  }

  // Clean the ID
  const cleanId = workId.replace("/works/", "");
  
  // 1. Fetch the work
  const { data: work } = await axios.get(
    `https://openlibrary.org/works/${cleanId}.json`
  );

  // 2. Fetch the author (if available)
  let author = "Auteur inconnu";
  if (work.authors && work.authors.length > 0) {
    try {
      const authorKey = work.authors[0].author.key;
      const { data: authorData } = await axios.get(`https://openlibrary.org${authorKey}.json`);
      author = authorData.name;
    } catch (e) {
      console.warn("Impossible de récupérer l'auteur", e);
    }
  }

  // 3. Format for the frontend
  const cover = work.covers && work.covers.length > 0
    ? `https://covers.openlibrary.org/b/id/${work.covers[0]}-L.jpg`
    : "https://placehold.co/400x600?text=No+Cover";

  const description = typeof work.description === 'object' 
    ? work.description.value 
    : work.description || "Pas de description disponible.";

  return {
    id: Number(cleanId.replace(/\D/g, "")) || 0,
    name: work.title,
    cover,
    author,
    description,
    ISBN: work.isbn_10?.[0] || work.isbn_13?.[0] || "",
    publishing_house: work.publishers?.[0] || "",
    published_at: work.first_publish_date || "N/A",
  };
};