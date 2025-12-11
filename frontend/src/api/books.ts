import type { GetBooksParams, BookType, InternalBook } from "@/types/books";
import { api } from "./axios";
import { openLibraryApi } from "./axios";

// -----------------------------
// Types
// -----------------------------
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
// Internal API functions
// -----------------------------

export function getSearchBooks(params: GetBooksParams) {
  const query: Record<string, string> = {};
  if (params.type) query.type = params.type;
  if (params.categoryName) query.categoryName = params.categoryName;
  if (params.searchText) query.searchText = params.searchText;

  return api.get(`/books/search`, { params: query });
}

// Get all books in book table
export const getBooks = async (): Promise<InternalBook[]> => {
  const response = await api.get<InternalBook[]>("/books");
  return response.data;
};

// Get all books from a specific user's list
export const getUserBooks = async (userId: number): Promise<InternalBook[]> => {
  const response = await api.get<InternalBook[]>(`/books/user/${userId}`);
  return response.data;
};

// Add a book to a user's list
export const addBookToUserList = async (
  userId: number,
  bookData: CreateBookDto
): Promise<InternalBook> => {
  const response = await api.post<InternalBook>(
    `/books/user/${userId}`,
    bookData
  );
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

// -----------------------------
// External API (OpenLibrary)
// -----------------------------

export const searchExternalBooks = async (
  searchText: string
): Promise<BookType[]> => {
  const response = await openLibraryApi.get("/search.json", {
    params: { q: searchText, limit: 30 },
  });

  return response.data.docs.map((item: BookType) => ({
    key: item.key,
    author_name: item.author_name || [],
    first_publish_year: item.first_publish_year,
    language: item.language || [],
    title: item.title,
    cover_id: item.cover_id,
    cover_i: item.cover_i,
    edition_count: item.edition_count,
  }));
};

export const getExternalBooksByCategory = async (
  categoryName: string
): Promise<BookType[]> => {
  const response = await openLibraryApi.get(`/subjects/${categoryName}.json`, {
    params: { limit: 30 },
  });

  return response.data.works.map((work: BookType) => ({
    key: work.key,
    author_name: work.author_name || [],
    first_publish_year: work.first_publish_year,
    language: work.language || [],
    title: work.title,
    cover_id: work.cover_id,
    cover_i: work.cover_id, // OpenLibrary uses cover_id
    edition_count: work.edition_count,
  }));
};
