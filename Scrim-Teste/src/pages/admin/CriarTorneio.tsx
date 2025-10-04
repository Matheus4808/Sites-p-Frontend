import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext"; // caso você use context de auth
import axios from "axios";

const CriarTorneio: React.FC = () => {
  const { user } = useAuth(); // usuário logado
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [numeroEquipes, setNumeroEquipes] = useState("20");
  const [servidor, setServidor] = useState("SA");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [valorPremiacao, setValorPremiacao] = useState("");
  const [formato, setFormato] = useState("");
  const [numeroContato, setNumeroContato] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const orgId = user?.id || localStorage.getItem("organizationId");

      if (!orgId) {
        setMessage("Organização não autenticada.");
        setLoading(false);
        return;
      }

      const res = await axios.post("https://backend-p-scrim.onrender.com/api/admin/tournaments", {
        orgId,
        title: nome,
        descricao: descricao,
        date: dataInicio,
        time: "00:00",
        numeroEquipes: numeroEquipes,
        price: Number(valorPremiacao),
        contact: numeroContato,
        form: formato,
        pg: formaPagamento,
        servidor: servidor,
      });

      if (res.status === 200) {
        setMessage("Torneio criado com sucesso!");
        // Limpar campos
        setNome("");
        setDescricao("");
        setNumeroEquipes("20");
        setServidor("SA");
        setFormaPagamento("");
        setValorPremiacao("");
        setFormato("");
        setNumeroContato("");
        setDataInicio("");
      } else {
        setMessage("Erro ao criar torneio.");
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.error || "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const renderFormatos = () => {
    switch (numeroEquipes) {
      case "20":
        return <option value="final_direta">20 times → Final direta</option>;
      case "24":
        return (
          <option value="grupos_3x8">
            24 times → 3 Grupos de 8 → 18 times para final
          </option>
        );
      case "32":
        return (
          <option value="grupos_2x16">
            32 times → 2 Grupos de 16 → 16 times para final
          </option>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Criar Torneio</h1>

      {message && <p className="mb-4 text-center">{message}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nome do Torneio"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="p-3 rounded bg-gray-800"
          required
        />

        <textarea
          placeholder="Descrição do Torneio"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="p-3 rounded bg-gray-800"
          rows={4}
          required
        />

        <input
          type="date"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          className="p-3 rounded bg-gray-800"
          required
        />

        <select
          value={numeroEquipes}
          onChange={(e) => setNumeroEquipes(e.target.value)}
          className="p-3 rounded bg-gray-800"
          required
        >
          <option value="20">20 equipes</option>
          <option value="24">24 equipes</option>
          <option value="32">32 equipes</option>
        </select>

        <select
          value={formato}
          onChange={(e) => setFormato(e.target.value)}
          className="p-3 rounded bg-gray-800"
          required
        >
          {renderFormatos()}
        </select>

        <select
          value={servidor}
          onChange={(e) => setServidor(e.target.value)}
          className="p-3 rounded bg-gray-800"
          required
        >
          <option value="SA">SA</option>
          <option value="NA">NA</option>
          <option value="EU">EU</option>
        </select>

        <select
          value={formaPagamento}
          onChange={(e) => setFormaPagamento(e.target.value)}
          className="p-3 rounded bg-gray-800"
          required
        >
          <option value="">Forma de Pagamento</option>
          <option value="PIX">PIX</option>
          <option value="Cartão de Crédito">Cartão de Crédito</option>
          <option value="Cartão de Débito">Cartão de Débito</option>
        </select>

        <input
          type="number"
          placeholder="Valor da Premiação"
          value={valorPremiacao}
          onChange={(e) => setValorPremiacao(e.target.value)}
          className="p-3 rounded bg-gray-800"
          required
        />

        <input
          type="text"
          placeholder="Número de Contato (WhatsApp)"
          value={numeroContato}
          onChange={(e) => setNumeroContato(e.target.value)}
          className="p-3 rounded bg-gray-800"
          required
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold"
          disabled={loading}
        >
          {loading ? "Criando..." : "Criar Torneio"}
        </button>
      </form>
    </div>
  );
};

export default CriarTorneio;
