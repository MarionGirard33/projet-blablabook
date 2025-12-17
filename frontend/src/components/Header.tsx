import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Menu, X, Book } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/authStore";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  // const user = true;
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <header className=" px-4 py-4 bg-white shadow relative">
      <div className="flex items-center justify-between sm:px-10">
        <Link to="/" className="flex items-center gap-2">
          <Book className="h-8 w-8" />
          <span className="font-bold text-xl">Blablabook</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/" className="hover:underline">
            Accueil
          </Link>
          {user ? (
            <>
              <Link to="/library" className="hover:underline">
                Librairie
              </Link>
              <div className="hidden md:flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer" asChild>
                    <Avatar>
                      <img
                        src={user.image ? `/images/${user.image}` : "/images/image1.jpg"}
                        alt={`Avatar de ${user.username || "l'utilisateur"}`}
                        className="w-8 h-8 rounded-full"
                      />
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => navigate({ to: "/profile" })}
                    >
                      Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={() => {
                        logout();
                        navigate({ to: "/" });
                      }}
                    >
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <Link to="/login">
              <Button>Se connecter</Button>
            </Link>
          )}
        </nav>

        {/* Mobile burger */}
        <button className="md:hidden" onClick={() => setOpen(true)}>
          <Menu className="cursor-pointer" />
        </button>
        {/* Mobile menu overlay */}
        {open && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex flex-col p-4">
            <button className="self-end text-white text-2xl cursor-pointer" onClick={() => setOpen(false)}>
              <X size={28} />
            </button>
            <nav className="flex flex-col items-center gap-6 mt-20">
              <Link to="/" className="text-white text-xl" onClick={() => setOpen(false)}>
                Accueil
              </Link>
              {user ? (
                <>
                  <Link to="/library" className="text-white text-xl" onClick={() => setOpen(false)}>
                    Librairie
                  </Link>
                  <Link to="/profile" className="text-white text-xl" onClick={() => setOpen(false)}>
                    {"Mon profil"}
                  </Link>
                  <Button
                    variant="destructive"
                    className="text-white"
                    onClick={() => {
                      logout();
                      navigate({ to: "/" });
                      setOpen(false);
                    }}
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button>Se connecter</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}