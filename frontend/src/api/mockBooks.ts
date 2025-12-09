export const mockBooks = [
  {
    id: 12345,
    name: "Le Petit Prince",
    cover: "https://covers.openlibrary.org/b/id/15096605-L.jpg",
    author: "Antoine de Saint-Exupéry",
    description: "Un conte poétique et philosophique sur l'amitié, l'amour et le sens de la vie.",
    ISBN: "9782070612758",
    publishing_house: "Gallimard",
    published_at: "1943",
  },
  {
    id: 67890,
    name: "L'Étranger",
    cover: "https://covers.openlibrary.org/b/id/654321-L.jpg",
    author: "Albert Camus",
    description: "Un roman sur l'absurdité de la vie et l'aliénation.",
    ISBN: "9782070360024",
    publishing_house: "Gallimard",
    published_at: "1942",
  },
];

export function getMockBookDetails(id: string | number) {
  // Accepts string or number, converts string id to number if needed
  const numId = typeof id === "string" ? Number(id.replaceAll(/\D/g, "")) : id;
  return mockBooks.find(book => book.id === numId);
}
