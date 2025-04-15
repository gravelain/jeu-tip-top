import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserIcon, MailIcon, PhoneIcon, TicketIcon, CalendarIcon, GiftIcon } from '@heroicons/react/outline'; // Assuming heroicons are installed
import DashboardLayout from '../../components/DashboardLayout'; // Adjust path if needed
// Removed: import './client.css';
import './client.css';

// Simple SVG placeholder for Gift Icon if Heroicons not available
const DefaultGiftIcon = () => <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4H5z" /></svg>;

// Define icons - Use Heroicons if available, otherwise use simple SVGs (Removed classes from fallbacks)
const ProfileIcon = UserIcon || (() => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>); 
const EmailIcon = MailIcon || (() => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const TelephoneIcon = PhoneIcon || (() => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>);
const GainTicketIcon = TicketIcon || (() => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>);
const GainCalendarIcon = CalendarIcon || (() => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
const GainPrizeIcon = GiftIcon || DefaultGiftIcon;

const ClientDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({}); // State for form data during edit
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  // State for gains data
  const [gainsData, setGainsData] = useState([]);
  const [isLoadingGains, setIsLoadingGains] = useState(false);
  const [errorGains, setErrorGains] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoadingProfile(true);
      setErrorProfile(null);
      const token = localStorage.getItem('token');

      if (!token) {
        setErrorProfile('Authentication token not found. Please log in.');
        setIsLoadingProfile(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/me`, {  //local
          // axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, payload);

        // const response = await axios.get('https://www.api.dsp5-archi-f24a-15m-g3.fr/api/user/me', { //VPS
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setUserData(response.data.user);
          setFormData(response.data.user); // Initialize form data
        } else {
          throw new Error(response.data.message || 'Failed to fetch user data.');
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
             setErrorProfile('Session expired or invalid. Please log in again.');
             localStorage.removeItem('token'); // Clear invalid token
             // Optionally redirect to login
        } else {
            setErrorProfile(err.message || 'An error occurred while fetching user data.');
        }
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to fetch gains
  const fetchGains = async () => {
    setIsLoadingGains(true);
    setErrorGains(null);
    setGainsData([]); // Clear previous gains
    const token = localStorage.getItem('token');

    if (!token) {
        setErrorGains('Authentication token missing.');
        setIsLoadingGains(false);
        return;
    }

    try {
        // const response = await axios.get('https://www.backend.dsp5-archi-f24a-15m-g8.fr/api/user/my-gains', {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/my-gains`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data.success) {
            setGainsData(response.data.gains); // Assuming backend returns { success: true, gains: [...] }
        } else {
            // Handle cases where success is false but not an error (e.g., no gains found)
             setErrorGains(response.data.message || 'Could not fetch winnings.');
        }
    } catch (err) {
        console.error("Error fetching gains:", err);
         if (err.response?.status === 401 || err.response?.status === 403) {
             setErrorGains('Session expired or invalid. Please log in again.');
             localStorage.removeItem('token'); 
        } else {
            setErrorGains(err.message || 'An error occurred while fetching winnings.');
        }
    } finally {
        setIsLoadingGains(false);
    }
  };

  // Fetch gains when component mounts after profile is loaded
  useEffect(() => {
    if (userData) { // Only fetch gains if user data is available
        fetchGains();
    }
  }, [userData]); // Rerun when userData changes (i.e., after initial load)

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setUpdateSuccess(null); // Clear messages
    setUpdateError(null);
    if (!isEditing && userData) {
        setFormData(userData); // Reset form data on entering edit mode
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setUpdateSuccess(null); // Clear messages
    setUpdateError(null);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoadingProfile(true);
    setUpdateSuccess(null);
    setUpdateError(null);
    const token = localStorage.getItem('token');

    if (!token) {
      setUpdateError('Authentication token missing.');
      setIsLoadingProfile(false);
      return;
    }

    // Send the entire formData, but filter out specific non-editable fields
    const payload = { ...formData };
    delete payload._id; 
    delete payload.email; 
    delete payload.userType; 
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.__v;
    // If password change is handled separately, ensure it's not sent here
    delete payload.password; 
    // Add any other fields that should NEVER be sent from the client

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/user/updateprofile`, payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setUserData(response.data.user); 
        setFormData(response.data.user); 
        setIsEditing(false);
        setUpdateSuccess('Profil mis à jour avec succès!');
      } else {
        throw new Error(response.data.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setUpdateError(err.response?.data?.message || err.message || 'An error occurred while updating profile.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  return (
    <DashboardLayout userType="client">
      {/* Page specific content removed, integrated below */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Bienvenue sur votre Espace Profil
      </h1>

      {isLoadingProfile && !userData && <p className="text-gray-600">Chargement de vos informations...</p>}
      
      {errorProfile && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                <span className="block sm:inline">{errorProfile}</span>
            </div>
      )}

      {userData && !isLoadingProfile && !errorProfile && (
        <div className="grid grid-cols-1 gap-8">
          {/* User Info Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Mes Informations</h3>
                <button 
                    onClick={handleEditToggle}
                    className={`px-4 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm ${isEditing ? 'text-gray-700 bg-gray-200 hover:bg-gray-300' : 'text-white bg-teal-600 hover:bg-teal-700'}`}
                >
                    {isEditing ? 'Annuler' : 'Modifier'}
                </button>
            </div>

            {updateSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative mb-4 text-sm" role="alert">
                    {updateSuccess}
                </div>
            )}
            {updateError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 text-sm" role="alert">
                    {updateError}
                </div>
            )}

            {!isEditing ? (
                // --- Display Mode (Enhanced) ---
                <div className="space-y-4">
                    <div className="flex items-center p-3 border-b border-gray-100">
                        <ProfileIcon className="h-4 w-4 text-gray-500 mr-3" /> 
                        <span className="text-gray-600 font-medium mr-2">Nom d'utilisateur:</span>
                        <span className="text-gray-800">{userData.userName}</span>
                    </div>
                    <div className="flex items-center p-3 border-b border-gray-100">
                        <EmailIcon className="h-4 w-4 text-gray-500 mr-3" /> 
                        <span className="text-gray-600 font-medium mr-2">Email:</span>
                        <span className="text-gray-800">{userData.email}</span>
                    </div>
                    <div className="flex items-center p-3">
                        <TelephoneIcon className="h-4 w-4 text-gray-500 mr-3" /> 
                        <span className="text-gray-600 font-medium mr-2">Téléphone:</span>
                        <span className="text-gray-800">{userData.phone || 'Non renseigné'}</span>
                    </div>
                </div>
            ) : (
                // --- Edit Mode Form ---
                <form className="space-y-4" onSubmit={handleProfileUpdate}>
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                        <input
                            type="text"
                            name="userName"
                            id="userName"
                            required
                            value={formData.userName || ''}
                            onChange={handleFormChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email || ''}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed focus:outline-none sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                        <input
                            type="tel" // Use tel type for phone numbers
                            name="phone"
                            id="phone"
                            value={formData.phone || ''}
                            onChange={handleFormChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            placeholder="e.g., 06 12 34 56 78"
                        />
                    </div>
                    {/* Add other editable fields here */}
                    
                    {/* Consider adding password change separately */} 
                    
                    <div className="flex justify-end gap-4 mt-6">
                      <button
                        type="button"
                        onClick={handleEditToggle}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                        disabled={isLoadingProfile} // Reuse profile loading state for update
                      >
                        {isLoadingProfile ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
                      </button>
                    </div>
                </form>
            )}

            {updateSuccess && (
              <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{updateSuccess}</span>
              </div>
            )}
            {updateError && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{updateError}</span>
              </div>
            )}
          </div>

          {/* Gains Section */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Mes Gains Passés</h3>

              {isLoadingGains && <p className="text-gray-600">Chargement des gains...</p>}

              {errorGains && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                      <span className="block sm:inline">Erreur lors du chargement des gains: {errorGains}</span>
                  </div>
              )}

              {!isLoadingGains && !errorGains && (
                  gainsData.length > 0 ? (
                      <ul className="space-y-4">
                          {gainsData.map((gain) => (
                              <li key={gain._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                  <div className="flex items-center space-x-3">
                                      <GainTicketIcon className="h-6 w-6 text-indigo-500" />
                                      <span className="font-medium text-gray-700">Code Ticket:</span>
                                      <span className="text-gray-900">{gain.ticketNumber}</span>
                                  </div>
                                  <div className="flex items-center space-x-3 mt-2">
                                      <GainPrizeIcon className="h-6 w-6 text-green-500" />
                                      <span className="font-medium text-gray-700">Lot:</span>
                                      <span className="text-gray-900">{gain.prizeWon} ({gain.prizeValue}€)</span>
                                  </div>
                                  <div className="flex items-center space-x-3 mt-2">
                                      <GainCalendarIcon className="h-6 w-6 text-blue-500" />
                                      <span className="font-medium text-gray-700">Date:</span>
                                      <span className="text-gray-600 text-sm">
                                          {new Date(gain.createdAt).toLocaleDateString('fr-FR', {
                                              year: 'numeric', month: 'long', day: 'numeric', 
                                              hour: '2-digit', minute: '2-digit' 
                                          })}
                                      </span>
                                  </div>
                              </li>
                          ))}
                      </ul>
                  ) : (
                      <p className="text-gray-600">Vous n'avez pas encore enregistré de gains.</p>
                  )
              )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ClientDashboard;
