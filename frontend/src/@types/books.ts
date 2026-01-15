export type BookStatus = "Lu" | "En cours" | "À lire";
export interface CreateBookDto {
  name: string;
  coverId: string;
  author: string;
  description: string;
  isbn: string;
  publishingHouse: string;
  publishedAt: string; // YYYY-MM-DD
  categories: string[];
}

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
  status?: BookStatus;
  readStart?: string;
  readEnd?: string;
  categories: string[];
}
