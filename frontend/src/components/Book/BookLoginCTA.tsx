import React from "react";
import { LogIn } from "lucide-react";
import { Button } from "../ui/button";

interface BookLoginCTAProps {
  onClick: () => void;
}

export const BookLoginCTA: React.FC<BookLoginCTAProps> = ({ onClick }) => {
  return (
    <div className=" w-full bg-white text-sm border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col items-center text-center gap-4">
      <div className="text-center space-y-1">
        <h3 className="font-semibold text-lg text-gray-900">
          {"Intéressé par ce livre ?"}
        </h3>
      </div>

      <Button
        onClick={onClick}
        className="w-full h-12 text-md shadow-md hover:shadow-lg transition-all active:scale-95 group bg-primary hover:bg-primary/90 text-white"
      >
        <LogIn className="mr-2 h-5 w-5" />
        Connectez-vous pour l'ajouter
      </Button>
    </div>
  );
};