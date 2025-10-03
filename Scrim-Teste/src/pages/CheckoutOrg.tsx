import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface LocationState {
  orgName: string;
  ownerName: string;
  contactNumber?: string;
  email: string;
  trainingHours: string[];
  instagram?: string;
  logoPreview?: string | null;
  pixCode: string;        // PIX gerado pelo backend
  qrCodeBase64: string;   // QR Code em base64 gerado pelo backend
}

const CheckoutOrg: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <p>Ops! Nenhum dado da organização foi fornecido. Volte e tente novamente.</p>
      </div>
    );
  }

  const handleConfirmPayment = () => setPaymentConfirmed(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 p-4">
      <motion.div
        className="bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-2xl w-full flex flex-col gap-6 text-white"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {!paymentConfirmed ? (
          <>
            <h1 className="text-3xl font-bold text-center mb-4">Pagamento PIX - R$100,00</h1>
            <p className="text-gray-400 text-center mb-6">
              Para finalizar o cadastro da sua organização, realize o pagamento via PIX abaixo:
            </p>

            {/* Resumo da Org */}
            <div className="bg-gray-700 rounded-xl p-4 flex gap-4 items-center">
              {state.logoPreview ? (
                <img
                  src={state.logoPreview}
                  alt="Logo"
                  className="w-20 h-20 rounded-xl object-cover shadow-md"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-600 flex items-center justify-center rounded-xl text-gray-300">
                  {state.orgName[0]}
                </div>
              )}
              <div>
                <h2 className="font-bold text-xl">{state.orgName}</h2>
                <p>Email: {state.email}</p>
                <p>Horários de treino: {state.trainingHours.join(", ")}</p>
              </div>
            </div>

            {/* QR Code PIX */}
            <div className="flex flex-col items-center gap-4 mt-6">
              <img
                src={`data:image/png;base64,${state.qrCodeBase64}`}
                alt="PIX QR Code"
                className="w-48 h-48"
              />
              <p className="text-gray-400 text-center">
                Código PIX: <span className="text-white font-bold">{state.pixCode}</span>
              </p>

              <motion.button
                onClick={handleConfirmPayment}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-bold shadow-md mt-4"
                whileHover={{ scale: 1.05 }}
              >
                Já realizei o pagamento
              </motion.button>
            </div>
          </>
        ) : (
          // Mensagem de sucesso
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center flex flex-col gap-4"
          >
            <h1 className="text-3xl font-bold text-green-400">Pagamento Recebido!</h1>
            <p className="text-gray-300">
              Seu pagamento foi enviado com sucesso! Dentro de até 5hrs, seu cadastro estará finalizado,
              e você poderá acessar o painel admin e criar seus treinos!
            </p>
            <p className="text-gray-400">
              Caso o tempo exceda e não tenha sido cadastrado, entre em contato pelo WhatsApp:
              <a
                href="https://wa.me/+5538998831854"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 ml-1 underline"
              >
                wa.me/+5538998831854
              </a>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CheckoutOrg;
