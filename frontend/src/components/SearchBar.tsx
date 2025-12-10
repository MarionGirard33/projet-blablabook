import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type SearchBarProps = {
  readonly onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length >= 3) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  return (
    <form
      className="w-full max-w-md mx-auto flex items-center gap-2 bg-white rounded-lg shadow px-3 py-2 mt-10 mb-10 sm:max-w-lg md:max-w-2xl"
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
