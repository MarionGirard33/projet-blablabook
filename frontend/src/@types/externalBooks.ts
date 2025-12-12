export type ExternalBookCarouselProps = {
  title: string;
  books: Array<BookType>;
};

export type ExternalBook = {
  key: string;
  author_name: string[];
  first_publish_year?: number;
  language: string[];
  title: string;
  cover_id?: number;
  cover_i?: number;
  edition_count?: number;
  isbn: string;
};

export type GetExternalBooksParams = {
  type: "random" | "category" | "search";
  categoryName?: string;
  searchText?: string;
};

// Todo revoir type @mohini
export type ExternalBookDisplayData {
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
}