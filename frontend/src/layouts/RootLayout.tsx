import { Link, Outlet } from "@tanstack/react-router";

export default function RootLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* <Header /> */}
      {/* TEMP========================= */}
      <header className="flex gap-x-5">
        <Link to="/register" className="underline">Register</Link>
        <Link to="/login" className="underline">Login</Link>
      </header>
      {/*  ============================== */}
      <main className="container mx-auto flex min-h-screen flex-1 justify-center py-10">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}
