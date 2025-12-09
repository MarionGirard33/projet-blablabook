import React from "react";

interface BookCoverProps {
  url: string;
  title: string;
}

export const BookCover: React.FC<BookCoverProps> = ({ url, title }) => (
  <div className="flex items-center justify-center w-full h-full p-4">
    <div className="group relative w-[220px] aspect-[2/3] rounded-xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-bookdark/40 hover:-translate-y-2">
      
      {/* Smooth zoom effect on image */}
      <img
        src={url}
        alt={`Couverture de ${title}`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 active:scale-110"
      />
      
      {/* Progressive dark overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-bookdark/90 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-80" />

      {/* Title appears from the bottom on hover */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
        <div className="rounded-lg bg-bookcream/10 backdrop-blur-md border border-bookcream/20 p-3 shadow-sm">
          <h3 className="font-serif text-base font-medium text-bookcream text-center leading-tight">
            {title}
          </h3>
        </div>
      </div>
    </div>
  </div>
);