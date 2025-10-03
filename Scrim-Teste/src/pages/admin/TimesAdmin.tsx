import React, { useState } from "react";

// Tipagens
interface Player {
  id: number;
  name: string;
  kills: number;
}

interface Team {
  id: number;
  name: string;
  logo: string;
  totalPoints: number;
  top1Count: number;
  totalKills: number;
  matchesPlayed: number;
  players: Player[];
}

const TimesAdmin: React.FC = () => {
  // Mock inicial de times
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 1,
      name: "Equipe Alpha",
      logo: "",
      totalPoints: 120,
      top1Count: 3,
      totalKills: 45,
      matchesPlayed: 5,
      players: [
        { id: 1, name: "Player1", kills: 15 },
        { id: 2, name: "Player2", kills: 12 },
      ],
    },
    {
      id: 2,
      name: "Equipe Beta",
      logo: "",
      totalPoints: 95,
      top1Count: 2,
      totalKills: 30,
      matchesPlayed: 5,
      players: [{ id: 1, name: "PlayerA", kills: 20 }],
    },
  ]);

  // Estados do popup
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamLogo, setNewTeamLogo] = useState("");
  const [newPlayers, setNewPlayers] = useState<string[]>([""]);

  // Adicionar novo time
  const handleAddTeam = () => {
    if (!newTeamName) return;

    const newTeam: Team = {
      id: teams.length + 1,
      name: newTeamName,
      logo: newTeamLogo,
      totalPoints: 0,
      top1Count: 0,
      totalKills: 0,
      matchesPlayed: 0,
      players: newPlayers
        .filter((p) => p.trim() !== "")
        .map((name, idx) => ({ id: idx + 1, name, kills: 0 })),
    };

    setTeams([...teams, newTeam]);
    setNewTeamName("");
    setNewTeamLogo("");
    setNewPlayers([""]);
    setIsModalOpen(false); // fecha modal
  };

  // Adicionar input de jogador
  const handleAddPlayerInput = () => {
    setNewPlayers([...newPlayers, ""]);
  };

  // Atualizar nome do jogador
  const handlePlayerNameChange = (index: number, value: string) => {
    const updatedPlayers = [...newPlayers];
    updatedPlayers[index] = value;
    setNewPlayers(updatedPlayers);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Times Cadastrados</h1>

      {/* Lista de times */}
      <div className="space-y-4 mb-8">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              {team.logo ? (
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white">
                  {team.name[0]}
                </div>
              )}
              <div>
                <h2 className="font-bold">{team.name}</h2>
                <p className="text-gray-300 text-sm">
                  Partidas: {team.matchesPlayed} | Pontos: {team.totalPoints} |
                  Top1: {team.top1Count} | Kills: {team.totalKills} | Jogador
                  principal: {team.players[0]?.name || "-"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botão para abrir popup */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
      >
        + Adicionar Time
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Registrar Novo Time</h2>

            <input
              type="text"
              placeholder="Nome do Time"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="p-2 rounded bg-gray-700 text-white w-full mb-2"
            />

            <input
              type="text"
              placeholder="URL da Logo (opcional)"
              value={newTeamLogo}
              onChange={(e) => setNewTeamLogo(e.target.value)}
              className="p-2 rounded bg-gray-700 text-white w-full mb-2"
            />

            <div className="mb-2">
              <label className="font-semibold mb-1 block">
                Jogadores (opcional)
              </label>
              {newPlayers.map((player, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Jogador ${idx + 1}`}
                  value={player}
                  onChange={(e) => handlePlayerNameChange(idx, e.target.value)}
                  className="p-2 rounded bg-gray-700 text-white w-full mb-1"
                />
              ))}
              <button
                type="button"
                onClick={handleAddPlayerInput}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                + Adicionar Jogador
              </button>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddTeam}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
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

export default TimesAdmin;
