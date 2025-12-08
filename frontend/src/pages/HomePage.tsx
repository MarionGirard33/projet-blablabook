import BookCarousel from "@/components/CarouselDisplay";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import booksData from "@/books.json";
import { useState } from "react";

export default function HomePage() {
  const [search, setSearch] = useState("");

  const randomBooks = booksData.random;
  const horrorBooks = booksData.horror;
  const featuredBooks = booksData.featured;

  return (
    <div className="flex-col w-full">
      <Hero />
      <SearchBar onSearch={setSearch} />
      <BookCarousel title={"A la une"} books={featuredBooks} />
      <BookCarousel title={"Selection Aléatoire"} books={randomBooks} />
      <BookCarousel title={"Horreur"} books={horrorBooks} />
    </div>
  );
}
