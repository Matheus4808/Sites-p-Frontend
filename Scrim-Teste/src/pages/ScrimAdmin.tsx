import React, { useState } from "react";
import { useParams } from "react-router-dom";

// Tipagens
interface TeamData {
  id: number;
  name: string;
  wins: number;
  pointsPlacement: number;
  pointsKills: number;
  total: number;
}

interface PlayerData {
  id: number;
  name: string;
  team: string;
  kills: number;
}

interface EventData {
  id: number;
  date: string;
  time: string;
}

const ScrimAdmin: React.FC = () => {
  const { id } = useParams(); // ID da Scrim
  const [activeTab, setActiveTab] = useState("info");

  // Mock de eventos
  const [events, setEvents] = useState<EventData[]>([
    { id: 1, date: "2025-09-21", time: "19:00" },
    { id: 2, date: "2025-09-22", time: "15:00" },
  ]);

  // Mock de times
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [players, setPlayers] = useState<PlayerData[]>([]);

  // Função para adicionar evento
  const addEvent = () => {
    const newEvent: EventData = { id: events.length + 1, date: "2025-09-25", time: "19:00" };
    setEvents([...events, newEvent]);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Administração da Scrim #{id}</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700">
        {[
          { key: "info", label: "Informações" },
          { key: "events", label: "Eventos / Treinos" },
          { key: "results", label: "Lançar Dados" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-t-lg font-semibold transition ${
              activeTab === tab.key ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo das abas */}
      {activeTab === "info" && (
        <div className="bg-gray-900 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Detalhes da Scrim</h2>
          <form className="flex flex-col gap-4">
            <input type="text" placeholder="Nome da Scrim" className="p-2 rounded bg-gray-800 text-white" />
            <input type="text" placeholder="Link da Logo" className="p-2 rounded bg-gray-800 text-white" />
            <input type="date" className="p-2 rounded bg-gray-800 text-white" />
            <input type="time" className="p-2 rounded bg-gray-800 text-white" />
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold">
              Salvar Informações
            </button>
          </form>
        </div>
      )}

      {activeTab === "events" && (
        <div className="bg-gray-900 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Eventos / Treinos</h2>
          <button
            onClick={addEvent}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold mb-4"
          >
            + Criar Novo Evento
          </button>
          <ul className="space-y-2">
            {events.map(event => (
              <li key={event.id} className="bg-gray-800 p-3 rounded flex justify-between items-center">
                <span>{event.date} ⏰ {event.time}</span>
                <div className="flex gap-2">
                  <button className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded text-xs">Editar</button>
                  <button className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs">Excluir</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "results" && (
        <div className="bg-gray-900 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Lançar Dados dos Treinos</h2>
          {/* Aqui você pode adicionar a tabela de times e jogadores como fizemos no ScrimDetails */}
          <p>Área para registrar vitórias, kills, pontos e exportar tabelas.</p>
        </div>
      )}
    </div>
  );
};

export default ScrimAdmin;
