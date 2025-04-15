import React from 'react';
import StaticPageLayout from '../../components/StaticPageLayout'; // Adjust path if needed
// Removed: import '../Confidentialite/Politique.css';

const PolitiqueConfidentialite = () => {
  return (
    <StaticPageLayout title="Politique de Confidentialité">
       {/* Content remains largely the same, wrapped by layout */}
       <p>
        <strong>Introduction :</strong> Thé Tip Top s&apos;engage à protéger la vie privée de ses utilisateurs. Cette politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos informations personnelles.
      </p>
      <p>
        <strong>Collecte des informations :</strong> Nous collectons les informations que vous nous fournissez lors de votre inscription, de votre participation au jeu-concours ou de vos achats (nom, email, adresse, etc.). Nous collectons également des informations automatiquement via les cookies.
      </p>
      <p>
        <strong>Utilisation des informations :</strong> Vos informations sont utilisées pour gérer votre compte, traiter vos commandes, vous informer des résultats du jeu-concours, améliorer nos services et vous envoyer des communications marketing si vous y consentez.
      </p>
      <p>
        <strong>Protection des informations :</strong> Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre l&apos;accès non autorisé, la modification, la divulgation ou la destruction.
      </p>
      <p>
        <strong>Vos droits :</strong> Conformément à la réglementation, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et d&apos;opposition concernant vos données personnelles. Vous pouvez exercer ces droits en nous contactant.
      </p>
    </StaticPageLayout>
  );
};

export default PolitiqueConfidentialite;
