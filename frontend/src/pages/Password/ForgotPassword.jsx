import React, { useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); // For success/error messages
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(null);
    setIsLoading(true);

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Veuillez entrer une adresse email valide.");
        setIsLoading(false);
        return;
    }

    try {
      // TODO: Implement actual API call to send reset link
      // Example:
      // const response = await axios.post('http://localhost:4000/api/auth/forgot-password', { email });
      //const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, { email });

      // if (response.data.success) {
      //   setMessage("Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.");
      // } else {
      //   throw new Error(response.data.message || 'Erreur lors de l'envoi du lien.');
      // }
      
      // --- Simulation --- 
      console.log("Sending password reset link to:", email);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      setMessage("Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.");
      // --- End Simulation ---
      
      setEmail(""); // Clear email field on success

    } catch (err) {
      console.error("Forgot password error:", err);
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
     <main className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <img
            className="mx-auto h-16 w-auto"
            src="/images/logo.png" 
            alt="Thé Tip Top"
          />
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            Mot de passe oublié ?
          </h2>
           <p className="mt-2 text-center text-sm text-gray-600">
            Entrez votre email pour recevoir un lien de réinitialisation.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {message && (
                 <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{message}</span>
                </div>
            )}
             {error && (
                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">Adresse Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm disabled:bg-gray-100"
                placeholder="Adresse Email"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'}`}
            >
              {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
            </button>
          </div>
           <div className="text-sm text-center">
                <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
                    Retour à la connexion
                </Link>
            </div>
        </form>
      </div>
    </main>
  );
};

export default ForgotPassword;
