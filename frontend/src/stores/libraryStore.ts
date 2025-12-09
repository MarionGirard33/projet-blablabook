import { create } from "zustand";
import {
  addBookToUserList,
  getUserBooks,
  removeBookFromUserList,
} from "@/api/books";

export type Book = {
  id: number;
  name: string;
  author: string;
  coverId: string;
  description: string;
  isbn: string;
  publishingHouse: string;
  publishedAt: string;
  status?: string;
};

type LibraryState = {
  books: Book[];
  addBook: (userId: number, book: Book) => Promise<void>;
  removeBook: (userId: number, bookId: number) => Promise<void>;
  loadBooks: (userId: number) => Promise<void>;
};

export const useLibraryStore = create<LibraryState>((set) => ({
  books: [],

  // Add a book for a specific user
  addBook: async (userId: number, book: Book): Promise<void> => {
    try {
      if (!userId) throw new Error("User ID is required to add a book.");
      const addedBook: Book = await addBookToUserList(userId, book); // API call
      set((state: LibraryState) => ({
        books: [...state.books, addedBook],
      }));
    } catch (error) {
      console.error("Failed to add book:", error);
    }
  },

  // Remove a book for a specific user
  removeBook: async (userId, bookId) => {
    try {
      if (!userId) throw new Error("User ID is required to remove a book.");
      await removeBookFromUserList(userId, bookId);
      set((state) => ({
        books: state.books.filter((b) => b.id !== bookId),
      }));
    } catch (error) {
      console.error("Failed to remove book:", error);
    }
  },

  // Load books from API for a specific user
  loadBooks: async (userId: number) => {
    try {
      if (!userId) throw new Error("User ID is required to load books.");
      const res: Book[] = await getUserBooks(userId);
      set({ books: res });
    } catch (error) {
      console.error("Failed to load books:", error);
    }
  },
}));
