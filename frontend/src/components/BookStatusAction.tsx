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
import type { BookStatus } from "../@types/books";


// Define type for status configuration
export type StatusConfig = {
  icon: React.ElementType;
};
// Props for the BookStatusAction component
interface BookStatusActionProps {
  status?: BookStatus;
  onAddToLibrary: () => void;
  isAdding?: boolean;
  onChangeStatus?: (status: BookStatus) => void;
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
  const statusConfig: Record<BookStatus, StatusConfig> = {
    "Lu": { 
      icon: CheckCircle, 
    },
    "En cours": { 
      icon: BookOpen,
    },
    "À lire": { 
      icon: Clock,
    },
  };

  // If the book has a status, display it with a dropdown for updating
  if (status && statusConfig[status]) {
    const Icon = statusConfig[status].icon;

    // Determine badge variant for UI
  const badgeVariantMap: Record<BookStatus, "success" | "warning" | "default"> = {
    "Lu": "success",
    "En cours": "warning",
    "À lire": "default",
  };

    return (
      <DropdownMenu>
        {/* Trigger badge showing the current status */}
        <DropdownMenuTrigger asChild>
          <Badge
            variant={badgeVariantMap[status]}
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
