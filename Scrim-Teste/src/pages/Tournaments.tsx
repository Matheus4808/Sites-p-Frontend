import React from "react";
import { useNavigate } from "react-router-dom";

interface Tournament {
    id: number;
    name: string;
    logo: string;
    startDate: string;
    prize: string;
    registration: string;
}

const Tournaments: React.FC = () => {
    const navigate = useNavigate();

    // Mock de torneios
    const tournaments: Tournament[] = [
        {
            id: 1,
            name: "Campeonato Amador PUBG Mobile",
            logo: "https://via.placeholder.com/60x60.png?text=T1",
            startDate: "2025-10-01",
            prize: "R$ 500",
            registration: "Aberta"
        },
        {
            id: 2,
            name: "Scrim Premiada VIP",
            logo: "https://via.placeholder.com/60x60.png?text=T2",
            startDate: "2025-10-05",
            prize: "R$ 1000",
            registration: "Fechada"
        },
        {
            id: 3,
            name: "Torneio Comunitário",
            logo: "https://via.placeholder.com/60x60.png?text=T3",
            startDate: "2025-10-10",
            prize: "R$ 300",
            registration: "Aberta"
        }
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">🏆 Torneios</h1>
            <p className="text-gray-400 mb-6">
                Confira os campeonatos da comunidade, torneios amadores e scrims premiadas.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map(t => (
                    <div key={t.id} className="bg-gray-800 rounded-xl shadow-md p-4 flex flex-col gap-3 hover:shadow-lg transition">
                        <div className="flex items-center gap-4">
                            <img src={t.logo} alt={t.name} className="w-12 h-12 rounded-full" />
                            <h2 className="text-xl font-bold">{t.name}</h2>
                        </div>
                        <p className="text-gray-300 text-sm">
                            📅 Início: {t.startDate} <br />
                            🏅 Premiação: {t.prize} <br />
                            📝 Inscrição: {t.registration}
                        </p>
                        <button
                            onClick={() => navigate(`/tournaments/${t.id}`)}
                            className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                        >
                            Detalhes
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tournaments;
