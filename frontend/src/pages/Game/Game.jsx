import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Game.module.css";

const prizes = [
  { name: "Infuseur artisanal", value: 5, emoji: "💧" },
  { name: "Thé Détox bio", value: 10, emoji: "🌿" },
  { name: "Thé Signature 100g", value: 15, emoji: "⭐" },
  { name: "Coffret découverte (39€)", value: 39, emoji: "🎁" },
  { name: "Coffret prestige (69€)", value: 69, emoji: "💎" }
];

const Confetti = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-50" aria-hidden="true">
    {[...Array(80)].map((_, i) => (
      <div key={i} className={styles.confettiParticle} style={{
        left: `${Math.random() * 100}%`,
        backgroundColor: `hsl(${Math.random() * 360}, 90%, 65%)`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        animationDelay: `${Math.random() * 1.5}s`,
      }}></div>
    ))}
  </div>
);

const LoadingSpinner = () => (
  <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white ml-2" aria-hidden="true"></span>
);

const Game = () => {
  const [ticketNumber, setTicketNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prizeResult, setPrizeResult] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    setShowCelebration(false);
    setPrizeResult(null);
  }, [ticketNumber]);

  const handlePlayGame = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setError(null);
    setPrizeResult(null);
    setShowCelebration(false);

    if (!ticketNumber.trim()) {
      setError("Veuillez entrer un numéro de ticket.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vous devez être connecté pour participer.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/game/play`,
        { ticketNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const match = response.data.message.match(/won (.*) worth (\d+) euros/);
        if (match && match.length >= 3) {
          const prizeName = match[1];
          const prizeValue = parseInt(match[2], 10);
          setPrizeResult({ prizeWon: prizeName, prizeValue });
        } else {
          setPrizeResult({ prizeWon: "un lot surprise", prizeValue: "inconnue" });
        }
        setShowCelebration(true);
      } else {
        setError(response.data.message || "Erreur lors de la participation.");
      }
    } catch (err) {
      console.error("Game API error:", err);
      if (err.response?.status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
        localStorage.removeItem("token");
      } else {
        setError(err.response?.data?.message || "Erreur inattendue.");
      }
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 flex flex-col items-center relative" role="main">
      {showCelebration && <Confetti />}

      <header className="text-center mb-8 md:mb-12 w-full max-w-md">
        <h1 className="text-4xl md:text-5xl font-bold text-teal-700 mb-3">
          🎟️ Jeu concours Thé Tip Top 🎟️
        </h1>
        <p className="text-lg text-gray-600">
          Entrez le code reçu en boutique pour tenter de gagner un lot exclusif.
        </p>
      </header>

      <section className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg border border-gray-200" aria-labelledby="form-title">
        <h2 id="form-title" className="sr-only">Formulaire de participation</h2>
        <form onSubmit={handlePlayGame} className="flex flex-col items-center space-y-5">
          <label htmlFor="ticketNumber" className="text-sm font-medium text-gray-700 w-full text-left">Numéro de ticket</label>
          <input
            id="ticketNumber"
            name="ticketNumber"
            type="text"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value.toUpperCase())}
            required
            aria-required="true"
            aria-disabled={isLoading}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-400 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-center text-lg tracking-widest font-mono disabled:bg-gray-200 disabled:cursor-not-allowed"
            placeholder="EX : TKT-12345"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition duration-150 ease-in-out ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'}`}
            aria-label="Valider le ticket et découvrir le lot"
          >
            {isLoading ? <>Vérification... <LoadingSpinner /></> : 'Valider mon ticket'}
          </button>
          {error && <p className="text-red-600 text-sm font-medium text-center pt-2" role="alert">⚠️ {error}</p>}
        </form>
      </section>

      {prizeResult && !isLoading && (
        <section className="mt-8 p-6 bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 rounded-lg shadow-xl text-center border-4 border-yellow-500 w-full max-w-sm animate-pulse" role="status" aria-live="polite">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-600 to-yellow-600 mb-2">
            🎉 Félicitations ! 🎉
          </h2>
          <p className="text-lg text-gray-900 mb-1">Vous avez gagné :</p>
          <p className="text-2xl font-semibold text-gray-800 mb-2">
            {prizeResult.prizeWon} !
          </p>
          <p className="text-md text-gray-700">(Valeur : {prizeResult.prizeValue}€)</p>
          <p className="text-sm text-gray-600 mt-3">Un e-mail de confirmation vous a été envoyé.</p>
        </section>
      )}

      <section className="mt-10 p-4 bg-white rounded-lg shadow-md border border-gray-200 max-w-md w-full opacity-90" aria-labelledby="lots-title">
        <h2 id="lots-title" className="text-md font-semibold text-gray-700 mb-3 text-center">Lots à Gagner</h2>
        <ul className="space-y-1 text-xs text-gray-600 text-center">
          {prizes.map((prize) => (
            <li key={prize.name + prize.value} className="inline-block mx-2">
              <span className="text-lg">{prize.emoji}</span> <span>= {prize.name} ({prize.value}€)</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Game;
