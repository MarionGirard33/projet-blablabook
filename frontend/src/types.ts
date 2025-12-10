export type BookCarouselProps = {
  title: string;
  books: Array<BookType>;
};

export type BookType = {
  key: string;
  author_name: string[];
  first_publish_year?: number;
  language: string[];
  title: string;
  cover_id?: number;
  cover_i?: number;
  edition_count?: number;
};

export type GetBooksParams = {
  type: "random" | "category" | "search";
  categoryName?: string;
  searchText?: string;
};
