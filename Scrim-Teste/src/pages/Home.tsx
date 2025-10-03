import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaUsers, FaChartLine, FaRocket, FaQuestionCircle } from "react-icons/fa";

const Home: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Configuração de partículas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: { x: number; y: number; dx: number; dy: number; radius: number }[] = [];
    const particleCount = 80;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.7;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Inicializa partículas
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      dx: (Math.random() - 0.5) * 1.2, // velocidade horizontal
      dy: (Math.random() - 0.5) * 1.2, // velocidade vertical
      radius: Math.random() * 4 + 1,
    }));

    // Interação com mouse
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;

        // Rebate nas bordas
        if (p.x < 0 || p.x > canvas.width) p.dx = -p.dx;
        if (p.y < 0 || p.y > canvas.height) p.dy = -p.dy;

        // Desenha partículas
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59, 130, 246, 0.6)";
        ctx.fill();

        // Linha entre partículas próximas
        particles.forEach(other => {
          const distance = Math.hypot(p.x - other.x, p.y - other.y);
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59,130,246,${1 - distance / 100})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        // Linha para o mouse
        const mouseDist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (mouseDist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59,130,246,${1 - mouseDist / 120})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const faqs = [
    { question: "Como cadastrar minha organização?", answer: "Clique em 'Cadastrar minha ORG', preencha os dados da sua organização e comece a organizar suas scrims rapidamente." },
    { question: "O serviço é pago, e qual a mensalidade?", answer: "Sim o nosso serviço é pago, mas é super acessivel! O cadasro da org, você paga apenas R$74,90, você estará pagando para registrar os times colab no seu painel admin e o cadastro da sua organização! A mensalidade é apenas R$29,90/mês." },
    { question: "É possível organizar partidas diarios e semanais?", answer: "Sim, você pode agendar partidas diárias ou semanais, acompanhar resultados e gerenciar todos os times facilmente." },
  ];

  return (
    <div className="text-gray-100 font-sans antialiased">
      {/* Hero Section */}
      <motion.section className="relative overflow-hidden px-4 py-20 md:py-32 text-center rounded-2xl shadow-2xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}>
        <canvas ref={canvasRef} className="absolute inset-0 -z-10" />

        <motion.h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-white relative z-10"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}>
          Organize suas Scrims de PUBG MOBILE com Profissionalismo
        </motion.h1>
        <motion.p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}>
          Centralize treinos, cadastre times, acompanhe calendários e torne sua organização mais eficiente e impactante.
        </motion.p>
        <motion.div whileHover={{ scale: 1.05 }} className="relative z-10">
          <Link to="/cadastrar-org" className="bg-white hover:bg-gray-200 text-gray-900 px-8 py-4 rounded-xl font-semibold shadow-lg transition">
            Trazer minha ORG
          </Link>
        </motion.div>
      </motion.section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 mt-16 px-4 md:px-16">
        {[
          { icon: <FaCalendarAlt className="text-4xl text-blue-500 mb-4" />, title: "Calendário Automático", desc: "Organize partidas sem perder prazos." },
          { icon: <FaUsers className="text-4xl text-green-500 mb-4" />, title: "Gestão de Times", desc: "Cadastre times, convide jogadores e mantenha tudo sob controle." },
          { icon: <FaChartLine className="text-4xl text-yellow-400 mb-4" />, title: "Painel de Performance", desc: "Tenha insights claros sobre treinos e acompanhe evolução da sua line." },
        ].map((item, idx) => (
          <motion.div key={idx} className="bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.2, duration: 0.7 }}
            whileHover={{ scale: 1.05 }}>
            {item.icon}
            <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
            <p className="text-gray-300">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* CTA */}
      <motion.section className="mt-20 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl shadow-2xl p-12 text-center mx-4 md:mx-16"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">Traga seus treinos para o nosso site</h2>
        <p className="text-gray-200 max-w-3xl mx-auto mb-8">Cadastre sua organização, adicione seus times e acompanhe todas as scrims em um único lugar.</p>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link to="/cadastrar-org" className="bg-white hover:bg-gray-200 text-gray-900 px-8 py-4 rounded-xl font-semibold shadow-lg transition">
            Começar agora
          </Link>
        </motion.div>
      </motion.section>

      {/* FAQ */}
      <section className="mt-20 max-w-5xl mx-auto px-4 md:px-0">
        <h2 className="text-3xl font-bold mb-10 text-center flex items-center justify-center gap-2"><FaQuestionCircle className="text-blue-500" /> Perguntas Frequentes</h2>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <motion.div key={idx} className="bg-gray-900 p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.2, duration: 0.6 }}>
              <h3 className="font-semibold text-xl mb-2">{faq.question}</h3>
              <p className="text-gray-300">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <motion.section className="text-center mt-20 py-12 bg-gray-900 rounded-2xl shadow-2xl mx-4 md:mx-16"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-2"><FaRocket className="text-yellow-400" /> Pronto para elevar sua organização?</h2>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link to="/cadastrar-org" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition">
            Cadastrar minha ORG
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Home;
