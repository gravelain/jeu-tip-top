import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiHome,
    FiUsers,
    FiSettings,
    FiLogOut,
    FiGift,
} from 'react-icons/fi';

const DashboardLayout = ({ userType, children }) => {
    const navigate = useNavigate();

    // Couleurs et style par type d'utilisateur
    let sidebarBgColor = 'bg-slate-900';
    let sidebarTextColor = 'text-slate-100';
    let sidebarHoverColor = 'hover:bg-slate-800 hover:text-white';
    let activeLinkColor = 'bg-slate-800 text-white';
    let title = 'Tableau de bord';
    let navLinks = [];

    switch (userType) {
        case 'admin':
            sidebarBgColor = 'bg-slate-900';
            sidebarTextColor = 'text-slate-100';
            sidebarHoverColor = 'hover:bg-slate-800 hover:text-white';
            activeLinkColor = 'bg-slate-800 text-white';
            title = 'Espace Administrateur';
            navLinks = [
                { path: '/admindashboard', icon: <FiHome />, label: 'Tableau de bord' },
                { path: '/employeedashboard', icon: <FiUsers />, label: 'Utilisateurs' },
                { path: '/grandgagnant', icon: <FiGift />, label: 'Le Grand Jeu' },
                { path: '', icon: <FiSettings />, label: 'Paramètres' },
            ];
            break;

        case 'client':
            sidebarBgColor = 'bg-emerald-900';
            sidebarTextColor = 'text-emerald-100';
            sidebarHoverColor = 'hover:bg-emerald-800 hover:text-white';
            activeLinkColor = 'bg-emerald-800 text-white';
            title = 'Espace Utilisateur';
            navLinks = [
                { path: '/clientdashboard', icon: <FiHome />, label: 'Tableau de bord' },
                { path: '/game', icon: <FiGift />, label: 'Jouer au jeu' },
            ];
            break;

        case 'employee':
            sidebarBgColor = 'bg-purple-900';
            sidebarTextColor = 'text-purple-100';
            sidebarHoverColor = 'hover:bg-purple-800 hover:text-white';
            activeLinkColor = 'bg-purple-800 text-white';
            title = 'Espace Employé';
            navLinks = [
                { path: '/employeedashboard', icon: <FiHome />, label: 'Tableau de bord' },
            ];
            break;

        default:
            // Fallback
            break;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => {
        return window.location.pathname === path;
    };

    return (
        <div className="flex h-screen bg-zinc-100 font-sans">
            {/* Sidebar */}
            <aside className={`w-64 ${sidebarBgColor} ${sidebarTextColor} flex flex-col`}>
                <div className="px-4 py-6">
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                </div>
                <nav className="flex-1 px-2 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 ${sidebarHoverColor} ${isActive(link.path) ? activeLinkColor : ''}`}
                        >
                            <span className="mr-3">{link.icon}</span>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-4 mt-auto">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 ${sidebarHoverColor}`}
                    >
                        <FiLogOut className="mr-3" />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-50 p-6 md:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
