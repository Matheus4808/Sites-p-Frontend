import { motion } from "framer-motion";
import { FaPizzaSlice } from "react-icons/fa";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100"
    >
      <div className="flex items-center gap-3 mb-3">
        <FaPizzaSlice className="text-rose-600 text-3xl" />
        <h2 className="text-2xl font-bold text-slate-800">
          Bem-vindo ao Painel Administrativo
        </h2>
      </div>
      <p className="text-slate-600 leading-relaxed">
        Aqui você pode gerenciar seus pedidos, produtos, promoções e acompanhar
        o faturamento da pizzaria em tempo real — tudo com facilidade e estilo.
      </p>
    </motion.div>
  );
}
