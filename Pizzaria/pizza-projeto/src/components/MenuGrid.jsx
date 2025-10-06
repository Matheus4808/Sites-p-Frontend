import React from "react";

export default function MenuGrid({ items, onSelectItem }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
        >
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-40 object-cover rounded-lg mb-3"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-sm text-slate-600">{item.desc}</p>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-lg font-bold text-rose-600">R$ 70,00</div>
            <button
              onClick={() => onSelectItem(item)}
              className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-lg"
            >
              Adicionar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
