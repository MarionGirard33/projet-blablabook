import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export default function Hero() {
  return (
    <section className="w-full">
      <div className="w-full px-6 py-10 rounded-2xl shadow-xl bg-white flex flex-col items-center">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-6">
          Découvrez, lisez, partagez vos lectures
        </h1>
        <p className="text-center text-gray-700 mb-8 max-w-2xl text-lg md:text-xl">
          Gérez votre bibliothèque personnelle, découvrez de nouveaux livres et
          partagez vos avis sur une communauté de passionnés.
        </p>
        <Link to="/login">
          <Button size="lg" className="mt-2">
            Commencer dès maintenant
          </Button>
        </Link>
      </div>
    </section>
  );
}
