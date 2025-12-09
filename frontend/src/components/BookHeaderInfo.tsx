import React from "react";
import { Star, FileText, Calendar } from "lucide-react";

// Props for the BookHeaderInfo component, which displays the main book information in the header section
interface BookHeaderInfoProps {
  title: string;
  author: string;
  category?: string;       // Book category (optional)
  rating?: number;         // Book rating (optional)
  pages: number;           // Number of pages
  year: string;            // Publication year
}

export const BookHeaderInfo: React.FC<BookHeaderInfoProps> = ({ 
  title, 
  author, 
  category, 
  rating, 
  pages, 
  year 
}) => (
  <div className="flex flex-col gap-4 items-start">
    {/* Only display the category badge if it exists */}
    {category && (
      <span className="inline-block px-3 py-1 rounded-full bg-bookochre/10 text-xs font-bold text-bookochre uppercase tracking-widest border border-bookochre/20">
        {category}
      </span>
    )}
    
    <div>
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-bookdark dark:text-bookcream mb-2 leading-tight">
        {title}
      </h1>
      <p className="text-lg text-muted-foreground">
        By <span className="font-semibold text-foreground underline decoration-bookochre/50 underline-offset-4">{author}</span>
      </p>
    </div>

    <div className="flex flex-wrap gap-3 mt-2">
      {/* Only display the rating badge if a rating is provided */}
      {rating !== undefined && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-sm font-medium text-foreground shadow-sm">
          <Star size={16} className="text-bookochre fill-bookochre" aria-hidden="true" /> 
          <span>{rating}/5</span>
        </div>
      )}
      
      {/* Pages badge */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-sm font-medium text-foreground shadow-sm">
        <FileText size={16} className="text-muted-foreground" aria-hidden="true" />
        <span>{pages} pages</span>
      </div>
      
      {/* Year badge */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-sm font-medium text-foreground shadow-sm">
        <Calendar size={16} className="text-muted-foreground" aria-hidden="true" />
        <span>{year}</span>
      </div>
    </div>
  </div>
);