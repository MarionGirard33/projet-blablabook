import LegalPageLayout from "@/components/LegalPageLayout";

export default function MentionsLegales() {
  return (
    <LegalPageLayout
      title="Mentions légales"
      subtitle="Informations légales sur l'éditeur, l'hébergement et l'utilisation du site."
    >
      <section className="space-y-2">
        <p className="text-base leading-6 text-gray-700">
          Ces mentions légales indiquent l'éditeur du site, l'hébergeur et les
          règles d'utilisation.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">1. Éditeur du site</h2>
        <p>
          Blablabook édite ce site.
          <br />
          Contact :{" "}
          <a
            href="mailto:contact@blablabook.com"
            className="font-medium text-bookterracotta underline decoration-bookterracotta/40 underline-offset-4"
          >
            contact@blablabook.com
          </a>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">2. Hébergement</h2>
        <p>
          Le site est hébergé sur une infrastructure technique choisie par
          l'éditeur. Les informations de l'hébergeur peuvent être fournies sur
          demande.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">3. Propriété intellectuelle</h2>
        <p>
          Les contenus du site (textes, visuels, logo, code et charte graphique)
          sont protégés par le droit de la propriété intellectuelle.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">4. Responsabilité</h2>
        <p>
          L'éditeur veille à l'exactitude des informations, sans garantie
          d'absence d'erreurs ou d'interruptions. L'utilisateur reste
          responsable de son usage du site.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">5. Données personnelles</h2>
        <p>
          <span>Le traitement des données personnelles est décrit dans la</span>
          <a
            href="/privacy"
            className="ml-1 font-medium text-bookterracotta underline decoration-bookterracotta/40 underline-offset-4"
          >
            politique de confidentialité
          </a>
          <span>.</span>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">6. Conditions d'utilisation</h2>
        <p>
          <span>L'utilisation du site est soumise aux</span>
          <a
            href="/cgu"
            className="ml-1 font-medium text-bookterracotta underline decoration-bookterracotta/40 underline-offset-4"
          >
            CGU
          </a>
          <span>.</span>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">7. Contact</h2>
        <p>
          Pour toute question, contactez l'éditeur à l'adresse e-mail ci-dessus.
        </p>
      </section>
    </LegalPageLayout>
  );
}
