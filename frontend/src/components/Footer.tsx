import { Book, Mail, Lock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 py-6 mt-auto border-t">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2">
          <Book className="h-6 w-6" />
          <span className="font-bold text-lg">Blablabook</span>
        </div>
        <nav className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <a href="mailto:contact@blablabook.com">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Mail className="h-5 w-5" />
                  Contact
                </Button>
              </a>
            </TooltipTrigger>
            <TooltipContent>Envoyer un mail</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <a href="/cgu">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <FileText className="h-5 w-5" />
                  CGU
                </Button>
              </a>
            </TooltipTrigger>
            <TooltipContent>Conditions générales d’utilisation</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <a href="/confidentialite">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Lock className="h-5 w-5" />
                  Confidentialité
                </Button>
              </a>
            </TooltipTrigger>
            <TooltipContent>Politique de confidentialité</TooltipContent>
          </Tooltip>
        </nav>
        <div className="text-xs text-gray-500 text-center md:text-right">
          © {new Date().getFullYear()} Blablabook. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
