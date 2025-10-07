import { useState } from "react";
import { motion } from "framer-motion";
import { FiBarChart2 } from "react-icons/fi";

export default function Faturamento() {
  const [data, setData] = useState("");
  const [faturamento, setFaturamento] = useState(480.5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-slate-800">
        <FiBarChart2 className="text-rose-600" /> Faturamento
      </h2>

      <div className="bg-white p-6 rounded-2xl shadow border border-slate-100 max-w-md">
        <label className="block text-sm text-slate-600 mb-2">
          Filtrar por data:
        </label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 w-full mb-4 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition"
        />

        <div className="text-lg font-medium">
          Faturamento do dia:{" "}
          <span className="text-rose-600 font-bold">R$ {faturamento}</span>
        </div>
      </div>
    </motion.div>
  );
}
