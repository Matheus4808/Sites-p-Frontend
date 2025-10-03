import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from "react-router-dom";

interface Props {
  children?: React.ReactNode;
}

const MainLayout: React.FC<Props> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 min-h-screen bg-gray-900 text-gray-100">
        {/* Topbar Mobile */}
        <div className="md:hidden p-4 flex items-center justify-between bg-gray-800 border-b border-gray-700 sticky top-0 z-30">
          <button onClick={toggleSidebar} aria-label="Abrir menu">
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-xl font-semibold text-white">eSportsHub</span>
        </div>

        {/* Conteúdo da Página */}
        <main className="p-6 pt-4">{children}</main>
        <Outlet /> {/* 👈 Aqui é onde o conteúdo das rotas filhas será renderizado */}
      </div>
    </div>
  );
};

export default MainLayout;
