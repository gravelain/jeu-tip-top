import React from 'react';
import StaticPageLayout from '../../components/StaticPageLayout'; // Adjust path if needed
// Removed: import '../Confidentialite/Cgv.css';

const CGV = () => {
  return (
    <StaticPageLayout title="Conditions Générales de Vente">
      <p>
        <strong>Article 1 : Objet</strong><br />
        Les présentes conditions régissent les ventes par la société Thé Tip Top de ses produits (thés, infusions, accessoires) via son site internet ou en boutique dans le cadre du jeu-concours.
      </p>
      <p>
        <strong>Article 2 : Prix</strong><br />
        Les prix de nos produits sont indiqués en euros toutes taxes comprises (TVA et autres taxes applicables au jour de la commande), sauf indication contraire et hors frais de traitement et d&apos;expédition.
      </p>
      <p>
        <strong>Article 3 : Commandes</strong><br />
        Vous pouvez passer commande sur Internet via le site www.thetiptop.com ou directement en boutique. Les informations contractuelles sont présentées en langue française et feront l&apos;objet d&apos;une confirmation au plus tard au moment de la validation de votre commande.
      </p>
      <p>
        <strong>Article 4 : Validation de votre commande</strong><br />
        Toute commande figurant sur le site Internet suppose l&apos;adhésion aux présentes Conditions Générales. Toute confirmation de commande entraîne votre adhésion pleine et entière aux présentes conditions générales de vente, sans exception ni réserve.
      </p>
      <p>
        <strong>Article 5 : Paiement</strong><br />
        Le fait de valider votre commande implique pour vous l&apos;obligation de payer le prix indiqué. Le règlement de vos achats s&apos;effectue par carte bancaire grâce au système sécurisé Stripe ou par PayPal.
      </p>
       <p>
        <strong>Article 6 : Rétractation</strong><br />
        Conformément aux dispositions de l&apos;article L.121-21 du Code de la Consommation, vous disposez d&apos;un délai de rétractation de 14 jours à compter de la réception de vos produits pour exercer votre droit de rétraction sans avoir à justifier de motifs ni à payer de pénalité.
      </p>
    </StaticPageLayout>
  );
};

export default CGV;
