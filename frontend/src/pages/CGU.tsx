import LegalPageLayout from "@/components/LegalPageLayout";

export default function CGU() {
  return (
    <LegalPageLayout
      title="Conditions Générales d'Utilisation (CGU)"
      subtitle="Règles d'utilisation du service Blablabook et responsabilités de chacun."
    >
      <section>
        <p className="text-base leading-6 text-gray-700">
          En accédant à Blablabook, vous acceptez les présentes CGU.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">1. Objet</h2>
        <p>
          Elles définissent les règles d'utilisation du site, des services et des
          contenus proposés.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">2. Accès et compte</h2>
        <p>
          Certaines fonctionnalités nécessitent un compte. Vous êtes responsable
          de vos identifiants et des actions effectuées depuis votre compte.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">3. Contenu utilisateur</h2>
        <p>
          Vous gardez la propriété de vos contenus, mais vous autorisez le site
          à les afficher pour fournir le service. Les contenus illicites sont
          interdits.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">4. Propriété intellectuelle</h2>
        <p>
          Tous les éléments du site sont protégés par le droit d'auteur. Toute
          reproduction non autorisée est interdite.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">5. Responsabilité</h2>
        <p>
          Le site vise à rester disponible, sans garantie d'absence d'erreurs ou
          d'interruptions. La responsabilité est limitée selon la loi.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">6. Données personnelles</h2>
        <p>
          <span>Le traitement des données personnelles est décrit dans la</span>
          <a href="/privacy" className="font-medium text-bookterracotta underline decoration-bookterracotta/40 underline-offset-4">
            politique de confidentialité
          </a>
          <span>.</span>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">7. Modification des CGU</h2>
        <p>
          Ces CGU peuvent être mises à jour. La version en ligne fait foi.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">8. Contact</h2>
        <p>
          Pour toute question, contactez l'éditeur du site.
        </p>
      </section>
    </LegalPageLayout>
  );
}
