// Frontend client for our internal backend Book APIs.
// Wraps axios calls and provides typed responses.
import type { GetExternalBooksParams } from "../@types/externalBooks";
import type { CreateBookDto, Book } from "../@types/books";
import api from "./axios";

// -----------------------------
// Internal API functions
// -----------------------------

/**
 * Search endpoint on the backend (if applicable).
 * Accepts optional filters and forwards them as query params.
 */
export function getSearchBooks(params: GetExternalBooksParams) {
  const query: Record<string, string> = {};
  if (params.type) query.type = params.type;
  if (params.categoryName) query.categoryName = params.categoryName;
  if (params.searchText) query.searchText = params.searchText;

  return api.get(`/books/search`, { params: query });
}

/** Get all books persisted in the backend `book` table. */
export const getBooks = async (): Promise<Book[]> => {
  const response = await api.get<Book[]>("/books");
  return response.data;
};

/** Get all books from a specific user's library (with computed status). */
export const getUserBooks = async (userId: number): Promise<Book[]> => {
  const response = await api.get<Book[]>(`/books/library/${userId}`);
  return response.data;
};

/**
 * Add a book to a user's list. If the book doesn't exist yet, the backend
 * will create it first, then link it to the user's list.
 */
export const addBookToUserList = async (
  userId: number,
  bookData: CreateBookDto
): Promise<Book> => {
  const response = await api.post<Book>(`/books/library/${userId}`, bookData);
  return response.data;
};

/** Remove a book from a user's list by unlinking it on the backend. */
export const removeBookFromUserList = async (
  userId: number,
  bookId: number
): Promise<{ id: number }[]> => {
  const response = await api.delete<{ id: number }[]>(
    `/books/library/${userId}/book/${bookId}`
  );
  return response.data;
};
