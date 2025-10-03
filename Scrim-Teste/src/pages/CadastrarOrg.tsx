import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CadastrarOrg: React.FC = () => {
    return (
        <div className="text-gray-100 p-6 max-w-6xl mx-auto">
            {/* Hero */}
            <motion.section
                className="text-center py-16 bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                    ⚔️ Cadastre sua Organização e leve seus treinos ao próximo nível
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                    Torne sua organização mais profissional com suporte completo, controle de scrims e relatórios detalhados.
                </p>
            </motion.section>

            {/* Como funciona */}
            <motion.section
                className="mt-12 grid md:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {[
                    {
                        title: "💰 Mensalidade",
                        desc: "Tenha acesso completo às ferramentas por apenas R$49,90/mês. Sem taxas escondidas e sem surpresas.",
                    },
                    {
                        title: "🛠 Suporte Premium",
                        desc: "Nossa equipe acompanha sua organização em tempo real, auxiliando na criação de scrims e torneios.",
                    },
                    {
                        title: "📈 Vantagens Competitivas",
                        desc: "Controle total dos treinos, ranking atualizado, relatórios de performance e destaques MVPs da sua line.",
                    },
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                    >
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-gray-400">{item.desc}</p>
                    </motion.div>
                ))}
            </motion.section>

            {/* CTA */}
            <motion.section
                className="text-center mt-16 py-12 bg-gray-800 rounded-xl shadow-lg"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-2xl font-bold mb-4">
                    🚀 Pronto para registrar sua organização?
                </h2>
                <motion.div whileHover={{ scale: 1.05 }}>
                    <Link
                        to="/cadastrar-org-form"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
                    >
                        Cadastrar minha ORG
                    </Link>
                </motion.div>
            </motion.section>
        </div>
    );
};

export default CadastrarOrg;
