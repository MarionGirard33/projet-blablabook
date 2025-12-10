import { getSearchBooks } from "@/api/books";
import BookCarousel from "@/components/CarouselDisplay";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [search, setSearch] = useState("");

  const [randomResults, setRandomResults] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [categoryResults, setCategoryResults] = useState([]);
  const [bestsellersResults, setBestsellersResults] = useState([]);

  useEffect(() => {
    if (search.length >= 3) {
      getSearchBooks({ type: "search", searchText: search }).then((response) =>
        setSearchResults(response.data)
      );
    } else {
      setSearchResults([]);
    }
  }, [search]);

  useEffect(() => {
    if (!search) {
      getSearchBooks({ type: "random" }).then((response) =>
        setRandomResults(response.data)
      );
      getSearchBooks({ type: "category", categoryName: "horror" }).then(
        (response) => setCategoryResults(response.data)
      );
      getSearchBooks({ type: "category", categoryName: "bestsellers" }).then(
        (response) => setBestsellersResults(response.data)
      );
    }
  }, [search]);

  return (
    <div className="flex-col w-full">
      <Hero />
      <SearchBar onSearch={setSearch} />
      {search.length >= 3 && searchResults.length > 0 ? (
        <BookCarousel
          title={`Résultats pour "${search}"`}
          books={searchResults}
        />
      ) : (
        <>
          <BookCarousel title={"Sélection Aléatoire"} books={randomResults} />
          <BookCarousel title={"À la une"} books={bestsellersResults} />
          <BookCarousel title={"Horreur"} books={categoryResults} />
        </>
      )}
    </div>
  );
}
