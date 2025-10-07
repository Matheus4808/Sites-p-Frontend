import { useState } from "react";
import { motion } from "framer-motion";
import { FiTag } from "react-icons/fi";

export default function Promocoes() {
  const [promos, setPromos] = useState([
    { id: 1, nome: "Combo Família", desc: "2 pizzas + refri 2L" },
  ]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-slate-800">
        <FiTag className="text-rose-600" /> Promoções
      </h2>

      <div className="grid gap-4">
        {promos.map((promo) => (
          <motion.div
            key={promo.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-5 rounded-2xl shadow border border-slate-100 flex justify-between items-center"
          >
            <div>
              <div className="font-semibold text-slate-800">{promo.nome}</div>
              <div className="text-sm text-slate-500">{promo.desc}</div>
            </div>
            <button className="px-3 py-1 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition text-sm">
              Editar
            </button>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        className="mt-6 px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow"
      >
        + Nova Promoção
      </motion.button>
    </div>
  );
}
