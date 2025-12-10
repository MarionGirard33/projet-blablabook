import api from "./axios";

// -----------------------------
// Types
// -----------------------------
export interface Book {
  id: number;
  name: string;
  coverId: string;
  author: string;
  description: string;
  isbn: string;
  publishingHouse: string;
  publishedAt: string;
  listName?: string;
}

export interface CreateBookDto {
  name: string;
  coverId: string;
  author: string;
  description: string;
  isbn: string;
  publishingHouse: string;
  publishedAt: string; // YYYY-MM-DD
}

// -----------------------------
// API functions
// -----------------------------

// Get all books in book table
export const getBooks = async (): Promise<Book[]> => {
  const response = await api.get<Book[]>("/books");
  return response.data;
};

// Get all books from a specific user's list
export const getUserBooks = async (userId: number): Promise<Book[]> => {
  const response = await api.get<Book[]>(`/books/user/${userId}`);
  return response.data;
};

// Add a book to a user's list
export const addBookToUserList = async (
  userId: number,
  bookData: CreateBookDto
): Promise<Book> => {
  const response = await api.post<Book>(`/books/user/${userId}`, bookData);
  return response.data;
};

// Remove a book from a user's list
export const removeBookFromUserList = async (
  userId: number,
  bookId: number
): Promise<{ id: number }[]> => {
  const response = await api.delete<{ id: number }[]>(
    `/books/user/${userId}/book/${bookId}`
  );
  return response.data;
};

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