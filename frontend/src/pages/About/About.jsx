import React from 'react';
// Removed: import '../About/About.css';

const About = () => {
  return (
    <main className="bg-gray-50 py-12 px-4 min-h-screen">
      <div className="container mx-auto max-w-4xl bg-white p-8 md:p-10 rounded-lg shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-teal-700 mb-8">
          À Propos de Thé Tip Top
        </h1>
        
        <section className="mb-8 space-y-4 text-gray-700">
          <p><strong className="font-semibold text-gray-800">Notre histoire :</strong> Thé Tip Top est une entreprise passionnée par les thés bio et handmade. Depuis plusieurs années, nous créons des mélanges uniques pour offrir une expérience gustative inoubliable.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-teal-600 mb-3">Notre mission</h2>
          <p className="text-gray-700">Offrir des thés d&apos;exception, tout en respectant l&apos;environnement et les traditions artisanales.</p>
        </section>

        <section className="mb-8">
            <h2 className="text-2xl font-semibold text-teal-600 mb-3">Pourquoi ce jeu-concours ?</h2>
            <p className="text-gray-700">Pour célébrer l&apos;ouverture de notre 10ᵉ boutique à Nice, nous organisons un jeu-concours exclusif permettant de découvrir nos produits.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-teal-600 mb-3">Nos engagements</h2>
          <ul className="list-none space-y-2 pl-0">
            <li className="flex items-start"><span className="text-green-600 mr-2 mt-1">🌿</span> <span className="text-gray-700">Thés 100% bio et éthiques</span></li>
            <li className="flex items-start"><span className="text-orange-600 mr-2 mt-1">🤝</span> <span className="text-gray-700">Fabrication artisanale</span></li>
            <li className="flex items-start"><span className="text-blue-600 mr-2 mt-1">📦</span> <span className="text-gray-700">Expédition rapide et soignée</span></li>
            <li className="flex items-start"><span className="text-pink-600 mr-2 mt-1">💚</span> <span className="text-gray-700">Satisfaction garantie</span></li>
            <li className="flex items-start"><span className="text-yellow-600 mr-2 mt-1">🏆</span> <span className="text-gray-700">Jeu 100% gagnant</span></li>
          </ul>
        </section>

        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-semibold text-teal-600 mb-3">Nous contacter</h2>
          <div className="text-gray-700 space-y-1">
            <p>Email : <a href='mailto:contact.developeur@gmail.com' className="text-teal-600 hover:text-teal-800 hover:underline">contact.developeur@gmail.com</a></p>
            <p>Téléphone : <span className="font-medium">+33 1 23 45 67 89</span></p>
            <p>Adresse : <span className="font-medium">10 Rue de Nice, 06000 Nice</span></p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default About;
