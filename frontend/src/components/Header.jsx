import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserIcon } from "@heroicons/react/solid"; // Assure-toi que UserIcon est bien importé

const Header = ({ isLoggedIn, isClient, handleProfileClick, showContactLink }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 rounded-b-2xl">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="logo">
          <Link to="/">
            <img src="/images/logo.png" alt="Thé Tip Top" className="h-10 md:h-12" />
          </Link>
        </div>

        <ul className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
          <li>
            <Link to="/reglement" className="hover:text-teal-700 transition">Guide pratique du jeu</Link>
          </li>

          {isLoggedIn && (
            <>
              {isClient && (
                <li>
                  <Link to="/game" className="hover:text-teal-700 transition">Espace de Jeu</Link>
                </li>
              )}
              <li>
                <button onClick={handleProfileClick} className="hover:text-teal-700 transition">
                  Espace Client
                </button>
              </li>
            </>
          )}

          {showContactLink && (
            <li>
              <Link to="/contact" className="hover:text-teal-700 transition">Contact</Link>
            </li>
          )}

          <li>
            {isLoggedIn ? (
              <button
                onClick={handleProfileClick}
                className="p-2 rounded-full hover:bg-teal-50 text-teal-600 hover:text-teal-700 transition"
                title="Mon Compte"
              >
                <UserIcon />
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-2xl transition font-semibold shadow"
              >
                Connexion
              </Link>
            )}
          </li>
        </ul>

        {/* Mobile toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 hover:text-teal-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 rounded-b-2xl shadow-inner">
          <ul className="flex flex-col items-center space-y-4 py-4 font-medium text-gray-700">
            <li><Link to="/reglement" className="hover:text-teal-700" onClick={closeMobileMenu}>Règles</Link></li>

            {isLoggedIn && (
              <>
                {isClient && <li><Link to="/game" className="hover:text-teal-700" onClick={closeMobileMenu}>Jouer</Link></li>}
                <li>
                  <button onClick={() => { closeMobileMenu(); handleProfileClick(); }} className="hover:text-teal-700">
                    Espace
                  </button>
                </li>
              </>
            )}

            {showContactLink && (
              <li>
                <Link to="/contact" className="hover:text-teal-700" onClick={closeMobileMenu}>Contact</Link>
              </li>
            )}

            <li>
              {isLoggedIn ? (
                <button
                  onClick={() => { closeMobileMenu(); handleProfileClick(); }}
                  className="flex items-center space-x-2 hover:text-teal-700"
                >
                  <UserIcon />
                  <span>Profil</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-2xl block text-center transition shadow"
                  onClick={closeMobileMenu}
                >
                  Connexion
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header; // Exportation par défaut du composant
