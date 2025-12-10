export class CreateBookDto {
  // Book title
  name: string;

  // Cover ID or URL
  coverId: string;

  // Author name
  author: string;

  // Book description
  description: string;

  // ISBN (unique)
  isbn: string;

  // Publishing house
  publishingHouse: string;

  // Publishing date (YYYY-MM-DD)
  publishedAt: string; // Drizzle date type expects a string or Date
}
