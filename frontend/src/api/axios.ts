import axios from "axios";

let baseURL: string;

// Choix de l'URL selon l'environnement
if (import.meta.env.MODE === "dev") {
  // backend local pour dev
  baseURL = "http://localhost:3000"; 
} else if (import.meta.env.MODE === "prod") {
  // URL prod injectée par CI/CD
  baseURL = import.meta.env.VITE_BACKEND_URL; 
} else {
  // fallback sûr
  baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"; 
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
