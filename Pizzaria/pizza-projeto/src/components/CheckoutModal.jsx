import React, { useState } from "react";
import { FiX } from "react-icons/fi";

export default function CheckoutModal({ open, onClose, cartItems, total }) {
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    phone: "",
    payment: "dinheiro",
    change: ""
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    let message = `*Pedido Pizzaria*\n\n`;
    cartItems.forEach((item, idx) => {
      message += `${idx + 1}. ${item.name} - ${item.size || ""} - R$ ${item.price}\nObs: ${item.obs || "-" }\n`;
    });
    message += `\n*Total:* R$ ${total}\n`;
    message += `*Nome:* ${customer.name}\n*Endereço:* ${customer.address}\n*Telefone:* ${customer.phone}\n*Pagamento:* ${customer.payment}`;
    if (customer.payment === "dinheiro" && customer.change) {
      message += ` (Troco: R$ ${customer.change})`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5541999999999?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-11/12 max-w-md p-6 z-50">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-700">
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold text-rose-600 mb-4">Finalizar Pedido</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={customer.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="text"
            name="address"
            placeholder="Endereço para entrega"
            value={customer.address}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Telefone"
            value={customer.phone}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
          <select
            name="payment"
            value={customer.payment}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="dinheiro">Dinheiro</option>
            <option value="cartao">Cartão</option>
          </select>
          {customer.payment === "dinheiro" && (
            <input
              type="text"
              name="change"
              placeholder="Troco para (R$)"
              value={customer.change}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          )}

          <button
            onClick={handleSubmit}
            className="mt-4 w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-xl shadow transition-transform transform hover:scale-[1.02]"
          >
            Enviar Pedido para WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
