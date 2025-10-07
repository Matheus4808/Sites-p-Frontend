import { motion } from "framer-motion";
import {
  FiHome,
  FiShoppingBag,
  FiBarChart2,
  FiBox,
  FiTag,
} from "react-icons/fi";

const menuItems = [
  { id: "home", label: "Home", icon: <FiHome /> },
  { id: "pedidos", label: "Pedidos", icon: <FiShoppingBag /> },
  { id: "faturamento", label: "Faturamento", icon: <FiBarChart2 /> },
  { id: "produtos", label: "Produtos", icon: <FiBox /> },
  { id: "promocoes", label: "Promoções", icon: <FiTag /> },
];

export default function Sidebar({ activePage, setActivePage, open, setOpen }) {
  return (
    <>
      {/* Sidebar fixa no desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-5 shadow-lg">
        <div className="text-2xl font-extrabold mb-8 bg-gradient-to-r from-rose-500 to-pink-400 bg-clip-text text-transparent">
          🍕 Pizzaria Admin
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition ${activePage === item.id
                  ? "bg-rose-600 text-white shadow"
                  : "hover:bg-slate-700/50"
                }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Sidebar móvel */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed md:hidden inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-5 shadow-xl"
      >
        <div className="text-2xl font-extrabold mb-8 bg-gradient-to-r from-rose-500 to-pink-400 bg-clip-text text-transparent">
          🍕 Pizzaria Admin
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                setOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition ${activePage === item.id
                  ? "bg-rose-600 text-white shadow"
                  : "hover:bg-slate-700/50"
                }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </motion.aside>

      {/* Overlay no mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        ></div>
      )}
    </>
  );
}
