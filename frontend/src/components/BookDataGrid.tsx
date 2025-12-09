import React from "react";
import { Globe, Library, FileText, Barcode } from "lucide-react";
import { BookDataItem } from "./ui/item";

interface BookDataGridProps {
  isbn: string;
  publisher: string;
  language: string;
  pages: number | string;
}

export const BookDataGrid: React.FC<BookDataGridProps> = ({ isbn, publisher, language, pages }) => (
  <div className="bg-card border border-border rounded-xl p-6 mt-6 shadow-sm">
    {/* BookDataGrid displays book technical details using BookDataItem for each field */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* ISBN field */}
      <BookDataItem icon={<Barcode size={18} />} label="ISBN" value={isbn} />
      {/* Language field */}
      <BookDataItem icon={<Globe size={18} />} label="Language" value={language} />
      {/* Publisher field */}
      <BookDataItem icon={<Library size={18} />} label="Publisher" value={publisher} />
      {/* Pages field */}
      <BookDataItem icon={<FileText size={18} />} label="Pages" value={pages} />
    </div>
  </div>
);