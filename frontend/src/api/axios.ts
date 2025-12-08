import axios from "axios";
import Image1 from "@/assets/Image1.png";
import Image2 from "@/assets/Image2.png";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000", // placeholder, not used for mock
});

// ------- MOCK DATA -------
const mockBooks = [
  {
    id: "1",
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    status: "Lu",
    coverUrl: Image1,
    description:
      "A young prince explores different planets and learns about life and love.",
  },
  {
    id: "2",
    title: "L'Alchimiste",
    author: "Paulo Coelho",
    status: "A lire",
    coverUrl: Image2,
    description:
      "A shepherd follows his personal legend in search of treasure and self-discovery.",
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    status: "En cours",
    coverUrl: Image1,
    description:
      "A dystopian novel about totalitarian regime, surveillance, and freedom.",
  },
  {
    id: "4",
    title: "La Horde du Contrevent",
    author: "Alain Damasio",
    status: "A lire",
    coverUrl: Image2,
    description:
      "An epic journey of a group of wind hunters facing a harsh world.",
  },
  {
    id: "5",
    title: "Les Misérables",
    author: "Victor Hugo",
    status: "Lu",
    coverUrl: Image1,
    description:
      "A story of justice, love, and redemption set in 19th century France.",
  },
];

// ------- MOCK API -------

// Mock the GET /books route
api.get = async (url: string) => {
  if (url === "/books") {
    // Return mock data
    return {
      data: mockBooks,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    };
  }

  // Throw error for any other routes
  throw new Error("Mocked route does not exist: " + url);
};

// Export the mock Axios instance
export default api;
