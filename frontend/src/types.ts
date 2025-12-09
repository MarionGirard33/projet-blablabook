export type BookCarouselProps = {
  title: string;
  books: Array<BookType>;
};

export type BookType = {
  id: number;
  title: string;
  author: string;
  cover: string;
  description: string;
  genre: string;
  rating: number;
  year: number;
  pages: number;
};

export type GetBooksParams = {
  type: "random" | "category" | "search";
  categoryName?: string;
  searchText?: string;
};
