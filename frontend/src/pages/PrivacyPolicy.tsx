import LegalPageLayout from "@/components/LegalPageLayout";

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout
      title="Politique de confidentialité"
      subtitle="Comment nous collectons, utilisons et protégeons vos données personnelles."
    >
      <section className="space-y-2">
        <p className="text-base leading-6 text-gray-700">
          Cette politique de confidentialité explique comment Blablabook collecte,
          utilise et protège vos données lorsque vous utilisez le site.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">1. Données collectées</h2>
        <ul className="space-y-1.5 pl-5">
          <li>
            <strong>Compte :</strong> email, nom d'utilisateur, mot de passe haché.
          </li>
          <li>
            <strong>Profil :</strong> avatar et informations ajoutées au profil.
          </li>
          <li>
            <strong>Usage :</strong> journaux techniques et données anonymisées
            pour améliorer le service.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">2. Finalités</h2>
        <p>Nous utilisons ces données pour :</p>
        <ul className="space-y-1.5 pl-5">
          <li>fournir et maintenir le service ;</li>
          <li>gérer les comptes et l'authentification ;</li>
          <li>personnaliser l'expérience ;</li>
          <li>améliorer les fonctionnalités ;</li>
          <li>envoyer les informations utiles au service.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">3. Base légale</h2>
        <p>
          Selon les cas, nous nous appuyons sur votre consentement, l'exécution
          du contrat, notre intérêt légitime ou une obligation légale.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">4. Cookies</h2>
        <p>
          Nous utilisons des cookies essentiels et, si besoin, des cookies de
          mesure d'audience. Vous pouvez accepter ou refuser les cookies non
          essentiels via le bandeau.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">5. Conservation</h2>
        <p>
          Les données sont conservées le temps nécessaire au service ou selon la
          loi. Vous pouvez demander leur export ou leur suppression depuis votre
          profil.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">6. Vos droits</h2>
        <p>
          Vous pouvez accéder à vos données, les corriger, les exporter ou en
          demander la suppression. Pour exercer vos droits, contactez l'éditeur.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">7. Partage</h2>
        <p>
          Nous ne vendons pas vos données. Elles peuvent être traitées par nos
          prestataires techniques dans le cadre du service.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">8. Sécurité</h2>
        <p>
          Nous mettons en place des mesures raisonnables pour protéger les données,
          sans garantie absolue de sécurité.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">9. Mineurs</h2>
        <p>
          Le service ne vise pas les mineurs de moins de 13 ans (ou l'âge légal
          local). Si nous recevons des données d'un mineur, elles sont supprimées.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">10. Mise à jour</h2>
        <p>
          Cette politique peut évoluer. La version en ligne fait foi.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">11. Contact</h2>
        <p>
          Pour toute question, contactez l'éditeur du site.
        </p>
      </section>
    </LegalPageLayout>
  );
}
