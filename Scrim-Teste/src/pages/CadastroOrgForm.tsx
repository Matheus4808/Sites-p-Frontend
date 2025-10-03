import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaInstagram } from "react-icons/fa";

const CadastroOrgForm: React.FC = () => {
  const navigate = useNavigate();

  const [orgName, setOrgName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [trainingHours, setTrainingHours] = useState<string[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [instagram, setInstagram] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrainingHourChange = (hour: string) => {
    setTrainingHours((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour]
    );
  };

  const handleLogoChange = (file: File) => {
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (email !== confirmEmail) return setError("Emails não coincidem");
    if (password !== confirmPassword) return setError("Senhas não coincidem");
    if (!orgName || !ownerName || !email || !password) return setError("Preencha todos os campos obrigatórios");

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("org_name", orgName);
      formData.append("owner_name", ownerName);
      formData.append("contact_number", contactNumber);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("training_hours", JSON.stringify(trainingHours));
      formData.append("instagram", instagram);
      if (logo) formData.append("logo_file", logo);

      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao cadastrar a organização");
        setLoading(false);
        return;
      }

      // Redireciona para Checkout
      navigate("/checkout-org", {
        state: {
          orgName,
          ownerName,
          contactNumber,
          email,
          trainingHours,
          instagram,
          logoPreview,
          pixCode: data.pix_code,        // PIX gerado pelo backend
          qrCodeBase64: data.qr_code_base64, // QR code em base64
        },
      });
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "bg-gray-700 text-white p-4 rounded-xl w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-inner pl-12";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 p-4">
      <motion.form
        onSubmit={handleSubmit}
        className="relative bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-2xl w-full flex flex-col gap-6 overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-center mb-2 text-white">Cadastrar Organização</h1>
        <p className="text-gray-400 text-center mb-6">
          Complete os campos para registrar sua organização na plataforma.
        </p>

        {error && <p className="text-red-500 text-center font-semibold">{error}</p>}

        {/* Inputs */}
        <div className="relative">
          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Nome da Organização" value={orgName} onChange={(e) => setOrgName(e.target.value)} className={inputClasses} />
        </div>

        <div className="relative">
          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Nome do Dono" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className={inputClasses} />
        </div>

        <div className="relative">
          <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Número de Contato" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className={inputClasses} />
        </div>

        <div className="relative">
          <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} />
        </div>

        <div className="relative">
          <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="email" placeholder="Confirmar Email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} className={inputClasses} />
        </div>

        <div className="relative">
          <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses} />
        </div>

        <div className="relative">
          <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="password" placeholder="Confirmar Senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClasses} />
        </div>

        <div className="relative">
          <FaInstagram className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Instagram da Organização" value={instagram} onChange={(e) => setInstagram(e.target.value)} className={inputClasses} />
        </div>

        {/* Horários de Treino */}
        <div className="flex gap-4 mt-2">
          {["15h", "19h", "22h"].map((hour) => (
            <label key={hour} className={`flex-1 p-3 text-center rounded-xl cursor-pointer transition ${trainingHours.includes(hour) ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"} hover:bg-blue-500`}>
              <input type="checkbox" className="hidden" checked={trainingHours.includes(hour)} onChange={() => handleTrainingHourChange(hour)} />
              {hour}
            </label>
          ))}
        </div>

        {/* Logo */}
        <label className="flex flex-col gap-2 bg-gray-700 p-4 rounded-xl cursor-pointer text-gray-300 hover:bg-gray-600 transition">
          Upload Logo (opcional)
          <input type="file" onChange={(e) => e.target.files && handleLogoChange(e.target.files[0])} className="hidden" />
          {logoPreview && <img src={logoPreview} alt="Preview Logo" className="mt-2 w-24 h-24 object-cover rounded-xl shadow-md" />}
        </label>

        {/* Botão */}
        <motion.button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg transition text-lg" whileHover={{ scale: 1.05 }}>
          {loading ? "Cadastrando..." : "Cadastrar minha ORG"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default CadastroOrgForm;
