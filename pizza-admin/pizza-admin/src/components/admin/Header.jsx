import { FiMenu } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Header({ toggleMenu }) {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-slate-200">
      <div className="flex justify-between items-center px-4 sm:px-6 py-3 max-w-7xl mx-auto">
        <button
          onClick={toggleMenu}
          className="md:hidden text-slate-700 hover:text-rose-600 transition"
        >
          <FiMenu size={26} />
        </button>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg sm:text-xl md:text-2xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent"
        >
          Painel Administrativo 🍕
        </motion.h1>
      </div>
    </header>
  );
}
