import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section className="w-full mt-2 px-2">
      <div className="w-full py-8 rounded-xl shadow-xl bg-white flex flex-col items-center">
        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 sm:mb-6">
          Découvrez, lisez, partagez vos lectures
        </h1>
        <p className="text-center text-gray-700 mb-6 sm:mb-8 max-w-xs sm:max-w-md md:max-w-xl lg:text-2xl text-base sm:text-lg md:text-xl">
          Gérez votre bibliothèque personnelle, découvrez de nouveaux livres et
          partagez vos avis sur une communauté de passionnés.
        </p>
        <Link to="/login" className="w-full flex justify-center">
          <Button
            size="lg"
            className="w-[80%] sm:w-auto whitespace-normal text-center mt-2"
          >
            Commencer dès maintenant
          </Button>
        </Link>
      </div>
    </section>
  );
}
