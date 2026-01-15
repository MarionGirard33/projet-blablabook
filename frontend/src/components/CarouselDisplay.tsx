import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { ExternalBookCarouselProps } from "../@types/externalBooks";
import { Button } from "./ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BookCardCarousel from "./BookCardCarousel";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

function BookCardSkeleton() {
  return (
    <div className="flex flex-col items-center rounded-xl overflow-hidden shadow w-full h-full p-0 max-h-96 min-h-96">
      <div className="w-full flex flex-col items-center p-4">
        <Skeleton className="h-48 w-32 object-cover mb-2 rounded shadow" />
        <Skeleton className="h-5 w-24 mb-1 rounded" />
        <Skeleton className="h-4 w-20 mb-1 rounded" />
      </div>
      <div className="w-full flex flex-col items-center px-4 pb-4">
        <Skeleton className="h-3 w-16 mb-1 rounded" />
        <Skeleton className="h-3 w-24 mb-1 rounded" />
        <Skeleton className="h-3 w-20 mb-1 rounded" />
      </div>
    </div>
  );
}

export default function CarouselDisplay({
  title,
  books,
}: Readonly<ExternalBookCarouselProps>) {
  const isLoading = books.length === 0;

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
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <CarouselItem
                  key={i}
                  className="basis-full md:basis-1/3 lg:basis-1/4"
                >
                  <BookCardSkeleton />
                </CarouselItem>
              ))
            : books.map((book) => (
                <CarouselItem
                  key={book.key}
                  className="basis-full md:basis-1/3 lg:basis-1/4"
                >
                  <BookCardCarousel book={book} />
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselPrevious className="sm:flex w-8 h-8" />
        <CarouselNext className="sm:flex w-8 h-8" />
      </Carousel>
    </section>
  );
}
