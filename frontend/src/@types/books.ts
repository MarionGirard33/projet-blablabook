export interface CreateBookDto {
  name: string;
  coverId: string;
  author: string;
  description: string;
  isbn: string;
  publishingHouse: string;
  publishedAt: string; // YYYY-MM-DD
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
  status?: "Lu" | "En cours" | "À lire";
  readStart?: string;
  readEnd?: string;
}



