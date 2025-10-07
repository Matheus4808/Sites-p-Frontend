import { useState } from "react";
import { motion } from "framer-motion";
import { FiShoppingBag } from "react-icons/fi";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([
    {
      id: 1,
      cliente: "João Silva",
      endereco: "Rua das Flores, 123",
      total: 79.9,
      status: "pendente",
    },
    {
      id: 2,
      cliente: "Maria Oliveira",
      endereco: "Av. Central, 456",
      total: 54.5,
      status: "entregue",
    },
  ]);

  const atualizarStatus = (id, novoStatus) => {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: novoStatus } : p))
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-slate-800">
        <FiShoppingBag className="text-rose-600" /> Pedidos
      </h2>

      <div className="grid gap-4">
        {pedidos.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ scale: 1.01 }}
            className="bg-white p-5 rounded-2xl shadow border border-slate-100 flex justify-between items-center transition"
          >
            <div>
              <h3 className="font-semibold text-slate-800">{p.cliente}</h3>
              <p className="text-sm text-slate-500">{p.endereco}</p>
              <p className="text-rose-600 font-bold mt-1">
                R$ {p.total.toFixed(2)}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => atualizarStatus(p.id, "entregue")}
                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition"
              >
                Confirmar
              </button>
              <button
                onClick={() => atualizarStatus(p.id, "cancelado")}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm transition"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
