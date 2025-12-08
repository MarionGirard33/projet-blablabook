import { create } from "zustand";
import { getBooks } from "@/api/getBooks"; // Ton mock axios

export type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  description: string;
};

type LibraryState = {
  books: Book[];
  addBook: (book: Book) => void;
  removeBook: (id: string) => void;
  loadBooks: () => Promise<void>; // new function to load mock API
};

export const useLibraryStore = create<LibraryState>((set) => ({
  books: [],

  // Add a book
  addBook: (book) =>
    set((state) => ({
      books: [...state.books, book],
    })),

  // Remove a book
  removeBook: (id) =>
    set((state) => ({
      books: state.books.filter((b) => b.id !== id),
    })),

  // Load books from mock API
  loadBooks: async () => {
    const res: any = await getBooks();
    set({ books: res.data });
  },
}));
