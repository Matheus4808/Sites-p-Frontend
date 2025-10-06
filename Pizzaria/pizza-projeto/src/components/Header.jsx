import React from "react";

export default function Header({ onCartClick, cartCount }) {
  return (
    <header className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
      <img
        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="logo"
        className="w-24 h-24 rounded-lg object-cover shadow"
      />

      <div className="flex-1 text-center md:text-left">
        <h1 className="text-2xl font-extrabold text-rose-600">
          Pizzaria Sabor da Vila
        </h1>
        <p className="text-slate-600">
          Seja bem-vindo! Peça online com rapidez e segurança.
        </p>
        <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-600">
          <div>📍 Rua Exemplo, 123 - Centro</div>
          <div>🚚 Frete: R$ 6,00</div>
          <div>⏰ Seg-Sab 18:00 - 23:30</div>
        </div>
      </div>

      <div>
        <button
          onClick={onCartClick}
          className="relative bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg shadow mt-4 md:mt-0"
        >
          Carrinho
          <span className="absolute -top-2 -right-2 bg-white text-rose-600 rounded-full w-6 h-6 flex items-center justify-center font-semibold text-xs">
            {cartCount}
          </span>
        </button>
      </div>
    </header>
  );
}
