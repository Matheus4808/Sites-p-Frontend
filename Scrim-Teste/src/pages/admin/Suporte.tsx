import React, { useState } from "react";

interface SupportTicket {
  id: number;
  title: string;
  description: string;
  status: "aberto" | "resolvido";
}

const Suporte: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: 1, title: "Erro ao registrar scrim", description: "Não consigo registrar a scrim no painel.", status: "aberto" },
    { id: 2, title: "Dúvida sobre torneio", description: "Como faço para inscrever um time no torneio?", status: "resolvido" },
  ]);

  const [newTicket, setNewTicket] = useState({ title: "", description: "" });

  // 🔹 Novo estado para suporte via WhatsApp
  const [orgName, setOrgName] = useState("");
  const [problem, setProblem] = useState("");

  // Função para adicionar ticket local
  const handleAddTicket = () => {
    if (!newTicket.title || !newTicket.description) return;

    setTickets([
      ...tickets,
      {
        id: tickets.length + 1,
        title: newTicket.title,
        description: newTicket.description,
        status: "aberto",
      },
    ]);

    setNewTicket({ title: "", description: "" });
  };

  // 🔹 Função para abrir WhatsApp
  const handleWhatsAppSupport = () => {
    if (!orgName || !problem) {
      alert("Preencha todos os campos antes de enviar!");
      return;
    }

    const phoneNumber = "5538998831854"; // <-- coloque seu número com DDI (55) e DDD
    const message = `Sou representante da org ${orgName}, estou com os seguintes problemas:\n\n${problem}`;

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Suporte</h1>

      {/* 🔹 Formulário WhatsApp */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h2 className="font-semibold mb-2">Falar direto com suporte via WhatsApp</h2>
        <input
          type="text"
          placeholder="Nome da Organização"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
        />
        <textarea
          placeholder="Descreva sua dúvida ou problema"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          rows={3}
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
          onClick={handleWhatsAppSupport}
        >
          Enviar para o Suporte (WhatsApp)
        </button>
      </div>

      {/* 🔹 Formulário de Tickets */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h2 className="font-semibold mb-2">Abrir novo ticket</h2>
        <input
          type="text"
          placeholder="Título do ticket"
          value={newTicket.title}
          onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
        />
        <textarea
          placeholder="Descrição"
          value={newTicket.description}
          onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          rows={3}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
          onClick={handleAddTicket}
        >
          Enviar Ticket
        </button>
      </div>

      {/* 🔹 Lista de tickets */}
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-gray-900 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{ticket.title}</h3>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  ticket.status === "aberto" ? "bg-yellow-500 text-black" : "bg-green-600 text-white"
                }`}
              >
                {ticket.status.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-300">{ticket.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suporte;
