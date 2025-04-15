import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiGift, FiSearch } from "react-icons/fi";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

const Grandgagnant = () => {
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [gains, setGains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [grandWinner, setGrandWinner] = useState(null);
  const [isDrawn, setIsDrawn] = useState(false); // Ajout d'un état pour vérifier si le tirage a été effectué

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token d'authentification non trouvé. Merci de vous reconnecter.");
        setLoading(false);
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [usersRes, gainsRes] = await Promise.all([
          axios.get(`${API_URL}/user/allclients`, { headers }),
          axios.get(`${API_URL}/user/usersgains`, { headers }),
        ]);

        setUsers(usersRes.data.clients || []);
        setGains(gainsRes.data.gains || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des données :", err.response || err);
        setError(err.response?.data?.message || "Impossible de récupérer les données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour sélectionner un grand gagnant aléatoire
  const handleGrandTirage = () => {
    const winners = gains.filter((gain) => gain.prizeValue > 0); // Gagnants avec des lots
    if (winners.length === 0) {
      setError("Aucun gagnant disponible pour le tirage.");
      return;
    }

    // Trouver un gagnant
    const randomIndex = Math.floor(Math.random() * winners.length);
    const selectedWinner = winners[randomIndex];

    // Vérifier si le gagnant a un utilisateur associé
    const winnerUser = users.find((user) => user._id === selectedWinner.userId);

    if (winnerUser) {
      setGrandWinner(winnerUser); // Mettre à jour le grand gagnant
      setIsDrawn(true); // Marquer que le tirage a été effectué
    } else {
      setError("Utilisateur non trouvé pour le gagnant sélectionné.");
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Grand gagnant de l'année 2025 </h1>

      {/* Liste des gagnants (invisible pour le frontend) */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <p>{error}</p>
        </div>
      ) : (
        <div className="hidden"> 
          {gains
            .filter((gain) => gain.prizeValue > 0) // Filtrer les gagnants
            .map((gain, index) => {
              const user = users.find((u) => u._id === gain.userId); // Trouver l'utilisateur correspondant
              return (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <FiGift className="text-green-500 text-xl" />
                    <span className="ml-2 text-gray-700 font-medium">{user?.userName}</span>
                  </div>
                  <span className="text-gray-700">{user?.email}</span>
                  <span className="text-gray-700">{gain.prizeValue} €</span>
                </div>
              );
            })}
        </div>
      )}

      {/* Bouton Tirage Grand Gagnant */}
      <div className="mt-6 text-center">
        <button
          onClick={handleGrandTirage}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
          disabled={isDrawn} // Désactive le bouton si le tirage a déjà été effectué
        >
          Lancer le jeu
        </button>
      </div>

      {/* Affichage du Grand Gagnant avec valeur fixe de 360€ */}
      {grandWinner && (
        <div className="mt-6 text-center bg-green-100 text-green-800 p-4 rounded-lg">
          <h3 className="text-xl font-bold">Félicitations à {grandWinner.userName} {grandWinner.email}!</h3>
          <p>Vous aviez remporté le grand concours gagnant d'une valeur de 360€ pour l'année Thé Tip Top 2025 à NICE</p>
        </div>
      )}
    </div>
  );
};

export default Grandgagnant;
