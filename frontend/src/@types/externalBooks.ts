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
  description?: string;
  publisher?: string;
};

export type DescriptionField = string | { value: string };

export interface LanguageRef {
  key: string;
}

export interface WorkRef {
  key: string;
}

export interface EditionData {
  key: string;
  title: string;
  authors?: Array<{ name?: string }>;
  isbn_13?: string[];
  languages?: LanguageRef[];
  publish_date?: string;
  covers?: number[];
  works?: WorkRef[];
  publishers?: string[];
}

export interface WorkData {
  author_name?: string[];
}

export interface WorkDetails {
  description?: DescriptionField;
}

export interface WorkSearchDoc extends WorkData {
  edition_key?: string[];
}

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
