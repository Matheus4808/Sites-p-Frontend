import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Menu, Calendar, Trophy, Settings, LifeBuoy } from "lucide-react";

// Importar páginas
import CriarScrim from "./CriarScrim";
import CriarTorneio from "./CriarTorneio";
import RegistrarScrim from "./RegistrarScrim";
import RegistrarTorneio from "./RegistrarTorneio";
import EditarOrg from "./EditarOrg";
import Suporte from "./Suporte";

// 📌 Página inicial do painel
const AdminHome: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bem-vindo ao Painel Administrativo ⚔️</h1>
      <p className="text-gray-400">
        Aqui você pode gerenciar scrims, torneios, sua organização e suporte. 
        Use o menu lateral para navegar entre as seções.
      </p>

      {/* Cards de destaque */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition">
          <Calendar className="w-10 h-10 text-blue-400 mb-4" />
          <h2 className="text-xl font-semibold">Gerenciar Scrims</h2>
          <p className="text-gray-400 text-sm mt-2">
            Crie e registre scrims para sua organização.
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition">
          <Trophy className="w-10 h-10 text-yellow-400 mb-4" />
          <h2 className="text-xl font-semibold">Organizar Torneios</h2>
          <p className="text-gray-400 text-sm mt-2">
            Crie e registre torneios personalizados.
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition">
          <Settings className="w-10 h-10 text-green-400 mb-4" />
          <h2 className="text-xl font-semibold">Editar Organização</h2>
          <p className="text-gray-400 text-sm mt-2">
            Atualize informações como logo, contato e horários de treino.
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition">
          <LifeBuoy className="w-10 h-10 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold">Suporte</h2>
          <p className="text-gray-400 text-sm mt-2">
            Precisa de ajuda? Abra um ticket ou fale com nosso suporte.
          </p>
        </div>
      </div>
    </div>
  );
};

const AdminPanel: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Início", path: "/admin" },
    { name: "Criar Scrim", path: "/admin/criar-scrim" },
    { name: "Criar Torneio", path: "/admin/criar-torneio" },
    { name: "Registrar Scrim", path: "/admin/registrar-scrim" },
    { name: "Registrar Torneio", path: "/admin/registrar-torneio" },
    { name: "Editar Org", path: "/admin/editar-org" },
    { name: "Suporte", path: "/admin/suporte" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-20 w-64 bg-gray-800 p-6 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300`}
      >
        <h1 className="text-2xl font-bold mb-6">⚔️ Admin Panel</h1>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="px-4 py-2 rounded hover:bg-gray-700 transition font-medium"
              onClick={() => setSidebarOpen(false)} // fecha no mobile ao clicar
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Botão sanduíche (só mobile) */}
        <button
          className="md:hidden mb-4 bg-gray-800 p-2 rounded-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="w-6 h-6 text-white" />
        </button>

        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="criar-scrim" element={<CriarScrim />} />
          <Route path="criar-torneio" element={<CriarTorneio />} />
          <Route path="registrar-scrim" element={<RegistrarScrim />} />
          <Route path="registrar-torneio" element={<RegistrarTorneio />} />
          <Route path="editar-org" element={<EditarOrg />} />
          <Route path="suporte" element={<Suporte />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
