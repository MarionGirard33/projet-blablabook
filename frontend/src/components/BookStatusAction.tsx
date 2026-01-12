import React from "react";
import { Heart, CheckCircle, BookOpen, Clock, Loader2 } from "lucide-react";
import { Button } from "./ui/button"; 
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

// Define the possible book statuses
export type BookStatus = "Lu" | "En cours" | "À lire" | null;

// Props for the BookStatusAction component
interface BookStatusActionProps {
  status: BookStatus;
  onAddToLibrary: () => void;
  isAdding?: boolean;
  onChangeStatus?: (status: Exclude<BookStatus, null>) => void;
  isUpdatingStatus?: boolean; 
}

// Component to display the book status and allow adding/updating
export const BookStatusAction: React.FC<BookStatusActionProps> = ({ 
  status, 
  onAddToLibrary, 
  isAdding = false, 
  onChangeStatus,
  isUpdatingStatus = false,
}) => {

  // Map each status to a label, icon, and styling
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

  // If the book has a status, display it with a dropdown for updating
  if (status && statusConfig[status]) {
    const config = statusConfig[status];
    const Icon = config.icon;

    // Determine badge variant for UI
    let badgeVariant: "success" | "warning" | "default" = "default";
    if (status === "Lu") badgeVariant = "success";
    else if (status === "En cours") badgeVariant = "warning";

    return (
      <DropdownMenu>
        {/* Trigger badge showing the current status */}
        <DropdownMenuTrigger asChild>
          <Badge 
            variant={badgeVariant} 
            className="cursor-pointer flex items-center gap-2 px-3 py-2 text-base"
          >
            <Icon size={18} strokeWidth={2.2} />
            {isUpdatingStatus && (
              <Loader2 className="mr-1 h-4 w-4 animate-spin inline" />
            )}
            {status}
          </Badge>
        </DropdownMenuTrigger>

        {/* Dropdown menu for changing the status */}
        <DropdownMenuContent align="start">
          {["À lire", "En cours", "Lu"].map((s) => (
            <DropdownMenuItem
              key={s}
              onClick={() => onChangeStatus?.(s as Exclude<BookStatus, null>)}
              disabled={isUpdatingStatus || s === status} // Disable if updating or same status
            >
              {s}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If the book is not in the library yet, show "Add to Library" button
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col items-center text-center gap-4">
      <div className="text-center space-y-1">
        <h3 className="font-semibold text-lg text-gray-900">Intéressé par ce livre?</h3>
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
        {isAdding ? "Adding..." : "Ajouter à ma bibliothèque"}
      </Button>
    </div>
  );
};
