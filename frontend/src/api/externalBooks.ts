import type {
  ExternalBook,
  ExternalBookDisplayData,
  ExternalApiIsbnResponse,
  ExternalApiWorkResponse,
  ExternalApiAuthorResponse,
  WorkSearchDoc,
  EditionData,
} from "../@types/externalBooks";
import externalApi from "./axiosExternal";

// -----------------------------
// CONSTANTS
// -----------------------------

const DEFAULT_COVER = "/default-book-cover.png";

// -----------------------------
// HELPERS
// -----------------------------

const parseDescription = (desc: any): string => {
  if (!desc) return "";
  if (typeof desc === "string") return desc;
  if (typeof desc === "object" && desc.value) return desc.value;
  return "";
};

// Simple in-memory cache to avoid fetching the same work twice
const workDescriptionCache = new Map<string, string>();

const getWorkDescription = async (workKey: string): Promise<string> => {
  if (workDescriptionCache.has(workKey)) {
    return workDescriptionCache.get(workKey) as string;
  }

  const dataWork = await getOpenLibWorkData(workKey);
  const desc = parseDescription(dataWork.description);
  workDescriptionCache.set(workKey, desc);
  return desc;
};

const extractLanguages = (edition: EditionData): string[] => {
  return (
    edition.languages?.map((l) => l.key.split("/").pop() || "en") || ["en"]
  );
};

const isLanguageAllowed = (
  languages: string[],
  allowedLanguages: Set<string>
): boolean => {
  return languages.some((lang) => allowedLanguages.has(lang));
};

const buildCoverUrl = (edition: EditionData): string => {
  const coverId = edition.covers?.[0];
  return coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : DEFAULT_COVER;
};

const fetchDescription = async (
  edition: EditionData,
  isbn: string
): Promise<string> => {
  try {
    const workKeyFromEdition = edition.works?.[0]?.key;

    if (workKeyFromEdition) {
      return await getWorkDescription(workKeyFromEdition);
    }

    const dataIsbn = await getOpenLibIsbnData(isbn);
    const workKey = dataIsbn.works?.[0]?.key;
    if (workKey) {
      return await getWorkDescription(workKey);
    }
  } catch (err) {
    console.warn(`Failed to fetch description for ISBN ${isbn}:`, err);
  }
  return "";
};

const createExternalBook = (
  edition: EditionData,
  work: WorkSearchDoc,
  isbn: string,
  languages: string[],
  coverUrl: string,
  description: string
): ExternalBook => {
  return {
    key: edition.key,
    title: edition.title,
    author:
      work.author_name?.[0] || edition.authors?.[0]?.name || "Auteur inconnu",
    isbn,
    language: languages,
    publishDate: edition.publish_date,
    cover: coverUrl,
    description: description || undefined,
    publisher: edition.publishers?.[0],
  };
};

// -----------------------------
// SEARCH BY TITLE OR AUTHOR
// -----------------------------

export const searchExternalBooks = async (
  searchText: string
): Promise<ExternalBook[]> => {
  const allowedLanguages = new Set(["fre", "eng", "fr", "en", "fra", "enm"]);

  const response = await externalApi.get("/search.json", {
    params: {
      q: searchText,
      limit: 20,
      fields: "key,title,author_name,edition_key",
    },
  });

  const docs: WorkSearchDoc[] = response.data.docs || [];
  const books: ExternalBook[] = [];

  for (const work of docs) {
    if (!work.edition_key || work.edition_key.length === 0) continue;

    const editionKey = work.edition_key[0];
    try {
      const editionResponse = await externalApi.get<EditionData>(
        `/books/${editionKey}.json`
      );
      const edition = editionResponse.data;

      const isbn = edition.isbn_13?.[0] || "";
      if (!isbn) continue;

      const languages = extractLanguages(edition);
      if (!isLanguageAllowed(languages, allowedLanguages)) continue;

      const coverUrl = buildCoverUrl(edition);
      const description = await fetchDescription(edition, isbn);

      books.push(
        createExternalBook(
          edition,
          work,
          isbn,
          languages,
          coverUrl,
          description
        )
      );
    } catch (err) {
      console.warn(`Failed to fetch edition ${editionKey}:`, err);
    }
  }
  return books;
};

// -----------------------------
// API functions
// -----------------------------

// GET Book ISBN Data
export const getOpenLibIsbnData = async (
  isbn: string
): Promise<ExternalApiIsbnResponse> => {
  const response = await externalApi.get<ExternalApiIsbnResponse>(
    `/isbn/${isbn}.json`
  );
  return response.data;
};

// GET Book Work Data
export const getOpenLibWorkData = async (
  workKey: string
): Promise<ExternalApiWorkResponse> => {
  const response = await externalApi.get<ExternalApiWorkResponse>(
    `${workKey}.json`
  );
  return response.data;
};

// GET Book Author Data
export const getOpenLibAuthorData = async (
  authorKey: string
): Promise<ExternalApiAuthorResponse> => {
  const response = await externalApi.get<ExternalApiAuthorResponse>(
    `${authorKey}.json`
  );
  return response.data;
};

// -----------------------------
// PRINCIPAL FUNCTION FOR BOOK DETAILS
// -----------------------------

export const getFullExternalBook = async (
  isbn: string
): Promise<ExternalBookDisplayData> => {
  // MAPPING DATA FROM MULTIPLE CALLS
  const dataIsbn = await getOpenLibIsbnData(isbn);
  const workKey = dataIsbn.works?.[0]?.key;
  const authorKey = dataIsbn.authors?.[0]?.key;
  const [dataWork, dataAuthor] = await Promise.all([
    workKey
      ? getOpenLibWorkData(workKey)
      : Promise.resolve({} as ExternalApiWorkResponse),
    authorKey
      ? getOpenLibAuthorData(authorKey)
      : Promise.resolve({
          name: "Auteur inconnu",
        } as ExternalApiAuthorResponse),
  ]);
  const coverId = dataIsbn.covers?.[0] || dataWork.covers?.[0];
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : DEFAULT_COVER;

  return {
    isbn: isbn,
    title: dataIsbn.title,
    authors: [dataAuthor.name || "Inconnu"],
    cover: coverUrl,
    description: parseDescription(dataWork.description),
    publisher: dataIsbn.publishers?.[0] || "Éditeur inconnu",
    publishedAt: dataIsbn.publish_date || "",
    pages: dataIsbn.number_of_pages || 0,
    language: dataIsbn.languages?.[0]?.key?.split("/").pop() || "en",
    categories: dataWork.subjects || [],
  };
};
