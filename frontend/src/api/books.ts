import type { GetExternalBooksParams } from "../@types/externalBooks";
import type { CreateBookDto, Book } from "../@types/books";
import api from "./axios";

// -----------------------------
// Internal API functions
// -----------------------------

export function getSearchBooks(params: GetExternalBooksParams) {
  const query: Record<string, string> = {};
  if (params.type) query.type = params.type;
  if (params.categoryName) query.categoryName = params.categoryName;
  if (params.searchText) query.searchText = params.searchText;

  return api.get(`/books/search`, { params: query });
}

// Get all books in book table
export const getBooks = async (): Promise<InternalBook[]> => {
  const response = await api.get<InternalBook[]>("/books");
  return response.data;
};

// Get all books from a specific user's list
export const getUserBooks = async (userId: number): Promise<InternalBook[]> => {
  const response = await api.get<InternalBook[]>(`/books/user/${userId}`);
  return response.data;
};

// Add a book to a user's list
export const addBookToUserList = async (
  userId: number,
  bookData: CreateBookDto
): Promise<InternalBook> => {
  const response = await api.post<InternalBook>(
    `/books/user/${userId}`,
    bookData
  );
  return response.data;
};

// Remove a book from a user's list
export const removeBookFromUserList = async (
  userId: number,
  bookId: number
): Promise<{ id: number }[]> => {
  const response = await api.delete<{ id: number }[]>(
    `/books/user/${userId}/book/${bookId}`
  );
  return response.data;
};

// -----------------------------
// External API (OpenLibrary)
// -----------------------------

export const searchExternalBooks = async (
  searchText: string
): Promise<BookType[]> => {
  const response = await externalApi.get("/search.json", {
    params: {
      q: searchText,
      limit: 20,
      language: ["fre", "eng"],
      fields: "key,title,author_name,edition_key",
    },
  });

  const docs = response.data.docs;
  const books: BookType[] = [];

  for (const work of docs) {
    if (!work.edition_key || work.edition_key.length === 0) continue;

    const editionKey = work.edition_key[0]; // prendre uniquement la première édition
    try {
      const editionResponse = await externalApi.get(
        `/books/${editionKey}.json`
      );
      const data = editionResponse.data;

      const languages =
        data.languages?.map((l: any) => l.key.replace("/languages/", "")) || [];
      if (!data.isbn_13 || data.isbn_13.length === 0) continue;

      books.push({
        key: data.key.replace("/books/", ""),
        title: data.title,
        author: data.authors?.[0]?.name || work.author_name?.[0] || "Unknown",
        isbn: data.isbn_13[0],
        language: languages,
        publishDate: data.publish_date,
        cover: data.covers?.[0]
          ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
          : undefined,
      });
    } catch (err) {
      console.warn(`Failed to fetch edition ${editionKey}`, err);
    }
  }
  console.log(books);
  return books;
};

// export const getExternalBooksByCategory = async (
//   categoryName: string
// ): Promise<BookType[]> => {
//   const response = await externalApi.get(`/subjects/${categoryName}.json`, {
//     params: { limit: 30 },
//   });

//   return response.data.works.map((work: BookType) => ({
//     key: work.edition_key,
//     author_name: work.author_name || [],
//     first_publish_year: work.first_publish_year,
//     language: work.language || [],
//     title: work.title,
//     cover_id: work.cover_id,
//     cover_i: work.cover_id, // OpenLibrary uses cover_id
//     edition_count: work.edition_count,
//   }));
// };
