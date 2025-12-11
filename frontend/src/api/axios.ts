import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const externalApi = axios.create({
  baseURL: "https://openlibrary.org",
});
