import React from "react";

// BookDataItem is a reusable UI component for displaying a labeled value with an icon.
// Used in data grids or detail views for book information.
export interface BookDataItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

export const BookDataItem: React.FC<BookDataItemProps> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 rounded-full bg-bookochre/10 text-bookochre">
      {icon}
    </div>
    <div>
      <p className="text-xs text-muted-foreground uppercase font-semibold">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  </div>
);
