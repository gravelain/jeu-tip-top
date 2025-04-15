import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Icônes SVG simplifiées pour réseaux sociaux
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 ... (raccourci)" />
  </svg>
);

const TiktokIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02 ... (raccourci)" />
  </svg>
);

// Section Footer
const FooterSection = ({ title, children, isOpen, onToggle }) => (
  <div className="w-full sm:w-1/2 md:w-1/5 px-4 mb-6 md:mb-0">
    <h3 
      className="text-lg font-semibold text-gray-800 mb-4 cursor-pointer md:cursor-default flex justify-between items-center"
      onClick={onToggle}
    >
      {title}
      <span className="md:hidden text-xl">{isOpen ? '-' : '+'}</span>
    </h3>
    <div className={`${isOpen ? 'block' : 'hidden'} md:block text-gray-600 space-y-2`}>
      {children}
    </div>
  </div>
);

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    const handleStorageChange = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  const handleToggle = (sectionKey) => {
    setOpenSection(openSection === sectionKey ? null : sectionKey);
  };

  if (isLoggedIn) return null;

  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-6">
      <div className="container mx-auto px-4">
        {/* Haut du footer */}
        <div className="flex flex-wrap justify-between mb-8">
          {/* Logo */}
          <div className="w-full md:w-1/5 mb-6 md:mb-0 px-4 flex justify-center md:justify-start">
            <img src="/images/logo.png" alt="Thé Tip Top" className="h-12" />
          </div>

          {/* Sections */}
          <div className="w-full md:w-4/5 flex flex-wrap">
            <FooterSection title="Contact" isOpen={openSection === 'contact'} onToggle={() => handleToggle('contact')}>
              <p>Email: <a href="mailto:contact@thetiptop.com" className="hover:text-teal-600 transition">contact@thetiptop.com</a></p>
              <p>Téléphone: +33 1 23 45 67 89</p>
              <p>Adresse: 10 Rue de Nice, 06000 Nice</p>
            </FooterSection>

            <FooterSection title="Suivez-nous" isOpen={openSection === 'follow'} onToggle={() => handleToggle('follow')}>
              <a href="#" className="flex items-center space-x-2 hover:text-teal-600 transition"><FacebookIcon /><span>Facebook</span></a>
              <a href="#" className="flex items-center space-x-2 hover:text-teal-600 transition"><InstagramIcon /><span>Instagram</span></a>
              <a href="#" className="flex items-center space-x-2 hover:text-teal-600 transition"><TiktokIcon /><span>TikTok</span></a>
            </FooterSection>

            <FooterSection title="Mentions Légales" isOpen={openSection === 'legal'} onToggle={() => handleToggle('legal')}>
              <p><Link to="/cgu" className="hover:text-teal-600 transition">CGU</Link></p>
              <p><Link to="/cgv" className="hover:text-teal-600 transition">CGV</Link></p>
              <p><Link to="/mention" className="hover:text-teal-600 transition">Mentions Légales</Link></p>
              <p><Link to="/politique" className="hover:text-teal-600 transition">Politique de Confidentialité</Link></p>
              <p><Link to="/cookies" className="hover:text-teal-600 transition">Cookies</Link></p>
            </FooterSection>

            <FooterSection title="Navigation" isOpen={openSection === 'nav'} onToggle={() => handleToggle('nav')}>
              <p><Link to="/about" className="hover:text-teal-600 transition">À propos</Link></p>
              <p><Link to="/game" className="hover:text-teal-600 transition">Espace de jeu</Link></p>
              <p><Link to="/reglement" className="hover:text-teal-600 transition">Règles du jeu</Link></p>
              <p><Link to="/clientDashboard" className="hover:text-teal-600 transition">Espace client</Link></p>
              <p><Link to="/login" className="hover:text-teal-600 transition">Se connecter</Link></p>
              <p><Link to="/contact" className="hover:text-teal-600 transition">Contact</Link></p>
            </FooterSection>

            <FooterSection title="Newsletter" isOpen={openSection === 'newsletter'} onToggle={() => handleToggle('newsletter')}>
              <p className="mb-2">Abonnez-vous à notre newsletter</p>
              <form className="flex flex-col sm:flex-row sm:items-stretch gap-2">
                <input 
                  type="email" 
                  placeholder="Votre email" 
                  required 
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent flex-grow"
                />
                <button 
                  type="submit" 
                  className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-md transition"
                >
                  S'abonner
                </button>
              </form>
            </FooterSection>
          </div>
        </div>

        {/* Bas du footer */}
        <div className="text-center border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            &copy; 2025 Thé Tip Top — Agence Furious Ducks — Ce site est fictif et aucune demarche commerciale n'est entreprise dessus.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
