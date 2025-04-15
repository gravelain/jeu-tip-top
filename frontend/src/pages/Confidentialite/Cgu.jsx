import React from 'react';
import StaticPageLayout from '../../components/StaticPageLayout'; // Adjust path if needed
// Removed: import '../Confidentialite/Cgu.css';

const CGU = () => {
  return (
    <StaticPageLayout title="Conditions Générales d'Utilisation">
      <p>
        <strong>Objet :</strong> Les présentes conditions générales d&apos;utilisation (CGU) ont pour objet de définir les modalités et conditions dans lesquelles les utilisateurs peuvent accéder et utiliser le site Thé Tip Top.
      </p>
      <p>
        <strong>Accès au site :</strong> L&apos;accès au site est réservé aux personnes majeures résidant en France métropolitaine. L&apos;utilisation du site implique l&apos;acceptation des présentes CGU.
      </p>
      <p>
        <strong>Responsabilité :</strong> Thé Tip Top ne saurait être tenu responsable des dommages directs ou indirects résultant de l&apos;utilisation du site. Les utilisateurs sont responsables de la protection de leurs équipements informatiques contre tout virus ou autre menace.
      </p>
      <p>
        <strong>Modification des CGU :</strong> Thé Tip Top se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs sont invités à consulter régulièrement cette page pour prendre connaissance des éventuelles modifications.
      </p>
    </StaticPageLayout>
  );
};

export default CGU;
