import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle standard form login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Send login request to backend
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        { email, password }
      );

      // Store token and user type in localStorage
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userType", user.userType); // Used for redirection

      // Redirect user based on their type
      const userType = user.userType;
      if (userType === "admin") {
        navigate("/admindashboard");
      } else if (userType === "employer") {
        navigate("/employeedashboard");
      } else {
        navigate("/clientdashboard");
      }
    } catch (err) {
      // Handle errors from login request
      setError(err.response?.data?.message || "Email ou mot de passe incorrect.");
    }
  };

  // Handle Google login (for future integration)
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Implement Google OAuth login here
  };

  // Handle Facebook login (for future integration)
  const handleFacebookLogin = () => {
    console.log("Facebook login clicked");
    // Implement Facebook OAuth login here
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h3 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connectez-vous à votre compte
          </h3>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{" "}
            <Link
              to="/register"
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              créer un compte
            </Link>
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Entrez votre email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Entrez votre mot de passe"
            />
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgotpassword"
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                Mot de passe oublié?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Se connecter
            </button>
          </div>
        </form>

        {/* Google and Facebook Login Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div>
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Connexion avec Google</span>
              <FaGoogle className="w-5 h-5 text-red-500" />
            </button>
          </div>

          <div>
            <button
              onClick={handleFacebookLogin}
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Connexion avec Facebook</span>
              <FaFacebook className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
