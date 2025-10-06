import React from "react";

export default function TabsMenu({ activeTab, onTabChange }) {
  const tabs = [
    "Promoção",
    "Pizzas Tradicionais",
    "Pizzas Especiais",
    "Bebidas",
  ];

  return (
    <div className="flex gap-3 mb-6 justify-center flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 rounded-full transition ${
            activeTab === tab
              ? "bg-rose-500 text-white shadow"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
