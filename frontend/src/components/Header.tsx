import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/authStore";
import logo from "@/assets/Blablabook-svg.svg";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [open, setOpen] = useState(false);
  const { location } = useRouterState();

  const navigate = useNavigate();

  const isActive = (path: string) =>
    location.pathname === path ? "font-bold text-secondary" : "";

  return (
    <header className=" px-4 py-6 text-white bg-primary shadow relative text-xl">
      <div className="flex items-center justify-between sm:px-10">
        <Link
          to="/"
          className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-bookochre rounded"
        >
          <div className="rounded-2xl flex items-center gap-2">
            <img src={logo} className="w-20" alt="" />
            <span className="text-xl text-secondary">Blablabook</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-4"
          aria-label="Navigation principale"
        >
          <Link to="/" className={isActive("/")}>
            Accueil
          </Link>
          {user ? (
            <>
              <Link to="/library" className={`${isActive("/library")}`}>
                Ma bibliothèque
              </Link>
              <div className="hidden md:flex items-center ">
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer" asChild>
                    <Avatar className="w-8 h-8 border border-bookbeige">
                      <AvatarImage
                        key={user.image}
                        src={user.image ? `/images/${user.image}` : undefined}
                        alt={`Avatar de ${user.username || "X"}`}
                      />
                      <AvatarFallback className="bg-bookbeige/50 border-bookbeige font-bold">
                        {user.username ? user.username[0].toUpperCase() : "X"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className={`${isActive("/profile")}`}
                      onClick={() => navigate({ to: "/profile" })}
                    >
                      Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500 font-semibold"
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
              <Button className="text-xl">Se connecter</Button>
            </Link>
          )}
        </nav>

        {/* Avatar mobile or burger menu */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-bookochre rounded"
            aria-label="Ouvrir le menu"
          >
            {user ? (
              <Avatar className="w-10 h-10 cursor-pointer border border-bookbeige">
                <AvatarImage
                  src={user.image ? `/images/${user.image}` : undefined}
                  alt={`Avatar de ${user.username || "X"}`}
                />
                <AvatarFallback className="text-xl bg-bookbeige/50 border-bookbeige font-bold">
                  {user.username ? user.username[0].toUpperCase() : "X"}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Menu className="cursor-pointer" />
            )}
          </button>
        </div>
        {/* Mobile menu overlay */}
        {open && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex flex-col p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation mobile"
          >
            <button
              type="button"
              className="self-end text-white text-2xl cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white rounded"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
            >
              <X size={28} aria-hidden="true" />
            </button>
            <nav
              className="flex flex-col items-center gap-6 mt-20"
              aria-label="Navigation"
            >
              <Link
                to="/"
                className="text-white text-xl"
                onClick={() => setOpen(false)}
              >
                Accueil
              </Link>
              {user ? (
                <>
                  <Link
                    to="/library"
                    className="text-white text-xl"
                    onClick={() => setOpen(false)}
                  >
                    Librairie
                  </Link>
                  <Link
                    to="/profile"
                    className="text-white text-xl"
                    onClick={() => setOpen(false)}
                  >
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
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button>Se connecter</Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
