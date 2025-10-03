import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Scrims', path: '/scrims' },
    { name: 'Torneios', path: '/Tournaments' },
    { name: 'Calendário', path: '/Calendario' },
  ];

  const isActive = (path: string) =>
    location.pathname === path
      ? 'bg-blue-600 text-white'
      : 'text-gray-300 hover:bg-gray-700';

  return (
    <>
      {/* Overlay escuro no mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 shadow-lg z-50 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
      >
        <div className="text-2xl font-bold text-white p-6 border-b border-gray-700 flex justify-between items-center">
          ⚔️ scrimsHub
          {/* Botão fechar no mobile */}
          <button className="md:hidden text-gray-400" onClick={onClose}>
            ✖
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`block rounded-lg px-4 py-2 text-sm font-medium transition ${isActive(item.path)}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
