import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

interface Organization {
  org_name: string;
  owner_name: string;
  contact_number: string;
  email: string;
  password: string;
  training_hours: string[];
  instagram: string;
  logo_path?: string;
}

const EditarOrg: React.FC = () => {
  const { user } = useAuth();
  const [org, setOrg] = useState<Organization>({
    org_name: "",
    owner_name: "",
    contact_number: "",
    email: "",
    password: "",
    training_hours: [],
    instagram: "",
    logo_path: "",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [passwordStrength, setPasswordStrength] = useState("");

  // 🔄 Buscar dados da org no backend e popular formulário
  useEffect(() => {
    const fetchOrg = async () => {
      if (!user?.id) return;
      try {
        const { data } = await axios.get(
          `https://backend-p-scrim.onrender.com/api/organizations/${user.id}`
        );

        setOrg({
          ...data,
          training_hours: data.training_hours
            ? data.training_hours.split(",") // transforma string em array
            : [],
        });

        if (data.logo_path) {
          setLogoPreview(`https://backend-p-scrim.onrender.com/${data.logo_path}`);
        }
      } catch (err) {
        console.error("Erro ao carregar organização:", err);
      }
    };

    fetchOrg();
  }, [user]);

  const handleChange = (field: keyof Organization, value: string) => {
    setOrg({ ...org, [field]: value });
  };

  // Upload da logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Checar força da senha
  const checkPasswordStrength = (password: string) => {
    let strength = "Fraca";
    if (password.length > 6 && /[A-Z]/.test(password) && /\d/.test(password)) {
      strength = "Média";
    }
    if (
      password.length > 8 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    ) {
      strength = "Forte";
    }
    setPasswordStrength(strength);
  };

  const handleTrainingHourChange = (hour: string) => {
    setOrg((prev) => {
      const updated = prev.training_hours.includes(hour)
        ? prev.training_hours.filter((h) => h !== hour)
        : [...prev.training_hours, hour];
      return { ...prev, training_hours: updated };
    });
  };

  const handleSave = async () => {
    try {
      if (!user?.id) {
        alert("Usuário não autenticado!");
        return;
      }

      const formData = new FormData();
      formData.append("org_name", org.org_name);
      formData.append("owner_name", org.owner_name);
      formData.append("contact_number", org.contact_number);
      formData.append("email", org.email);
      if (org.password) formData.append("password", org.password);
      formData.append("training_hours", JSON.stringify(org.training_hours));
      formData.append("instagram", org.instagram);
      if (logoFile) formData.append("logo_file", logoFile);

      await axios.put(
        `https://backend-p-scrim.onrender.com/api/organizations/${user.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Informações da organização atualizadas!");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar organização");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Organização</h1>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col">
          Nome da Organização:
          <input
            type="text"
            value={org.org_name}
            onChange={(e) => handleChange("org_name", e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          />
        </label>

        <label className="flex flex-col">
          Nome do Dono:
          <input
            type="text"
            value={org.owner_name}
            onChange={(e) => handleChange("owner_name", e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          />
        </label>

        {/* Upload da logo */}
        <label className="flex flex-col">
          Logo:
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="p-2 rounded bg-gray-700 text-white"
          />
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Prévia da logo"
              className="w-24 h-24 mt-2 rounded object-cover border"
            />
          )}
        </label>

        <label className="flex flex-col">
          E-mail de Contato:
          <input
            type="email"
            value={org.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          />
        </label>

        {/* Senha + nível */}
        <label className="flex flex-col">
          Senha do Painel:
          <input
            type="password"
            value={org.password}
            onChange={(e) => {
              handleChange("password", e.target.value);
              checkPasswordStrength(e.target.value);
            }}
            className="p-2 rounded bg-gray-700 text-white"
          />
          {org.password && (
            <span
              className={`mt-1 text-sm ${passwordStrength === "Fraca"
                  ? "text-red-400"
                  : passwordStrength === "Média"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
            >
              Força da senha: {passwordStrength}
            </span>
          )}
        </label>

        {/* Horários de Treino */}
        <div className="flex gap-4 mt-2">
          {["15h", "19h", "22h"].map((hour) => (
            <label
              key={hour}
              className={`flex-1 p-3 text-center rounded-xl cursor-pointer transition ${org.training_hours.includes(hour)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300"
                } hover:bg-blue-500`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={org.training_hours.includes(hour)}
                onChange={() => handleTrainingHourChange(hour)}
              />
              {hour}
            </label>
          ))}
        </div>

        <label className="flex flex-col">
          Número de Contato:
          <input
            type="text"
            value={org.contact_number}
            onChange={(e) => handleChange("contact_number", e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          />
        </label>

        <label className="flex flex-col">
          Instagram (opcional):
          <input
            type="text"
            value={org.instagram}
            onChange={(e) => handleChange("instagram", e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          />
        </label>

        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold mt-4"
          onClick={handleSave}
        >
          Salvar Informações
        </button>
      </div>
    </div>
  );
};

export default EditarOrg;
