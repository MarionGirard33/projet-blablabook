import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Menu, X, Book } from "lucide-react";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const [open, setOpen] = useState(false);

  return (
    <header className=" px-4 py-4 bg-white shadow relative">
      <div className="flex items-center justify-between sm:px-10">
        <Link to="/" className="flex items-center gap-2">
          <Book className="h-8 w-8" />
          <span className="font-bold text-xl">Blablabook</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/" className="hover:underline">
            Accueil
          </Link>
          {!user ? (
            <Link to="/login">
              <Button>Se connecter</Button>
            </Link>
          ) : (
            <Link to="/profile">{user.username}</Link>
          )}
        </nav>
        <button className="md:hidden" onClick={() => setOpen(true)}>
          <Menu />
        </button>
        {open && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex flex-col">
            <button className="self-end m-4" onClick={() => setOpen(false)}>
              <X color="white" />
            </button>
            <nav className="flex flex-col items-center gap-6 mt-20">
              <Link
                to="/"
                className="text-white text-xl"
                onClick={() => setOpen(false)}
              >
                Accueil
              </Link>
              {!user ? (
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button>Se connecter</Button>
                </Link>
              ) : (
                <Link
                  to="/profile"
                  className="text-white text-xl"
                  onClick={() => setOpen(false)}
                >
                  {user.username}
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
