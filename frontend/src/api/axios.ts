import axios from "axios";

const { BACKEND_URL } = import.meta.env;

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

export default api;
