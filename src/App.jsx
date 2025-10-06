import React, { useState } from "react";
import Header from "./components/Header";
import TabsMenu from "./components/TabsMenu";
import MenuGrid from "./components/MenuGrid";
import ItemModal from "./components/ItemModal";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import CheckoutModal from "./components/CheckoutModal";


const MOCK_MENU = {
  "Promoção": [
    {
      id: "p1",
      name: "Combo Família",
      desc: "2 pizzas médias + refri 2L",
      img: "https://plus.unsplash.com/premium_photo-1733306588881-0411931d4fed?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
  "Pizzas Tradicionais": [
    {
      id: "t1",
      name: "Margherita",
      desc: "Molho, mussarela e manjericão fresco",
      img: "https://plus.unsplash.com/premium_photo-1733266807710-f8f8de34416f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
  "Pizzas Especiais": [],
  "Bebidas": [],
};

export default function App() {
  const [activeTab, setActiveTab] = useState("Promoção");
  const [selectedItem, setSelectedItem] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    // Exemplo inicial (depois você vai salvar itens reais do carrinho)
    { name: "Pizza Margherita", size: "8 fatias", price: 70, obs: "sem cebola" }
  ]);
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  // no botão de finalizar pedido dentro do CartDrawer.jsx:
  // onClick={() => setCheckoutOpen(true)}

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-slate-900 font-sans p-4 sm:p-6">

      <Header onCartClick={() => setCartOpen(true)} cartCount={1} />

      <main className="max-w-5xl mx-auto mt-8 bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Cardápio</h2>
        <TabsMenu activeTab={activeTab} onTabChange={setActiveTab} />
        <MenuGrid
          items={MOCK_MENU[activeTab]}
          onSelectItem={(item) => setSelectedItem(item)}
        />
      </main>

      <Footer />

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => setCheckoutOpen(true)}
      />
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        total={total}
      />
    </div>


  );
}
