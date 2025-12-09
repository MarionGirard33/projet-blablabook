// src/types/Book.ts
// Book interface describes the structure of a book object returned by the API or mock
export interface Book {
  id: number;
  name: string;
  cover: string;
  author: string;
  description: string;
  ISBN: string;
  publishing_house: string;
  published_at: string;
  // numberOfPages?: number; // Optional field for page count
  // language?: string; // Optional field for book language
  // subjects?: string[]; // Optional field for book subjects
  // categories?: Category[]; // For including related categories
  // reviews?: Review[]; // For including related reviews
}
