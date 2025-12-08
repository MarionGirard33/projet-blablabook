import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    onSearch(e.target.value);
  }

  return (
    <form
      className="w-full max-w-md mx-auto flex items-center gap-2 bg-white rounded-lg shadow px-3 py-2 mt-6 sm:max-w-lg md:max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(query);
      }}
    >
      <Input
        type="text"
        placeholder="Rechercher un livre, un auteur..."
        value={query}
        onChange={handleChange}
        className="flex-1 border-none focus:ring-0"
      />
      <Button type="submit" variant="ghost" size="icon">
        <Search className="h-5 w-5 text-gray-500" />
      </Button>
    </form>
  );
}
