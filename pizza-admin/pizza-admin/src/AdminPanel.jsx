import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./components/admin/Sidebar";
import Header from "./components/admin/Header";
import Home from "./components/admin/Home";
import Pedidos from "./components/admin/Pedidos";
import Faturamento from "./components/admin/Faturamento";
import Produtos from "./components/admin/Produtos";
import Promocoes from "./components/admin/Promocoes";

export default function AdminPanel() {
  const [activePage, setActivePage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "pedidos":
        return <Pedidos />;
      case "faturamento":
        return <Faturamento />;
      case "produtos":
        return <Produtos />;
      case "promocoes":
        return <Promocoes />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-800">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        open={menuOpen}
        setOpen={setMenuOpen}
      />

      {/* Área principal */}
      <div className="flex flex-col flex-1 min-h-screen">
        <Header toggleMenu={() => setMenuOpen(!menuOpen)} />

        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="max-w-6xl mx-auto w-full"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="text-center text-xs sm:text-sm text-slate-500 py-4 border-t border-slate-200">
          © {new Date().getFullYear()} Painel da Pizzaria — Desenvolvido com ❤️
        </footer>
      </div>
    </div>
  );
}
