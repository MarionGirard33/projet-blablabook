export type ExternalBookCarouselProps = {
  title: string;
  books: Array<ExternalBook>;
};

export type ExternalBook = {
  key: string;
  title: string;
  author: string;
  isbn: string;
  language: string[];
  publishDate?: string;
  cover?: string;
  description?: string;
  publisher?: string;
};

export interface EditionData {
  key: string;
  title: string;
  authors?: Array<{ name?: string }>;
  isbn_13?: string[];
  languages?: Array<{ key: string }>;
  publish_date?: string;
  covers?: number[];
  works?: Array<{ key: string }>;
  publishers?: string[];
}

export interface WorkSearchDoc {
  author_name?: string[];
  edition_key?: string[];
}

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

export type ExternalApiIsbnResponse = {
  title: string;
  covers?: number[];
  authors?: Array<{ key: string }>;
  works?: Array<{ key: string }>;
  publishers?: string[];
  publish_date?: string;
  number_of_pages?: number;
  languages?: Array<{ key: string }>;
};

export type ExternalApiWorkResponse = {
  description?: string | { value: string };
  subjects?: string[];
  covers?: number[];
};

export type ExternalApiAuthorResponse = {
  name: string;
};
