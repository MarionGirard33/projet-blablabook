import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "@tanstack/react-router";

export default function RootLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="container mx-auto flex min-h-screen flex-1 justify-center py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
