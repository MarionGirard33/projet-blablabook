import type { ExternalBook } from "../@types/externalBooks";
import externalApi from "./axiosExternal";

// -----------------------------
// External API (OpenLibrary)
// -----------------------------

export const searchExternalBooks = async (
  searchText: string
): Promise<ExternalBook[]> => {
  const response = await externalApi.get("/search.json", {
    params: {
      q: searchText,
      limit: 20,
      language: ["fre", "eng"],
      fields: "key,title,author_name,edition_key",
    },
  });

  const docs = response.data.docs;
  const books: ExternalBook[] = [];

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
