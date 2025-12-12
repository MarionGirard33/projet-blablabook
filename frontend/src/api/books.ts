import type { CreateBookDto, Book } from "../@types/books";
import api from "./axios";

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
