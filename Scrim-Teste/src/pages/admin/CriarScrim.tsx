import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext"; // para pegar o id do admin

interface Time {
  name: string;
  colab: boolean;
  logo: string;
}

const CriarScrim: React.FC = () => {
  const { user } = useAuth(); // usuário logado (id do admin)
  const [date, setDate] = useState("");
  const [time, setTime] = useState("15:00");
  const [timeList, setTimeList] = useState<Time[]>(
    Array.from({ length: 20 }, (_, i) => ({
      name: `Equipe ${i + 1}`,
      colab: false,
      logo: "",
    }))
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/admin/scrims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: user?.id ?? "", // id do admin logado, fallback para string vazia se user for null
          date,
          time,
          teams: timeList.map((t) => ({ name: t.name, colab: t.colab, logo: t.logo })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Erro ao criar scrim");
      } else {
        setMessage("Scrim criada com sucesso!");
        // Limpar formulário ou manter data/time se quiser
      }
    } catch (err) {
      console.error(err);
      setMessage("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📅 Criar Scrim</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-xl shadow-lg">
        {/* Data e horário */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Horário</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-green-500"
            >
              <option>15:00</option>
              <option>19:00</option>
              <option>22:00</option>
            </select>
          </div>
        </div>

        {/* Lista de Times */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Equipes</h2>
          <div className="space-y-4">
            {timeList.map((timeObj, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-4 bg-gray-700 p-4 rounded-lg shadow">
                <input
                  type="text"
                  value={timeObj.name}
                  onChange={(e) => {
                    const newTimes = [...timeList];
                    newTimes[i].name = e.target.value;
                    setTimeList(newTimes);
                  }}
                  placeholder="Nome da equipe"
                  className="flex-1 p-3 rounded-lg bg-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={timeObj.colab}
                    onChange={(e) => {
                      const newTimes = [...timeList];
                      newTimes[i].colab = e.target.checked;
                      setTimeList(newTimes);
                    }}
                    className="w-5 h-5"
                  />
                  <span>Colab</span>
                </label>
                <input
                  type="file"
                  className="text-sm"
                  onChange={(e) => {
                    const newTimes = [...timeList];
                    if (e.target.files) newTimes[i].logo = URL.createObjectURL(e.target.files[0]);
                    setTimeList(newTimes);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {message && <p className="text-center text-white font-semibold">{message}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition"
          disabled={loading}
        >
          {loading ? "Criando..." : "🚀 Criar Scrim"}
        </button>
      </form>
    </div>
  );
};

export default CriarScrim;
