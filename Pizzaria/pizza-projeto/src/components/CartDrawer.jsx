import React from "react";

export default function CartDrawer({ open, onClose, onCheckout }) {
    return (
        <div
            className={`fixed top-0 right-0 h-full z-50 transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
                }`}
        >
            <div className="w-96 bg-white h-full shadow-2xl p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Seu carrinho</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
                        Fechar ✕
                    </button>
                </div>

                <div className="flex-1 overflow-auto text-slate-700 space-y-4">
                    <div className="border-b pb-3">
                        <div className="font-semibold">Pizza Margherita (8 fatias)</div>
                        <div className="text-sm text-slate-500">Obs: sem cebola</div>
                        <div className="text-sm mt-1">R$ 70,00</div>
                    </div>
                </div>

                <div className="mt-6 border-t pt-4">
                    <div className="flex items-center justify-between font-bold">
                        <span>Total</span>
                        <span className="text-rose-600">R$ 70,00</span>
                    </div>
                    <button
                        onClick={onCheckout} // <<< aqui chamamos a função
                        className="w-full mt-4 bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg"
                    >
                        Finalizar pedido
                    </button>
                </div>
            </div>
        </div>
    );
}

