import React from "react";

// Props for the BookHeaderInfo component
interface BookHeaderInfoProps {
  title: string;
  author: string;
}

export const BookHeaderInfo: React.FC<BookHeaderInfoProps> = ({ 
  title, 
  author,
}) => (
  <div className="flex flex-col gap-4 items-start">
    <div>
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-bookdark dark:text-bookcream mb-2 leading-tight">
        {title}
      </h1>
      <p className="text-lg text-muted-foreground">
        By <span className="font-semibold text-foreground underline decoration-bookochre/50 underline-offset-4">{author}</span>
      </p>
    </div>
  </div>
);