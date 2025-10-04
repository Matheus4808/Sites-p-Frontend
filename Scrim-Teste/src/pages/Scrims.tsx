import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaClock } from "react-icons/fa"; // FontAwesome

// Tipagem da Scrim
interface Scrim {
    id: number;
    orgLogo: string;
    name: string;
    trainingHours: string[];
}

const Scrims: React.FC = () => {
    const [scrims, setScrims] = useState<Scrim[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScrims = async () => {
            try {
                const res = await fetch("https://backend-p-scrim.onrender.com/api/scrims");
                const data = await res.json();
                setScrims(data);
            } catch (err) {
                console.error("Erro ao carregar scrims", err);
            } finally {
                setLoading(false);
            }
        };

        fetchScrims();
    }, []);

    if (loading) return <p className="text-gray-400">Carregando scrims...</p>;

    return (
        <div className="px-4 sm:px-6 lg:px-12 py-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 text-white">
                ⚔️ Scrims
            </h1>
            <p className="mb-8 text-gray-400 text-lg">
                Lista de treinos organizados pelas equipes.
            </p>

            {/* Lista de Scrims */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {scrims.map((scrim) => (
                    <div
                        key={scrim.id}
                        className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 hover:shadow-xl transition transform hover:-translate-y-1 p-5 flex flex-col"
                    >
                        {/* Header com logo e nome */}
                        <div className="flex items-center gap-4 mb-5">
                            <img
                                src={scrim.orgLogo}
                                alt={scrim.name}
                                className="w-16 h-16 rounded-lg border-none object-cover"
                            />

                            <h2 className="text-xl font-semibold text-white">
                                {scrim.name}
                            </h2>
                        </div>

                        {/* Horários de treino */}
                        <div className="flex-1">
                            <p className="text-gray-400 mb-2">
                                <FaClock className="inline mr-2" />
                                Horários de treino:
                            </p>
                            <ul className="text-gray-300 space-y-1">
                                {scrim.trainingHours.length > 0 ? (
                                    scrim.trainingHours.map((hour, idx) => (
                                        <li
                                            key={idx}
                                            className="px-2 py-1 rounded-md bg-gray-800 text-sm"
                                        >
                                            • {hour}
                                        </li>
                                    ))
                                ) : (
                                    <li className="italic text-gray-500">
                                        Não informado
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Botão de detalhes */}
                        <Link
                            to={`/scrims/${scrim.id}`}
                            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center font-semibold transition"
                        >
                            Ver detalhes
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Scrims;
