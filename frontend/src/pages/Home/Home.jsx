import { Link } from 'react-router-dom';
import React from 'react';
import { Sparkles } from 'lucide-react';

const Home = () => {
  const prizes = [
    { src: '/images/lo8.jpg', text: 'Un infuseur artisanal en inox pour le thé' },
    { src: '/images/lo1.jpg', text: '100g de thé bien-être bio aux plantes' },
    { src: '/images/lo3.jpg', text: 'Un mélange de thé signature fruité' },
    { src: '/images/lo4.jpg', text: 'Coffret découverte d’une valeur de 39€' },
    { src: '/images/lo7.jpg', text: 'Coffret prestige édition limitée (69€)' }
  ];

  return (
    <main className="bg-gradient-to-bl from-rose-50 via-white to-indigo-50 min-h-screen">
      {/* Hero card */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white shadow-2xl rounded-3xl p-10 relative overflow-hidden border border-indigo-100">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-rose-200 opacity-30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-indigo-200 opacity-20 rounded-full blur-3xl" />

          <h1 className="text-4xl md:text-5xl font-bold text-indigo-700 text-center z-10 relative">
            Jeu concours de thé 100% gagnant – Thé Tip Top 🍵
          </h1>
          <p className="text-gray-600 text-lg md:text-xl text-center max-w-xl mx-auto mt-6 z-10 relative">
            Participez gratuitement à notre jeu concours exclusif et tentez de gagner des cadeaux autour du thé haut de gamme.
          </p>
          <div className="text-center mt-10 z-10 relative">
            <Link to="/game" aria-label="Commencer le jeu concours de thé">
              <button className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105">
                <Sparkles className="w-5 h-5" />
                Jouer maintenant
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Immersive intro */}
      <section className="py-20 px-6 flex flex-col lg:flex-row items-center justify-between gap-16 max-w-6xl mx-auto">
        <div className="lg:w-1/2 order-2 lg:order-1">
          <img
            src="/images/welcome.png"
            alt="Visuel d'accueil du jeu concours Thé Tip Top"
            className="w-full rounded-[2.5rem] shadow-2xl"
          />
        </div>
        <div className="lg:w-1/2 space-y-6 order-1 lg:order-2">
          <h2 className="text-3xl md:text-4xl font-semibold text-indigo-800">
            Un jeu ludique autour du thé haut de gamme
          </h2>
          <p className="text-gray-700 text-lg">
            Thé Tip Top vous propose un jeu-concours immersif où chaque participant repart avec un lot. Profitez d’une expérience sensorielle à travers nos sélections de thés premium, infusions bien-être et coffrets exclusifs.
          </p>
          <p className="text-gray-700 text-lg">
            Laissez-vous tenter, même sans être connaisseur. Ce jeu est ouvert à tous, rapide, et sans obligation d’achat. Lancez-vous dès aujourd’hui !
          </p>
        </div>
      </section>

      {/* Section lots façon cartes */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-indigo-800 mb-16">
            Cadeaux à gagner dans notre jeu concours
          </h2>
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3">
            {prizes.map((item, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-tr from-white via-indigo-50 to-rose-50 rounded-[2rem] p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col items-center"
              >
                <img
                  src={item.src}
                  alt={`Illustration du lot : ${item.text}`}
                  className="h-44 object-contain mb-6 rounded-xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="text-indigo-800 font-medium text-lg z-10 relative">
                  {item.text}
                </div>
                <div className="absolute top-0 left-0 w-full h-full rounded-[2rem] border border-indigo-100 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
