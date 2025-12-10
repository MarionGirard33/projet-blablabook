import { useAuthStore } from "@/stores/authStore";

export default function HomePage() {
  // ===============================
  // TEMP
  const authStore = useAuthStore();
  console.log(authStore);
  // ================================
  return <h1>Bienvenue sur Blablabook !</h1>;
}
