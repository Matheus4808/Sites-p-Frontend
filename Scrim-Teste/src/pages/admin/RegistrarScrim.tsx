import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // para pegar o id do admin

// Tipagens
interface Team {
  id: number;
  name: string;
  logo: string;
  totalPoints: number;
}

interface Scrim {
  id: number;
  date: string;
  time: string;
  teams: Team[];
}

interface Player {
  name: string;
  kills: number;
  teamId: number;
}

const RegistrarScrim: React.FC = () => {
  const { user } = useAuth(); // admin logado
  const [scrims, setScrims] = useState<Scrim[]>([]);
  const [activeScrimId, setActiveScrimId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0); // 0 = Queda1, 1 = Queda2, etc.
  const [points, setPoints] = useState<Record<number, { placement: number; kills: number }>>({});
  const [loading, setLoading] = useState(false);
  const [editingScrimId, setEditingScrimId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [quedasRegistradas, setQuedasRegistradas] = useState<Record<number, Record<number, { placement: number; kills: number; isWinner?: boolean }>>>({});

  // Novo estado para Top3
  const [showTop3Modal, setShowTop3Modal] = useState(false);
  const [top3Players, setTop3Players] = useState<Player[]>([
    { name: "", kills: 0, teamId: 0 },
    { name: "", kills: 0, teamId: 0 },
    { name: "", kills: 0, teamId: 0 },
  ]);

  // Buscar scrims do admin logado
  const fetchScrims = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/admin/scrims/${user.id}`);
      const data = await res.json();
      setScrims(data.scrims || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScrims();
  }, [user]);

  const handlePointChange = (teamId: number, type: "placement" | "kills", value: number) => {
    setPoints((prev) => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [type]: value,
      },
    }));
  };

  const saveQueda = async () => {
    if (activeScrimId === null) return;

    // Encontrar a scrim ativa
    const scrimIndex = scrims.findIndex((s) => s.id === activeScrimId);
    if (scrimIndex === -1) return;

    // Pegando o vencedor da queda: quem teve melhor placement
    const teamEntries = Object.entries(points);
    if (teamEntries.length === 0) {
      alert("Você precisa registrar pelo menos um time.");
      return;
    }

    const sortedByPlacementPoints = teamEntries.sort((a, b) => b[1].placement - a[1].placement);
    const winnerTeamId = parseInt(sortedByPlacementPoints[0][0]);

    try {
      // Envia pontos da queda para o backend
      const response = await fetch(
        `http://localhost:5000/api/admin/scrims/${activeScrimId}/points`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            queda: activeTab + 1,
            points,
            winnerTeamId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao salvar os dados no backend");
      }

      // ✅ Buscar os dados atualizados da queda do backend
      const updatedQuedaRes = await fetch(
        `http://localhost:5000/api/admin/scrims/${activeScrimId}/queda/${activeTab + 1}`
      );

      const updatedQuedaData = await updatedQuedaRes.json();
      const updatedPoints = updatedQuedaData.points;

      setQuedasRegistradas((prev) => ({
        ...prev,
        [activeTab + 1]: updatedPoints,
      }));

      setPoints(updatedPoints);

      alert(`Queda ${activeTab + 1} registrada com sucesso!`);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar pontos no servidor");
    }
  };

  const saveTop3Players = async () => {
    if (activeScrimId === null || !scrimToEdit || !user) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/scrims/${activeScrimId}/players`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orgId: user.id, // id do admin logado
            scrimId: activeScrimId,
            queda_number: activeTab + 1,
            date: scrimToEdit.date,
            time: scrimToEdit.time,
            players: top3Players.map((p) => ({
              player_name: p.name,
              team_id: p.teamId,
              kills: p.kills,
            })),
          }),
        }
      );

      if (!response.ok) throw new Error("Erro ao salvar Top 3 jogadores");

      alert("Top 3 jogadores registrados com sucesso!");
      setShowTop3Modal(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar jogadores no servidor");
    }
  };

  const registerScrim = (scrimId: number) => {
    setActiveScrimId(scrimId);
    setActiveTab(0);
    setPoints({});
  };

  const deleteScrim = async (scrimId: number) => {
    if (!confirm("Deseja realmente excluir esta scrim?")) return;
    try {
      await fetch(`http://localhost:5000/api/admin/scrims/${scrimId}`, {
        method: "DELETE",
      });
      setScrims(scrims.filter((s) => s.id !== scrimId));
      alert("Scrim excluída com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir scrim");
    }
  };

  const startEditing = (scrim: Scrim) => {
    setEditingScrimId(scrim.id);
    setEditDate(scrim.date);
    setEditTime(scrim.time);
  };

  const saveEdit = async (scrimId: number) => {
    try {
      await fetch(`http://localhost:5000/api/admin/scrims/${scrimId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: editDate, time: editTime }),
      });

      setScrims(
        scrims.map((s) =>
          s.id === scrimId ? { ...s, date: editDate, time: editTime } : s
        )
      );
      setEditingScrimId(null);
      alert("Scrim atualizada!");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar scrim");
    }
  };

  const scrimToEdit = scrims.find((s) => s.id === activeScrimId);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Registrar Scrims</h1>

      {loading ? (
        <p>Carregando scrims...</p>
      ) : activeScrimId === null ? (
        <div className="space-y-4">
          {scrims.map((scrim) => (
            <div
              key={scrim.id}
              className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                {editingScrimId === scrim.id ? (
                  <div className="flex gap-2 items-center">
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="bg-gray-700 text-white px-2 py-1 rounded"
                    />
                    <input
                      type="text"
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                      className="bg-gray-700 text-white px-2 py-1 rounded"
                    />
                    <button
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white"
                      onClick={() => saveEdit(scrim.id)}
                    >
                      Salvar
                    </button>
                    <button
                      className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-white"
                      onClick={() => setEditingScrimId(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-bold">
                      Scrim {scrim.id} - {formatDate(scrim.date)} {scrim.time}
                    </h2>
                    <p className="text-gray-300">{scrim.teams.length} times</p>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {editingScrimId !== scrim.id && (
                  <>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
                      onClick={() => startEditing(scrim)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
                      onClick={() => deleteScrim(scrim.id)}
                    >
                      Excluir
                    </button>
                    <button
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white"
                      onClick={() => registerScrim(scrim.id)}
                    >
                      Registrar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Registrando Scrim {scrimToEdit?.id} - {scrimToEdit?.date} {scrimToEdit?.time}
          </h2>

          {/* Tabs de Quedas + Top3 */}
          <div className="flex gap-2 mb-4">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded-t-lg font-semibold ${activeTab === i ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
                  }`}
                onClick={() => {
                  setActiveTab(i);
                  if (quedasRegistradas[i + 1]) {
                    setPoints(quedasRegistradas[i + 1]);
                  } else {
                    setPoints({});
                  }
                }}
              >
                Queda {i + 1}
              </button>
            ))}

            {/* Botão para Top3 */}
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded-t-lg"
              onClick={() => setShowTop3Modal(true)}
            >
              Top 3 Jogadores
            </button>
          </div>

          {/* Tabela de pontos */}
          <div className="overflow-x-auto bg-gray-900 p-4 rounded-lg">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-700 text-gray-200">
                  <th className="p-2">#</th>
                  <th className="p-2">Equipe</th>
                  <th className="p-2">Pontos Queda</th>
                  <th className="p-2">Pontos Kill</th>
                </tr>
              </thead>
              <tbody>
                {scrimToEdit?.teams.map((team, index) => {
                  const isWinner =
                    Object.values(points).length > 0 &&
                    team.id ===
                    parseInt(
                      Object.entries(points)
                        .sort((a, b) => a[1].placement - b[1].placement)[0][0]
                    );

                  return (
                    <tr key={team.id} className={`border-b border-gray-700 hover:bg-gray-800 ${isWinner ? "bg-green-700" : ""}`}>
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{team.name}</td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={points[team.id]?.placement || ""}
                          onChange={(e) =>
                            handlePointChange(team.id, "placement", Number(e.target.value))
                          }
                          className="w-16 p-1 rounded bg-gray-700 text-white"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={points[team.id]?.kills || ""}
                          onChange={(e) =>
                            handlePointChange(team.id, "kills", Number(e.target.value))
                          }
                          className="w-16 p-1 rounded bg-gray-700 text-white"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <button
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
              onClick={saveQueda}
            >
              Salvar Queda {activeTab + 1}
            </button>
          </div>

          <button
            className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
            onClick={() => setActiveScrimId(null)}
          >
            Voltar
          </button>
        </div>
      )}

      {/* Modal Top 3 Jogadores */}
      {showTop3Modal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-bold text-white mb-4">
              Registrar Top 3 Jogadores - Queda {activeTab + 1}
            </h2>

            {top3Players.map((player, index) => (
              <div key={index} className="mb-3">
                <h3 className="text-gray-200">Jogador {index + 1}</h3>
                <input
                  type="text"
                  placeholder="Nome do jogador"
                  value={player.name}
                  onChange={(e) => {
                    const newPlayers = [...top3Players];
                    newPlayers[index].name = e.target.value;
                    setTop3Players(newPlayers);
                  }}
                  className="w-full p-2 rounded bg-gray-700 text-white mb-2"
                />
                <input
                  type="number"
                  placeholder="Kills"
                  value={player.kills}
                  onChange={(e) => {
                    const newPlayers = [...top3Players];
                    newPlayers[index].kills = Number(e.target.value);
                    setTop3Players(newPlayers);
                  }}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
                <select
                  value={player.teamId}
                  onChange={(e) => {
                    const newPlayers = [...top3Players];
                    newPlayers[index].teamId = Number(e.target.value);
                    setTop3Players(newPlayers);
                  }}
                  className="w-full p-2 rounded bg-gray-700 text-white mt-2"
                >
                  <option value={0}>Selecione o time</option>
                  {scrimToEdit?.teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
                onClick={() => setShowTop3Modal(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                onClick={saveTop3Players}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrarScrim;
