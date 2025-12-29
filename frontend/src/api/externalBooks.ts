// Frontend client for OpenLibrary external API.
// Orchestrates search on works, loads first edition details, fetches work descriptions,
// and maps them into our `ExternalBook` shape.
import type {
  ExternalBook,
  EditionData,
  WorkData,
  WorkDetails,
  DescriptionField,
  WorkSearchDoc,
} from "../@types/externalBooks";
import externalApi from "./axiosExternal";

// Helper: normalize OpenLibrary `description` which can be a string or an object
const extractDescription = (
  descriptionField?: DescriptionField
): string | undefined => {
  if (!descriptionField) return undefined;

  return typeof descriptionField === "string"
    ? descriptionField
    : descriptionField.value;
};

// Helper: fetch a work's description from `/works/{workKey}.json`
const fetchWorkDescription = async (
  workKey: string
): Promise<string | undefined> => {
  try {
    const workResponse = await externalApi.get<WorkDetails>(
      `/works/${workKey}.json`
    );
    return extractDescription(workResponse.data.description);
  } catch (err) {
    console.warn(`Failed to fetch work description for ${workKey}`, err);
    return undefined;
  }
};

// Helper: build an `ExternalBook` from an edition + its parent work
const processEdition = async (
  data: EditionData,
  work: WorkData
): Promise<ExternalBook | null> => {
  // Validate ISBN existence
  if (!data.isbn_13 || data.isbn_13.length === 0) {
    return null;
  }

  // Extract languages
  const languages = (data.languages || []).map((lang) =>
    lang.key.replace("/languages/", "")
  );

  // Fetch work description if available
  let description: string | undefined;
  if (data.works && data.works.length > 0) {
    const workKey = data.works[0].key.replace("/works/", "");
    description = await fetchWorkDescription(workKey);
  }

  return {
    key: data.key.replace("/books/", ""),
    title: data.title,
    author: data.authors?.[0]?.name || work.author_name?.[0] || "Unknown",
    isbn: data.isbn_13[0],
    language: languages,
    publishDate: data.publish_date,
    cover: data.covers?.[0]
      ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
      : undefined,
    description,
    publisher: data.publishers?.[0] || undefined,
  };
};

// Search OpenLibrary works, then load the first edition to enrich details
export const searchExternalBooks = async (
  searchText: string
): Promise<ExternalBook[]> => {
  const allowedLanguages = new Set(["fre", "eng"]);
  const response = await externalApi.get("/search.json", {
    params: {
      q: searchText,
      limit: 20,
      fields: "key,title,author_name,edition_key",
    },
  });

  const docs: WorkSearchDoc[] = response.data.docs;
  const books: ExternalBook[] = [];

  for (const work of docs) {
    if (!work.edition_key || work.edition_key.length === 0) continue;

    const editionKey = work.edition_key[0]; // take only the first edition
    try {
      const editionResponse = await externalApi.get<EditionData>(
        `/books/${editionKey}.json`
      );
      const book = await processEdition(editionResponse.data, work);
      // Keep only French/English editions for now
      if (book?.language.some((lang) => allowedLanguages.has(lang))) {
        books.push(book);
      }
    } catch (err) {
      console.warn(`Failed to fetch edition ${editionKey}`, err);
    }
  }
  // Return normalized external books
  return books;
};
