import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "@tanstack/react-router";

export default function RootLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 w-full px-4 sm:px-12 md:px-20 py-10 flex flex-col">
        <div className="block sm:hidden mb-4"></div>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
