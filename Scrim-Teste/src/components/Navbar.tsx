import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-blue-600 font-semibold'
      : 'text-gray-700 hover:text-blue-500 transition-colors';

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600 tracking-tight">
          Minha<span className="text-gray-800">App</span>
        </div>

        {/* Botão mobile */}
        <button
          className="md:hidden text-gray-700"
          onClick={toggleMenu}
          aria-label="Abrir menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Menu desktop */}
        <div className="hidden md:flex space-x-8 text-lg">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/about" className={isActive('/about')}>Sobre</Link>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        className={`md:hidden mt-4 flex flex-col space-y-4 transition-all duration-300 ease-in-out origin-top text-lg ${
          menuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <Link to="/" className={isActive('/')} onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/about" className={isActive('/about')} onClick={() => setMenuOpen(false)}>Sobre</Link>
      </div>
    </nav>
  );
};

export default Navbar;
