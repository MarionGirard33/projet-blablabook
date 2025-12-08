import api from "./axios";

export function getBooks() {
  return api.get("/books");
}
