import { useState } from "react";
import { motion } from "framer-motion";
import { FiBox } from "react-icons/fi";

export default function Produtos() {
  const [produtos, setProdutos] = useState([
    { id: 1, nome: "Pizza Margherita", preco: 39.9 },
    { id: 2, nome: "Calabresa", preco: 42.5 },
  ]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-slate-800">
        <FiBox className="text-rose-600" /> Produtos
      </h2>

      <div className="bg-white p-6 rounded-2xl shadow border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-sm">
              <th className="py-2">Nome</th>
              <th className="py-2">Preço</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <motion.tr
                key={p.id}
                whileHover={{ scale: 1.01 }}
                className="border-b border-slate-100 hover:bg-rose-50/50 transition"
              >
                <td className="py-3 font-medium text-slate-800">{p.nome}</td>
                <td className="py-3 text-rose-600 font-semibold">
                  R$ {p.preco.toFixed(2)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="mt-6 px-5 py-2 bg-rose-600 text-white font-medium rounded-lg shadow hover:bg-rose-700 transition"
        >
          + Adicionar Produto
        </motion.button>
      </div>
    </div>
  );
}
