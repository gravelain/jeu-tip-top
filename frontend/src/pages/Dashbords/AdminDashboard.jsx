import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import PrizeDistributionChart from "../../components/PrizeDistributionChart";
import TicketUsageChart from "../../components/TicketUsageChart";
import UserActivityChart from "../../components/UserActivityChart";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiShoppingBag,
  FiBarChart2,
  FiActivity,
  FiUserCheck,
  FiUserX,
  FiPackage,
  FiDollarSign,
  FiPieChart,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiGift,
  FiLock,
  FiUnlock,
} from "react-icons/fi";


const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api"; // Correction ici

const AdminDashboard = () => {
  // State variables for data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [gameStats, setGameStats] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const navigate = useNavigate();

  // State for user details modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch data from backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        // Vérification des permissions admin avant récupération des données
        const userProfileResponse = await axios.get(`${API_URL}/user/userprofile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userProfile = userProfileResponse.data.user;
        if (userProfile.userType !== "admin") {
          setError("Access forbidden: insufficient permissions. Admin access required.");
          setLoading(false);
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Chargement des données uniquement si l'utilisateur est un admin
        const [usersRes, clientsRes, employeesRes, gameStatsRes] = await Promise.all([
          axios.get(`${API_URL}/user/allusers`, { headers }),
          axios.get(`${API_URL}/user/allclients`, { headers }),
          axios.get(`${API_URL}/user/allemployers`, { headers }),
          axios.get(`${API_URL}/user/usersgains`, { headers }),
        ]);

        setUsers(usersRes.data.users || []);
        setClients(clientsRes.data.clients || []);
        setEmployees(employeesRes.data.employers || []);
        setGameStats(gameStatsRes.data || {});
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        if (err.response?.status === 403) {
          setError("Access forbidden: insufficient permissions. Admin access required.");
        } else {
          setError(err.response?.data?.message || "Failed to fetch dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Formatage des dates pour l'affichage
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Déconnexion utilisateur
  const handleLogoutUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/user/logoutuser/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // alert("L'utilisateur a été déconnecté avec succès");

      // Rafraîchir la liste des utilisateurs
      const updatedUsers = users.map((user) => {
        if (user._id === userId) {
          return { ...user, isActive: false };
        }
        return user;
      });
      setUsers(updatedUsers);
    } catch (err) {
      alert("Erreur lors de la déconnexion de l'utilisateur: " + (err.response?.data?.message || err.message));
    }
  };

  // Gestion de l'accès au jeu pour les utilisateurs
  const toggleGameAccess = async (userId, currentAccess) => {
    try {
      const token = localStorage.getItem("token");
      const newAccess = !currentAccess;

      await axios.put(`${API_URL}/user/updateuser/${userId}`, { gameAccess: newAccess }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Mise à jour de l'état local des utilisateurs
      const updatedUsers = users.map((user) => {
        if (user._id === userId) {
          return { ...user, gameAccess: newAccess };
        }
        return user;
      });

      setUsers(updatedUsers);

      // Si la fenêtre modale est ouverte, mise à jour de l'utilisateur sélectionné
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, gameAccess: newAccess });
      }

      alert(`L'accès au jeu a été ${newAccess ? "activé" : "désactivé"} pour cet utilisateur`);
    } catch (err) {
      alert("Erreur lors de la modification d'accès au jeu: " + (err.response?.data?.message || err.message));
    }
  };

  // Show user details modal
  const showUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // User details modal component
  const UserDetailsModal = () => {
    if (!selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Détails de l'utilisateur
            </h2>
            <button
              onClick={() => setShowUserModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="flex items-center mb-8">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-3xl">
              {selectedUser.userName?.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="ml-6">
              <h3 className="text-xl font-semibold">{selectedUser.userName}</h3>
              <p className="text-gray-600">{selectedUser.email}</p>
              <div className="mt-1">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${
                    selectedUser.userType === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : selectedUser.userType === "client"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {selectedUser.userType === "admin"
                    ? "Administrateur"
                    : selectedUser.userType === "client"
                      ? "Client"
                      : "Employé"}
                </span>
                <span
                  className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${
                    selectedUser.gameAccess === false
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {selectedUser.gameAccess === false
                    ? "Accès au jeu bloqué"
                    : "Accès au jeu autorisé"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Coordonnées
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-2">
                  <span className="font-medium">Téléphone:</span>{" "}
                  {selectedUser.phone}
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Adresse:</span>{" "}
                  {selectedUser.address?.join(", ") || "Non spécifiée"}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Informations du compte
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-2">
                  <span className="font-medium">Inscrit le:</span>{" "}
                  {formatDate(selectedUser.createdAt)}
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Mis à jour le:</span>{" "}
                  {formatDate(selectedUser.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between border-t pt-6">
            <button
              onClick={() =>
                toggleGameAccess(selectedUser._id, selectedUser.gameAccess)
              }
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                selectedUser.gameAccess
                  ? "bg-red-100 text-red-800 hover:bg-red-200"
                  : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
            >
              {selectedUser.gameAccess ? (
                <>
                  <FiLock className="mr-2" />
                  Bloquer l'accès au jeu
                </>
              ) : (
                <>
                  <FiUnlock className="mr-2" />
                  Autoriser l'accès au jeu
                </>
              )}
            </button>
            <div>
              <button
                onClick={() => handleLogoutUser(selectedUser._id)}
                className="bg-red-100 text-red-800 hover:bg-red-200 px-4 py-2 rounded-md text-sm font-medium ml-2"
              >
                Déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Users Tab
  const renderUsersTab = () => {
    let filteredUsers = users;

    if (selectedFilter === "client") {
      filteredUsers = users.filter((user) => user.userType === "client");
    } else if (selectedFilter === "employee") {
      filteredUsers = users.filter((user) => user.userType === "employer");
    } else if (selectedFilter === "admin") {
      filteredUsers = users.filter((user) => user.userType === "admin");
    }

    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Gestion des Utilisateurs
          </h3>
          <div className="flex">
            <select
              className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">Tous les Utilisateurs</option>
              <option value="client">Clients Seulement</option>
              <option value="employee">Employés Seulement</option>
              <option value="admin">Admins Seulement</option>
            </select>
          </div>
        </div>
        <div className="px-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type d'Utilisateur
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accès au jeu
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inscrit le
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.slice(0, 10).map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                        {user.userName?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.userName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        user.userType === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.userType === "client"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.userType === "admin"
                        ? "Administrateur"
                        : user.userType === "client"
                          ? "Client"
                          : "Employé"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        user.gameAccess === false
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.gameAccess === false ? "Bloqué" : "Autorisé"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiClock className="mr-2 text-gray-400" />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => showUserDetails(user)}
                    >
                      Voir
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleLogoutUser(user._id)}
                    >
                      Déconnecter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Affichage de <span className="font-medium">1</span> à{" "}
            <span className="font-medium">
              {Math.min(filteredUsers.length, 10)}
            </span>{" "}
            sur <span className="font-medium">{filteredUsers.length}</span>{" "}
            résultats
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 bg-white text-gray-500 text-sm rounded-md disabled:opacity-50">
              Précédent
            </button>
            <button className="px-3 py-1 border border-gray-300 bg-white text-gray-500 text-sm rounded-md hover:bg-gray-50 disabled:opacity-50">
              Suivant
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render Dashboard Overview
  const renderOverview = () => {
    // Format data for charts
    const userActivityData = [
      { name: "Jan", value: 28 },
      { name: "Fév", value: 45 },
      { name: "Mar", value: 32 },
      { name: "Avr", value: 56 },
      { name: "Mai", value: 78 },
      { name: "Juin", value: 63 },
    ];

    // Only use real ticket data if available
    const ticketUsageData =
      gameStats && gameStats.ticketStats && gameStats.ticketStats.used > 0
        ? [
            { name: "Utilisés", value: gameStats.ticketStats.used || 0 },
            {
              name: "Non utilisés",
              value: gameStats.ticketStats.remaining || 0,
            },
          ]
        : null;

    // Only use real prize data if available
    const prizeDistributionData =
      gameStats &&
      gameStats.prizeDistribution &&
      gameStats.prizeDistribution.length > 0
        ? gameStats.prizeDistribution
        : null;

    // Calculate some statistics
    let totalUsers = users.length || 0;
    let clientCount = clients.length || 0;
    let employeeCount = employees.length || 0;
    let adminCount = users.filter((u) => u.userType === "admin").length || 0;

    // Calculate recent gains if data available
    let recentGains = [];
    if (gameStats && gameStats.gains) {
      recentGains = gameStats.gains.slice(0, 5);
    }

    // Calculate ticket stats
    const ticketStats =
      gameStats &&
      gameStats.ticketStats &&
      (gameStats.ticketStats.used > 0 || gameStats.ticketStats.remaining > 0)
        ? gameStats.ticketStats
        : null;
    const totalTickets = ticketStats
      ? ticketStats.used + ticketStats.remaining
      : 0;
    const usageRate =
      totalTickets > 0
        ? Math.round((ticketStats.used / totalTickets) * 100)
        : 0;

    // Check if we have valid ticket data to display
    const hasValidTicketStats = ticketStats && totalTickets > 0;
    const hasValidPrizeData =
      prizeDistributionData && prizeDistributionData.length > 0;

    return (
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Total Utilisateurs
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {totalUsers}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FiUsers className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Active Clients */}
          <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Clients Actifs
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {clientCount}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FiUserCheck className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Total Prize Value or Employee Count */}
          {gameStats && gameStats.totalPrizeValue ? (
            <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Valeur Totale des Prix
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {gameStats.totalPrizeValue} €
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <FiPackage className="h-6 w-6" />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Employés</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {employeeCount}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FiUserCheck className="h-6 w-6" />
                </div>
              </div>
            </div>
          )}

          {/* Ticket Usage Rate or Admin Count */}
          {hasValidTicketStats ? (
            <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Taux d'Utilisation des Tickets
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {usageRate}%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                  <FiPieChart className="h-6 w-6" />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Administrateurs
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {adminCount}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <FiUserCheck className="h-6 w-6" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Charts Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className={`bg-white rounded-xl shadow-md border border-gray-100 col-span-1 ${hasValidTicketStats && ticketUsageData ? "lg:col-span-2" : "lg:col-span-3"}`}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Tendance d'Activité des Utilisateurs
              </h3>
            </div>
            <div className="p-4 h-72">
              <UserActivityChart data={userActivityData} />
            </div>
          </div>

          {/* Only show ticket usage chart if we have valid data */}
          {hasValidTicketStats && ticketUsageData && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Utilisation des Tickets
                </h3>
              </div>
              <div className="p-4 h-72">
                <TicketUsageChart data={ticketUsageData} />
              </div>
            </div>
          )}
        </div>

        {/* User Composition and Prize Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            className={`bg-white rounded-xl shadow-md border border-gray-100 ${!hasValidPrizeData ? "lg:col-span-2" : ""}`}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Composition des Utilisateurs
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Admin users */}
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Admin
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {users.filter((u) => u.userType === "admin").length} (
                        {Math.round(
                          (users.filter((u) => u.userType === "admin").length /
                            users.length) *
                            100
                        )}
                        %)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{
                          width: `${users.length ? (users.filter((u) => u.userType === "admin").length / users.length) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Client users */}
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Clients
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {users.filter((u) => u.userType === "client").length} (
                        {Math.round(
                          (users.filter((u) => u.userType === "client").length /
                            users.length) *
                            100
                        )}
                        %)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{
                          width: `${users.length ? (users.filter((u) => u.userType === "client").length / users.length) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Employee users */}
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Employés
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {users.filter((u) => u.userType === "employer").length}{" "}
                        (
                        {Math.round(
                          (users.filter((u) => u.userType === "employer")
                            .length /
                            users.length) *
                            100
                        )}
                        %)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${users.length ? (users.filter((u) => u.userType === "employer").length / users.length) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prize Distribution Chart - Only show if valid data */}
          {hasValidPrizeData && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Distribution des Prix
                </h3>
              </div>
              <div className="p-4 h-72">
                <PrizeDistributionChart data={prizeDistributionData} />
              </div>
            </div>
          )}
        </div>

        {/* Ticket Stats and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Only show ticket stats if we have valid data */}
          {hasValidTicketStats && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Statistiques des Tickets
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-800 font-medium">
                          Tickets Générés
                        </p>
                        <p className="text-xl font-bold text-blue-900 mt-1">
                          {totalTickets}
                        </p>
                      </div>
                      <div className="p-2 rounded-full bg-blue-100">
                        <FiPackage className="h-5 w-5 text-blue-700" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-800 font-medium">
                          Tickets Utilisés
                        </p>
                        <p className="text-xl font-bold text-green-900 mt-1">
                          {ticketStats.used}
                        </p>
                      </div>
                      <div className="p-2 rounded-full bg-green-100">
                        <FiCheckCircle className="h-5 w-5 text-green-700" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-amber-800 font-medium">
                          Tickets Restants
                        </p>
                        <p className="text-xl font-bold text-amber-900 mt-1">
                          {ticketStats.remaining}
                        </p>
                      </div>
                      <div className="p-2 rounded-full bg-amber-100">
                        <FiXCircle className="h-5 w-5 text-amber-700" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-800 font-medium">
                          Taux de Conversion
                        </p>
                        <p className="text-xl font-bold text-purple-900 mt-1">
                          {usageRate}%
                        </p>
                      </div>
                      <div className="p-2 rounded-full bg-purple-100">
                        <FiTrendingUp className="h-5 w-5 text-purple-700" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity Section (always show) */}
          <div
            className={`bg-white rounded-xl shadow-md border border-gray-100 ${!hasValidTicketStats ? "lg:col-span-2" : ""}`}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Activité Récente
              </h3>
            </div>
            <div className="p-4">
              {recentGains.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {recentGains.map((gain, index) => (
                    <div
                      key={index}
                      className="py-3 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                          <FiGift className="h-5 w-5" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {gain.user?.userName || "Utilisateur"}
                          </p>
                          <p className="text-xs text-gray-500">
                            a gagné {gain.prizeWon || "un prix"}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiCalendar className="mr-1 h-4 w-4" />
                          {formatDate(gain.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-gray-500">
                  Aucune activité récente à afficher
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Prizes Tab
  const renderPrizesTab = () => {
    // Get prize and ticket data from gameStats if available
    const prizeDistributionData =
      gameStats &&
      gameStats.prizeDistribution &&
      gameStats.prizeDistribution.length > 0
        ? gameStats.prizeDistribution
        : null;

    const ticketStats =
      gameStats &&
      gameStats.ticketStats &&
      (gameStats.ticketStats.used > 0 || gameStats.ticketStats.remaining > 0)
        ? gameStats.ticketStats
        : null;
    const totalTickets = ticketStats
      ? ticketStats.used + ticketStats.remaining
      : 0;
    const usageRate =
      totalTickets > 0
        ? Math.round((ticketStats.used / totalTickets) * 100)
        : 0;

    // Check for valid data for this tab
    const hasValidDataForTab = prizeDistributionData || ticketStats;

    // If no data is available, show a message
    if (!hasValidDataForTab) {
      return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="py-12 text-center">
            <FiPackage className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune donnée disponible
            </h3>
            <p className="text-gray-500">
              Les informations sur les prix et tickets ne sont pas encore
              disponibles.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Distribution des Prix et Statistiques des Tickets
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Prize Distribution Section - Only show if valid data */}
          {prizeDistributionData && (
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">
                Distribution des Prix
              </h4>
              <div className="h-64">
                <PrizeDistributionChart data={prizeDistributionData} />
              </div>

              {gameStats && gameStats.totalPrizeCount && (
                <div className="mt-6 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Nombre total de prix
                        </p>
                        <p className="text-xl font-bold text-gray-800">
                          {gameStats.totalPrizeCount}
                        </p>
                      </div>
                      <div className="p-2 rounded-full bg-blue-100 text-blue-800">
                        <FiPackage className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  {gameStats.totalPrizeValue && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Valeur totale
                          </p>
                          <p className="text-xl font-bold text-gray-800">
                            {gameStats.totalPrizeValue} €
                          </p>
                        </div>
                        <div className="p-2 rounded-full bg-purple-100 text-purple-800">
                          <FiDollarSign className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Ticket Usage Section - Only show if valid data */}
          {ticketStats && (
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">
                Utilisation des Tickets
              </h4>
              <div className="h-64">
                <TicketUsageChart
                  data={[
                    { name: "Utilisés", value: ticketStats.used },
                    { name: "Non utilisés", value: ticketStats.remaining },
                  ]}
                />
              </div>

              <div className="mt-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Tickets utilisés
                      </p>
                      <p className="text-xl font-bold text-gray-800">
                        {ticketStats.used}
                      </p>
                    </div>
                    <div className="p-2 rounded-full bg-green-100 text-green-800">
                      <FiCheckCircle className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Tickets restants
                      </p>
                      <p className="text-xl font-bold text-gray-800">
                        {ticketStats.remaining}
                      </p>
                    </div>
                    <div className="p-2 rounded-full bg-amber-100 text-amber-800">
                      <FiXCircle className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {gameStats && gameStats.gains && gameStats.gains.length > 0 && (
          <div className="mt-8">
            <h4 className="text-md font-medium text-gray-700 mb-4">
              Liste des Prix Distribués ({gameStats.gains.length})
            </h4>
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout userType="admin">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <p>{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Tableau de Bord Administrateur
            </h1>
            <div className="bg-blue-50 px-4 py-2 rounded-lg text-blue-800 text-sm font-medium flex items-center">
              <FiClock className="mr-2" />
              Dernière mise à jour: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Dashboard Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Vue d'ensemble
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`ml-8 px-4 py-2 font-medium text-sm ${
                  activeTab === "users"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Utilisateurs
              </button>
              <button
                onClick={() => setActiveTab("prizes")}
                className={`ml-8 px-4 py-2 font-medium text-sm ${
                  activeTab === "prizes"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Prix & Tickets
              </button>
            </nav>
          </div>

          {/* Main Content based on active tab */}
          <div>
            {activeTab === "overview" && renderOverview()}
            {activeTab === "users" && renderUsersTab()}
            {activeTab === "prizes" && renderPrizesTab()}
          </div>

          {/* User Details Modal */}
          {showUserModal && <UserDetailsModal />}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
