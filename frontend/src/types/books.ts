export type BookCarouselProps = {
  title: string;
  books: Array<BookType>;
};

export interface BookType {
  key: string; // book/ ex: "OL55900058M"
  title: string;
  author: string;
  isbn: string; // isbn_13
  language: string[];
  publishDate?: string;
  cover?: string;
}

export type GetBooksParams = {
  type: "random" | "category" | "search";
  categoryName?: string;
  searchText?: string;
};

export type InternalBook = {
  id: number;
  name: string;
  author: string;
  coverId: string;
  description: string;
  isbn: string;
  publishingHouse: string;
  publishedAt: string;
  listName?: string;
  status?: "Lu" | "En cours" | "À lire";
  readStart?: string;
  readEnd?: string;
};
