import React from "react";
import { Heart, CheckCircle, BookOpen, Clock, Loader2, BookmarkCheck } from "lucide-react";
import { Button } from "./ui/button"; 

export type BookStatus = "Lu" | "En cours" | "À lire" | null;

interface BookStatusActionProps {
  status: BookStatus; 
  onAddToLibrary: () => void; 
  isAdding?: boolean; 
}

export const BookStatusAction: React.FC<BookStatusActionProps> = ({ 
  status, 
  onAddToLibrary, 
  isAdding = false 
}) => {

  const statusConfig: Record<string, { label: string; icon: any; style: string; iconColor: string }> = {
    "Lu": { 
      label: "Livre lu", 
      icon: CheckCircle, 
      style: "bg-emerald-50 border-emerald-200 text-emerald-800",
      iconColor: "text-emerald-600 bg-emerald-100"
    },
    "En cours": { 
      label: "Lecture en cours", 
      icon: BookOpen, 
      style: "bg-blue-50 border-blue-200 text-blue-800",
      iconColor: "text-blue-600 bg-blue-100"
    },
    "À lire": { 
      label: "À lire", 
      icon: Clock, 
      style: "bg-amber-50 border-amber-200 text-amber-800",
      iconColor: "text-amber-600 bg-amber-100"
    },
  };

  if (status && statusConfig[status]) {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <div className={`rounded-xl border p-5 flex items-center justify-between shadow-sm animate-in fade-in zoom-in-95 duration-300 ${config.style}`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${config.iconColor}`}>
            <Icon size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">Ma bibliothèque</span>
            <span className="font-bold text-xl">{config.label}</span>
          </div>
        </div>
        <BookmarkCheck className="opacity-10 w-16 h-16 -mr-4 -my-4 rotate-12" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col items-center text-center gap-4">
      <div className="text-center space-y-1">
        <h3 className="font-semibold text-lg text-gray-900">Ce livre vous intéresse ?</h3>
        <p className="text-sm text-gray-500">Ajoutez-le pour le suivre.</p>
      </div>

      <Button 
        onClick={onAddToLibrary} 
        disabled={isAdding}
        className="w-full h-12 text-md bg-rose-600 hover:bg-rose-700 text-white shadow-md hover:shadow-lg transition-all active:scale-95 group"
      >
        {isAdding ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Heart className="mr-2 h-5 w-5 fill-transparent group-hover:fill-white transition-colors duration-300" />
        )}
        {isAdding ? "Ajout en cours..." : "Ajouter à ma bibliothèque"}
      </Button>
    </div>
  );
};