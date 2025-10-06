import React from "react";

export default function Footer() {
  return (
    <footer className="mt-8 text-center text-sm text-slate-500 py-4">
      © {new Date().getFullYear()} Pizzaria Sabor da Vila — Feito com 🍕 e ❤️.
    </footer>
  );
}
