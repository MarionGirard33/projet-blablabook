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
    if (debouncedQuery.length === 0) {
      onSearch("");
    } else if (debouncedQuery.length >= 2) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  return (
    <form
      className="w-full max-w-md mx-auto flex items-center gap-2 bg-chart-2 rounded-lg shadow px-3 py-2 mt-10 mb-10 sm:max-w-lg md:max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(query);
      }}
      role="search"
    >
      <Input
        type="text"
        placeholder="Rechercher un livre, un auteur..."
        value={query}
        onChange={handleChange}
        aria-label="Rechercher un livre ou un auteur"
        className="flex-1 border-none bg-white focus:ring-0 focus-visible:ring-2 focus-visible:ring-offset-2"
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        aria-label="Lancer la recherche"
        className="focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <Search className="h-5 w-5 text-primary" aria-hidden="true" />
      </Button>
    </form>
  );
}
