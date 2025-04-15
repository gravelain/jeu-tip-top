import React from 'react';
// Removed: import '../Reglement/Regle.css';

const Regle = () => {
  const ruleSections = [
    {
      title: "1. Conditions de participation",
      items: [
        "Le jeu est ouvert à toute personne majeure résidant en France métropolitaine.",
        "Pour participer, il faut effectuer un achat minimum de 49€ dans une boutique Thé Tip Top.",
        "Un ticket de caisse ou une facture donnant droit à un code unique (10 caractères : chiffres + lettres) est remis à chaque achat éligible.",
        "Chaque participant peut jouer autant de fois qu'il possède de codes uniques."
      ]
    },
    {
      title: "2. Modalités de participation",
      items: [
        "Le jeu est accessible en ligne sur le site dédié.",
        "Le participant doit s'inscrire avec son adresse e-mail ou via un compte Google ou Facebook.",
        "Il entre son code unique pour découvrir immédiatement son lot.",
        "100% des participants gagnent un lot selon la répartition ci-dessous."
      ]
    },
    {
      title: "3. Répartitions des gains",
      items: [
        "60% des tickets : 1 infuseur à thé.",
        "20% des tickets : 1 boîte de 100g de thé détox ou infusion.",
        "10% des tickets : 1 boîte de 100g de thé signature.",
        "6% des tickets : 1 coffret découverte (valeur 39€).",
        "4% des tickets : 1 coffret découverte (valeur 69€)."
      ]
    },
    {
      title: "4. Période et validité du jeu",
      items: [
        "Le jeu-concours se déroule sur une période de 30 jours.",
        "Un maximum de 500 000 tickets seront distribués.",
        "Les participants ont 30 jours supplémentaires après la fin du jeu pour valider leur code et réclamer leur lot."
      ]
    },
    {
      title: "5. Récupération des lots",
      items: [
        "Les gains peuvent être retirés en boutique en présentant le ticket gagnant.",
        "Une option de livraison en ligne est disponible via un bon de réduction envoyé après validation du code.",
        "Les lots non réclamés dans les 30 jours suivant la fin du jeu seront considérés comme perdus."
      ]
    }
  ];

  return (
    <main className="bg-gray-50 py-12 px-4 min-h-screen">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-teal-700 mb-10">
          Règles du Jeu Concours Thé Tip Top
        </h1>

        <div className="space-y-8">
          {ruleSections.map((section, index) => (
            <section key={index} className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                {section.title}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Regle;
