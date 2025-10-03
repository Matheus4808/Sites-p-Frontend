import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toPng } from "html-to-image";

interface Team {
  id: number;
  team_name: string;
  wins: number;
  points_placement: number;
  points_kills: number;
  total: number;
  date: string;
  time: string;
  logo_path?: string;
}

interface Player {
  id: number;
  player_name: string;
  team_name: string;
  kills: number;
  date: string;
  time: string;
}

interface Organization {
  org_name: string;
  instagram: string;
  logo_path: string;
}

const ScrimDetails: React.FC = () => {
  const { id: orgId } = useParams();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]); // Top 3 do dia
  const [teamsWeek, setTeamsWeek] = useState<Team[]>([]);
  const [playersWeek, setPlayersWeek] = useState<Player[]>([]); // Top 10 da semana
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [selectedTime, setSelectedTime] = useState("15:00");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"diario" | "semanal">("diario");
  const tableRef = useRef<HTMLDivElement>(null);
  const times = ["15:00", "19:00", "22:00"];

  // Busca no backend
  const fetchScrimDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/scrims/org/${orgId}/details?date=${selectedDate}&time=${selectedTime}`
      );
      const data = await res.json();

      if (!res.ok) {
        console.error("Erro ao buscar detalhes:", data.error);
        return;
      }

      setOrganization(data.organization);

      // Tabela diária
      setTeams(
        data.teams
          .map((team: Team) => ({
            ...team,
            total: (team.points_placement || 0) + (team.points_kills || 0),
          }))
          .sort((a: Team, b: Team) => b.total - a.total)
      );

      // Top 3 jogadores diários (vem direto do backend já filtrado)
      setPlayers(data.players || []);

      // Tabela semanal
      setTeamsWeek(
        data.teamsWeek
          .map((team: Team) => ({
            ...team,
            total: (team.points_placement || 0) + (team.points_kills || 0),
          }))
          .sort((a: Team, b: Team) => b.total - a.total)
      );

      // Top 10 semanal
      setPlayersWeek(data.playersWeek || []);
    } catch (err) {
      console.error("Erro ao buscar detalhes da scrim:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScrimDetails();
  }, [orgId, selectedDate, selectedTime]);

  const exportToPNG = () => {
    if (!tableRef.current) return;
    toPng(tableRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `scrim-${orgId}-${selectedDate}-${selectedTime}-${activeTab}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch(console.error);
  };

  if (loading) return <p className="text-gray-400">Carregando dados...</p>;

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 bg-gray-800 p-6 rounded-xl shadow-md">
        <div className="flex items-center gap-4">
          {organization?.logo_path && (
            <img
              src={organization.logo_path}
              alt={organization.org_name}
              className="w-20 h-20 rounded-lg object-cover border border-gray-600"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">
              {organization?.org_name || `Scrim #${orgId}`}
            </h1>
            {organization?.instagram && (
              <p className="text-gray-400">@{organization.instagram}</p>
            )}
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          >
            {times.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-700 mb-6">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold transition ${
            activeTab === "diario"
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("diario")}
        >
          Tabela Diária
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold transition ${
            activeTab === "semanal"
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("semanal")}
        >
          Tabela Semanal
        </button>
      </div>

      {/* Conteúdo das abas */}
      <div className="relative">
        {/* Aba diária */}
        <div
          className={`transition-opacity duration-500 ${
            activeTab === "diario"
              ? "opacity-100"
              : "opacity-0 absolute top-0 left-0 w-full"
          }`}
          ref={activeTab === "diario" ? tableRef : null}
        >
          <h2 className="text-xl font-bold mb-4">
            Tabela do Treino ({selectedDate} - {selectedTime})
          </h2>
          <table className="w-full border-collapse text-left mb-6">
            <thead>
              <tr className="bg-gray-700 text-gray-200">
                <th className="p-2">Logo</th>
                <th className="p-2">Nome do Time</th>
                <th className="p-2">WWCD</th>
                <th className="p-2">Pontos por Queda</th>
                <th className="p-2">Pontos por Kill</th>
                <th className="p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr
                  key={team.id}
                  className="border-b border-gray-700 hover:bg-gray-800"
                >
                  <td className="p-2">
                    <img
                      src={
                        team.logo_path ||
                        organization?.logo_path ||
                        "https://via.placeholder.com/40x40.png?text=LOGO"
                      }
                      alt={team.team_name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  </td>
                  <td className="p-2">{team.team_name ?? "-"}</td>
                  <td className="p-2">{team.wins ?? 0}</td>
                  <td className="p-2">{team.points_placement ?? 0}</td>
                  <td className="p-2">{team.points_kills ?? 0}</td>
                  <td className="p-2 font-bold">{team.total ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-xl font-bold mt-6 mb-2">Top 3 Jogadores do Dia</h2>
          <ul className="space-y-2 mb-6">
            {players.length > 0 ? (
              players.map((p, i) => (
                <li
                  key={p.id}
                  className="bg-gray-800 p-3 rounded-lg flex justify-between items-center"
                >
                  <span>
                    {i + 1}. {p.player_name} ({p.team_name})
                  </span>
                  <span className="font-bold">{p.kills} kills</span>
                </li>
              ))
            ) : (
              <p className="text-gray-400">Nenhum jogador registrado ainda.</p>
            )}
          </ul>
        </div>

        {/* Aba semanal */}
        <div
          className={`transition-opacity duration-500 ${
            activeTab === "semanal"
              ? "opacity-100"
              : "opacity-0 absolute top-0 left-0 w-full"
          }`}
          ref={activeTab === "semanal" ? tableRef : null}
        >
          <h2 className="text-xl font-bold mb-4">Top 20 Times da Semana</h2>
          <table className="w-full border-collapse text-left mb-6">
            <thead>
              <tr className="bg-gray-700 text-gray-200">
                <th className="p-2">#</th>
                <th className="p-2">Equipe</th>
                <th className="p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {teamsWeek.map((team, i) => (
                <tr
                  key={team.id}
                  className="border-b border-gray-700 hover:bg-gray-800"
                >
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{team.team_name}</td>
                  <td className="p-2 font-bold">{team.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-xl font-bold mb-2">Top 10 Jogadores da Semana</h2>
          <ul className="space-y-2 mb-4">
            {playersWeek.length > 0 ? (
              playersWeek.map((p, i) => (
                <li
                  key={p.id}
                  className="bg-gray-800 p-3 rounded-lg flex justify-between items-center"
                >
                  <span>
                    {i + 1}. {p.player_name} ({p.team_name})
                  </span>
                  <span className="font-bold">{p.kills} kills</span>
                </li>
              ))
            ) : (
              <p className="text-gray-400">Nenhum jogador registrado ainda.</p>
            )}
          </ul>
        </div>
      </div>

      <button
        onClick={exportToPNG}
        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
      >
        Exportar Tabela da Aba Ativa como PNG
      </button>
    </div>
  );
};

export default ScrimDetails;
