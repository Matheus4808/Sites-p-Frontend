import React from "react";

export default function ItemModal({ item, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-11/12 max-w-2xl p-6 z-50">
        <div className="flex gap-4">
          <img
            src={item.img}
            alt={item.name}
            className="w-36 h-36 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-rose-600">{item.name}</h3>
            <p className="text-slate-600">{item.desc}</p>

            <div className="mt-4">
              <label className="block text-sm font-medium">Tamanho</label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {["4 fatias", "8 fatias", "12 fatias"].map((size) => (
                  <div
                    key={size}
                    className="px-3 py-2 border rounded-lg cursor-pointer hover:border-rose-400"
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium">Observação</label>
              <textarea
                className="mt-1 w-full rounded-lg border p-2 text-sm"
                placeholder="Ex: sem cebola, extra queijo..."
              />
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border text-slate-600"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 rounded-lg bg-rose-500 text-white">
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
