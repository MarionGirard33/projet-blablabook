import { create } from "zustand";

export type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
};

type LibraryState = {
  books: Book[];
  addBook: (book: Book) => void;
  removeBook: (id: string) => void;
};

export const useLibraryStore = create<LibraryState>((set) => ({
  books: [],
  addBook: (book) =>
    set((state) => ({
      books: [...state.books, book],
    })),
  removeBook: (id) =>
    set((state) => ({
      books: state.books.filter((b) => b.id !== id),
    })),
}));
