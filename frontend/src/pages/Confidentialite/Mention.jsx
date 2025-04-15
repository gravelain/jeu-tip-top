import React from 'react';
import StaticPageLayout from '../../components/StaticPageLayout'; // Adjust path if needed
// Removed: import '../Confidentialite/Mention.css';

const MentionsLegales = () => {
  return (
    <StaticPageLayout title="Mentions Légales">
      <p>
        <strong>Éditeur du site :</strong> Thé Tip Top, SARL au capital de 10 000€, immatriculée au RCS de Nice sous le numéro 123 456 789, dont le siège social est situé au 10 Rue de Nice, 06000 Nice.
      </p>
      <p>
        <strong>Directeur de la publication :</strong> Monsieur Jean Dupont.
      </p>
      <p>
        <strong>Hébergeur :</strong> OVHcloud, Société anonyme au capital de 190 540 425€, dont le siège social est situé à Roubaix (59100), 2 rue Kellermann, immatriculée sous le numéro 537 407 926 R.C.S. Lille Métropole.
      </p>
      <p>
        <strong>Propriété intellectuelle :</strong> Tous les contenus présents sur ce site sont la propriété exclusive de Thé Tip Top. Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces différents éléments est strictement interdite sans l&apos;accord écrit de Thé Tip Top.
      </p>
      <p>
        <strong>Contact :</strong> Pour toute question, vous pouvez nous contacter à l&apos;adresse suivante : <a href='mailto:contact.developeur@gmail.com'>contact.developeur@gmail.com</a> ou par téléphone au +33 1 23 45 67 89.
      </p>
    </StaticPageLayout>
  );
};

export default MentionsLegales;
