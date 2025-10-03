import React, { useState } from "react";
import { useParams } from "react-router-dom";

// Tipagens simuladas
interface Team {
    id: number;
    name: string;
    logo: string;
}

const TournamentDetails: React.FC = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("info");

    // Mock de torneio
    const tournament = {
        name: `Torneio #${id}`,
        format: "Eliminação dupla / Fase de grupos",
        prize: "R$ 1.000",
        phases: [
            { phase: "Fase de grupos", date: "01/10/2025" },
            { phase: "Quartas de final", date: "05/10/2025" },
            { phase: "Semifinal", date: "10/10/2025" },
            { phase: "Final", date: "15/10/2025" }
        ],
        scoring: "Vitória: 3 pts, Queda: 1 pt, Kill: 0,5 pts",
        registration: "Aberta"
    };

    // Mock de equipes inscritas
    const teams: Team[] = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        name: `Equipe ${i + 1}`,
        logo: `https://via.placeholder.com/40x40.png?text=T${i + 1}`
    }));

    return (
        <div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-md mb-6">
                <h1 className="text-3xl font-bold">🏆 {tournament.name}</h1>
                <p className="text-gray-400">Torneio comunitário PUBG Mobile</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto border-b border-gray-700 mb-6">
                {[
                    { key: "info", label: "Informações" },
                    { key: "teams", label: "Equipes Inscritas" }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-t-lg font-semibold transition ${
                            activeTab === tab.key
                                ? "bg-blue-600 text-white"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Conteúdo da Aba */}
            {activeTab === "info" && (
                <div className="bg-gray-900 p-6 rounded-lg space-y-4">
                    <h2 className="text-xl font-bold">Formato:</h2>
                    <p>{tournament.format}</p>

                    <h2 className="text-xl font-bold">Premiação:</h2>
                    <p>{tournament.prize}</p>

                    <h2 className="text-xl font-bold">Fases do Torneio:</h2>
                    <ul className="list-disc list-inside">
                        {tournament.phases.map((phase, i) => (
                            <li key={i}>{phase.phase} - {phase.date}</li>
                        ))}
                    </ul>

                    <h2 className="text-xl font-bold">Sistema de Pontuação:</h2>
                    <p>{tournament.scoring}</p>

                    <h2 className="text-xl font-bold">Inscrição:</h2>
                    <p>{tournament.registration}</p>

                    <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md">
                        📝 Inscrever-se no Torneio
                    </button>
                </div>
            )}

            {activeTab === "teams" && (
                <div className="bg-gray-900 p-6 rounded-lg space-y-4">
                    <h2 className="text-xl font-bold mb-4">Equipes Inscritas ({teams.length})</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teams.map(team => (
                            <div key={team.id} className="bg-gray-800 p-3 rounded-lg flex items-center gap-3">
                                <img src={team.logo} alt={team.name} className="w-10 h-10 rounded-full" />
                                <span>{team.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TournamentDetails;
