import axios from "axios";

const apiExternal = axios.create({
  baseURL: "https://openlibrary.org",
});

export default apiExternal;
