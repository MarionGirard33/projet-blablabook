export type ExternalBookCarouselProps = {
  title: string;
  books: Array<ExternalBook>;
};

export type ExternalBook = {
  key: string; // book/ ex: "OL55900058M"
  title: string;
  author: string;
  isbn: string; // isbn_13
  language: string[];
  publishDate?: string;
  cover?: string;
};

export type GetExternalBooksParams = {
  type: "random" | "category" | "search";
  categoryName?: string;
  searchText?: string;
};

// Todo revoir type @mohini
export type ExternalBookDisplayData = {
  title: string;
  authors: string[];
  cover: string;
  description: string;
  isbn: string;
  publisher: string;
  publishedAt: string;
  pages: number;
  language: string;
  categories: string[];
};
