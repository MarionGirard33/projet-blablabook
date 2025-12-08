import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "@tanstack/react-router";
import BookCard from "./BookCard";
import type { BookCarouselProps } from "@/types";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export default function CarouselDisplay({ title, books }: BookCarouselProps) {
  return (
    <section className="my-8">
      <div className="flex mb-4 items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <Button
          asChild
          variant="link"
          className="text-lg flex items-center gap-2"
        >
          <Link to="/see-all">
            Voir tout
            <ArrowRight />
          </Link>
        </Button>
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-4xl mx-auto"
      >
        <CarouselContent>
          {books.map((book) => (
            <CarouselItem
              key={book.id}
              className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <BookCard book={book} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="sm:flex w-8 h-8" />
        <CarouselNext className="sm:flex w-8 h-8" />
      </Carousel>
    </section>
  );
}
