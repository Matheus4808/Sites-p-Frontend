import React from 'react';

const About: React.FC = () => {
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-white px-6">
      <div className="max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Sobre este Projeto</h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Este projeto foi criado com <strong>React + Vite + TypeScript</strong>, utilizando <strong>Tailwind CSS</strong> para um visual limpo e moderno. É uma base sólida para qualquer aplicação web.
        </p>
      </div>
    </section>
  );
};

export default About;
