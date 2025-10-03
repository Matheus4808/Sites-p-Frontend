// src/pages/RegistrarTorneio.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Team {
  id: number;
  name: string;
  logo?: string;
  manager?: string;
  ceo?: string;
  players?: string[]; // lista simples de nomes
  totalPoints?: number;
}

interface MVP {
  name: string;
  team: string;
  kills: number;
}

interface Tournament {
  id: number;
  name: string;
  startDate: string;
  format: "20" | "24" | "32";
  teams?: Team[];
  organizerId?: number;
}

type View = "list" | "times" | "quedas" | "edit";

const RegistrarTorneio: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("list");
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  // TIMES
  const [teams, setTeams] = useState<Team[]>([]);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamForm, setTeamForm] = useState<Partial<Team & { playersRaw?: string }>>({});

  // QUEDAS
  const [activeTab, setActiveTab] = useState<string>("");
  // points[roundKey][teamId] => number
  const [points, setPoints] = useState<Record<string, Record<number, number>>>({});
  // mvps[roundKey] = MVP[]
  const [mvps, setMvps] = useState<Record<string, MVP[]>>({});

  useEffect(() => {
    fetchTournaments();
  }, []);

  async function fetchTournaments() {
    try {
      const res = await axios.get("/api/tournaments");
      setTournaments(res.data.tournaments || []);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar torneios:", err);
      setLoading(false);
    }
  }

  // fetch teams for selected tournament
  async function fetchTeams(tournamentId: number) {
    try {
      const res = await axios.get(`/api/tournaments/${tournamentId}/teams`);
      setTeams(res.data || []);
    } catch (err) {
      console.error("Erro ao buscar times:", err);
    }
  }

  function openView(t: Tournament, v: View) {
    setSelectedTournament(t);
    setView(v);
    if (v === "times") {
      fetchTeams(t.id);
    }
    if (v === "quedas") {
      // prepare tabs and state
      const tabs = getTabsByFormat(t.format);
      setActiveTab((prev) => prev || tabs[0]);
      // load existing matches if exist (optional)
      fetchRoundsState(t.id).catch(() => { });
    }
  }

  function goBack() {
    setSelectedTournament(null);
    setView("list");
    setTeams([]);
    setPoints({});
    setMvps({});
    setTeamForm({});
  }

  // ------------------ UTILS: abas e rodadas ------------------
  const getTabsByFormat = (format: Tournament["format"]) => {
    if (format === "20") return ["Final"];
    if (format === "24") return ["Semifinal", "Final"];
    if (format === "32") return ["Semifinal A", "Semifinal B", "Final"];
    return [];
  };

  const getRoundsByTab = (format: Tournament["format"], tab: string) => {
    if (format === "20" && tab === "Final") return ["Queda 1", "Queda 2", "Queda 3", "Queda 4"];
    if (format === "24" && tab === "Semifinal")
      return ["AxB", "BxC", "AxC", "BxC", "AxB", "CxA"];
    if (format === "24" && tab === "Final")
      return ["Final - Queda 1", "Final - Queda 2", "Final - Queda 3", "Final - Queda 4"];
    if (format === "32" && (tab === "Semifinal A" || tab === "Semifinal B"))
      return ["Queda 1", "Queda 2", "Queda 3", "Queda 4"];
    if (format === "32" && tab === "Final")
      return ["Final - Queda 1", "Final - Queda 2", "Final - Queda 3", "Final - Queda 4"];
    return [];
  };

  // key helper for a round: e.g. `${tab}::${roundIndex}` or `${tab}::AxB`
  const roundKey = (tab: string, round: string) => `${tab}::${round}`;

  // ------------------ TIMES: cadastrar time ------------------
  function openTeamModal() {
    setTeamForm({ playersRaw: "" });
    setShowTeamModal(true);
  }

  function handleTeamFormChange<K extends keyof typeof teamForm>(
    field: K,
    value: any
  ) {
    setTeamForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submitTeam() {
    if (!selectedTournament) return alert("Torneio não selecionado");
    const playersRaw = (teamForm.playersRaw || "") as string;
    const players = playersRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: teamForm.name,
      logo: teamForm.logo,
      manager: teamForm.manager,
      ceo: teamForm.ceo,
      players,
    };

    try {
      const res = await axios.post(`/api/tournaments/${selectedTournament.id}/teams`, payload);
      // atualiza listagem local
      setTeams((prev) => [...prev, res.data]);
      setShowTeamModal(false);
      setTeamForm({});
    } catch (err) {
      console.error("Erro ao criar time:", err);
      alert("Erro ao criar time");
    }
  }

  // ------------------ QUEDAS: carregar estado salvo (opcional) ------------------
  async function fetchRoundsState(tournamentId: number) {
    try {
      const res = await axios.get(`/api/tournaments/${tournamentId}/matches`);
      // res.data expected to be [{ tab, round, points: {teamId: pts}, mvps: [{...}] }, ...]
      const saved: any[] = res.data || [];
      const p: Record<string, Record<number, number>> = {};
      const m: Record<string, MVP[]> = {};
      saved.forEach((entry) => {
        const k = roundKey(entry.tab, entry.round);
        p[k] = entry.points || {};
        m[k] = entry.mvps || [];
      });
      setPoints(p);
      setMvps(m);
    } catch (err) {
      // não crítico
    }
  }

  function handlePointChange(teamId: number, key: string, value: number) {
    setPoints((prev) => {
      const copy = { ...prev };
      copy[key] = { ...(copy[key] || {}), [teamId]: value };
      return copy;
    });
  }

  function handleMVPChange(key: string, index: number, field: keyof MVP, value: any) {
    setMvps((prev) => {
      const copy = { ...prev };
      const arr = copy[key] ? [...copy[key]] : [{ name: "", team: "", kills: 0 }, { name: "", team: "", kills: 0 }, { name: "", team: "", kills: 0 }];
      arr[index] = { ...arr[index], [field]: value };
      copy[key] = arr;
      return copy;
    });
  }

  // ------------------ CLASSIFICAÇÃO (logica automática) ------------------
  // dividir em N grupos de forma simples (assume teams array já ordenado por id ou pré-organizado)
  function dividirEmGrupos(times: Team[], qtdGrupos: number) {
    const tamanho = Math.floor(times.length / qtdGrupos);
    const grupos: Team[][] = [];
    for (let i = 0; i < qtdGrupos; i++) {
      grupos.push(times.slice(i * tamanho, (i + 1) * tamanho));
    }
    return grupos;
  }

  // calcular classificação por grupo usando points acumulados na semifinal.
  // Observe: para cada grupo, pontos devem ser calculados a partir das entradas de rounds correspondentes.
  // Aqui faremos uma abordagem simples: somar os pontos do objeto `points` (keys correspondentes aos rounds da semifinal).
  function calcularTopPorGrupos(format: Tournament["format"]) {
    if (!selectedTournament || !selectedTournament.teams) return [];

    if (format === "24") {
      // 3 grupos de 8 (assumimos que selectedTournament.teams esteja em ordem A[0..7],B[8..15],C[16..23])
      const grupos = dividirEmGrupos(selectedTournament.teams, 3);
      const classificados: Team[] = [];

      grupos.forEach((grupo) => {
        // para cada time no grupo, somar todos os pontos de rounds que pertencem à Semifinal (todas as keys com "Semifinal::")
        const lista = grupo.map((t) => {
          let sum = 0;
          Object.keys(points).forEach((k) => {
            if (k.startsWith("Semifinal::")) {
              sum += (points[k]?.[t.id] || 0);
            }
          });
          return { team: t, sum };
        });
        // ordenar
        lista.sort((a, b) => b.sum - a.sum);
        // pegar top6
        lista.slice(0, 6).forEach((x) => {
          classificados.push({ ...x.team, totalPoints: 0 });
        });
      });

      return classificados;
    }

    if (format === "32") {
      // 2 grupos de 16
      const grupos = dividirEmGrupos(selectedTournament.teams, 2);
      const classificados: Team[] = [];

      grupos.forEach((grupo) => {
        const lista = grupo.map((t) => {
          let sum = 0;
          Object.keys(points).forEach((k) => {
            // Semifinal A::... or Semifinal B::...
            if (k.startsWith("Semifinal")) {
              sum += (points[k]?.[t.id] || 0);
            }
          });
          return { team: t, sum };
        });
        lista.sort((a, b) => b.sum - a.sum);
        lista.slice(0, 8).forEach((x) => {
          classificados.push({ ...x.team, totalPoints: 0 });
        });
      });

      return classificados;
    }

    // format 20 não faz classificação; já é final
    return [];
  }

  // ------------------ SALVAR QUEDA (backend) ------------------
  async function saveRound(tab: string, round: string) {
    if (!selectedTournament) return alert("Torneio não selecionado");
    const key = roundKey(tab, round);
    const payload = {
      tab,
      round,
      points: points[key] || {},
      mvps: mvps[key] || [],
    };

    try {
      await axios.post(`/api/tournaments/${selectedTournament.id}/matches`, payload);
      alert("Resultado salvo.");

      // se esse save é o fim da Semifinal e precisa classificar → chamar classify endpoint
      if (selectedTournament.format === "24" && tab === "Semifinal") {
        // ao salvar a última rodada (por simplicidade chamaremos classificação manualmente aqui)
        // alternativa: backend poderia decidir quando chamar classificação automaticamente
        const classificados = calcularTopPorGrupos("24");
        await axios.post(`/api/tournaments/${selectedTournament.id}/classify`, { classifiedTeams: classificados });
        // atualizar times locais
        setTeams(classificados);
        // ir para aba Final
        setActiveTab("Final");
        alert("Classificação realizada: final definida.");
      }

      if (selectedTournament.format === "32" && (tab === "Semifinal A" || tab === "Semifinal B")) {
        // Só classificar quando ambas semifinais estiverem finalizadas. Para simplicidade chamamos classificação sempre
        const classificados = calcularTopPorGrupos("32");
        await axios.post(`/api/tournaments/${selectedTournament.id}/classify`, { classifiedTeams: classificados });
        setTeams(classificados);
        setActiveTab("Final");
        alert("Classificação realizada: final definida.");
      }

      // atualiza estado salvo local se quiser recarregar
    } catch (err) {
      console.error("Erro ao salvar rodada:", err);
      alert("Erro ao salvar rodada");
    }
  }

  // ------------------ UI ------------------
  if (loading) return <p>Carregando torneios...</p>;

  return (
    <div className="p-6">
      {/* LISTA */}
      {view === "list" && (
        <>
          <h1 className="text-2xl font-bold mb-6">Meus Torneios</h1>
          {tournaments.length === 0 ? (
            <p>Você ainda não criou nenhum torneio.</p>
          ) : (
            <div className="space-y-4">
              {tournaments.map((t) => (
                <div key={t.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h2 className="font-bold">{t.name}</h2>
                    <p className="text-gray-300">Data de início: {new Date(t.startDate).toLocaleDateString()}</p>
                  </div>

                  <div className="flex gap-2">
                    <button className="bg-blue-600 px-3 py-1 rounded text-white" onClick={() => openView(t, "quedas")}>Registrar Quedas</button>
                    <button className="bg-green-600 px-3 py-1 rounded text-white" onClick={() => openView(t, "times")}>Cadastrar Times</button>
                    <button className="bg-yellow-600 px-3 py-1 rounded text-white" onClick={() => openView(t, "edit")}>Editar Torneio</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TIMES */}
      {view === "times" && selectedTournament && (
        <div>
          <h2 className="text-xl font-bold mb-4">Times do Torneio: {selectedTournament.name}</h2>

          <div className="space-y-2 mb-6">
            {teams.length === 0 ? <p>Nenhum time cadastrado.</p> : (
              <table className="w-full text-left">
                <thead>
                  <tr><th>Logo</th><th>Nome</th><th>Manager</th><th>CEO</th><th>Players</th></tr>
                </thead>
                <tbody>
                  {teams.map(t => (
                    <tr key={t.id} className="border-b">
                      <td className="p-2"><img src={t.logo} alt={t.name} style={{ width: 48, height: 48, objectFit: "cover" }} /></td>
                      <td className="p-2">{t.name}</td>
                      <td className="p-2">{t.manager}</td>
                      <td className="p-2">{t.ceo}</td>
                      <td className="p-2">{(t.players || []).join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <button className="fixed bottom-6 right-6 bg-green-600 px-4 py-2 rounded-full text-white" onClick={openTeamModal}>Registrar Time</button>

          <button className="mt-4 bg-gray-600 px-3 py-1 rounded text-white" onClick={goBack}>Voltar</button>

          {/* Team Modal */}
          {showTeamModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50">
              <div className="bg-white p-4 rounded w-96">
                <h3 className="font-bold mb-2">Registrar Time</h3>
                <input placeholder="Nome" className="w-full p-2 mb-2" value={teamForm.name || ""} onChange={e => handleTeamFormChange("name", e.target.value)} />
                <input placeholder="Logo URL" className="w-full p-2 mb-2" value={teamForm.logo || ""} onChange={e => handleTeamFormChange("logo", e.target.value)} />
                <input placeholder="Manager" className="w-full p-2 mb-2" value={teamForm.manager || ""} onChange={e => handleTeamFormChange("manager", e.target.value)} />
                <input placeholder="CEO" className="w-full p-2 mb-2" value={teamForm.ceo || ""} onChange={e => handleTeamFormChange("ceo", e.target.value)} />
                <textarea placeholder="Jogadores (separar por vírgula)" className="w-full p-2 mb-2" value={teamForm.playersRaw || ""} onChange={e => handleTeamFormChange("playersRaw", e.target.value)} />
                <div className="flex gap-2 justify-end">
                  <button className="px-3 py-1" onClick={() => setShowTeamModal(false)}>Cancelar</button>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={submitTeam}>Salvar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* QUEDAS */}
      {view === "quedas" && selectedTournament && (
        <div>
          <h2 className="text-xl font-bold mb-4">Registrar Quedas - {selectedTournament.name}</h2>

          {/* Abas */}
          <div className="flex gap-2 mb-4">
            {getTabsByFormat(selectedTournament.format).map(tab => (
              <button key={tab} className={`px-4 py-2 rounded ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setActiveTab(tab)}>{tab}</button>
            ))}
          </div>

          {/* Rodadas */}
          {getRoundsByTab(selectedTournament.format, activeTab).map((round, idx) => {
            const key = roundKey(activeTab, round);
            return (
              <div key={key} className="bg-gray-100 p-4 rounded mb-4">
                <h3 className="font-bold mb-2">{round}</h3>

                <div className="overflow-x-auto mb-3">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2">#</th>
                        <th className="p-2">Equipe</th>
                        <th className="p-2">Pontos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(teams || []).map((team, i) => (
                        <tr key={team.id} className="border-b">
                          <td className="p-2">{i + 1}</td>
                          <td className="p-2">{team.name}</td>
                          <td className="p-2">
                            <input type="number" value={points[key]?.[team.id] ?? ""} onChange={(e) => handlePointChange(team.id, key, Number(e.target.value) || 0)} className="w-20 p-1" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 className="font-bold mb-2">Top 3 MVPs</h4>
                  {(mvps[key] || [{ name: "", team: "", kills: 0 }, { name: "", team: "", kills: 0 }, { name: "", team: "", kills: 0 }]).map((m, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input placeholder="Nome" value={mvps[key]?.[i]?.name ?? ""} onChange={(e) => handleMVPChange(key, i, "name", e.target.value)} className="p-1 w-40" />
                      <input placeholder="Equipe" value={mvps[key]?.[i]?.team ?? ""} onChange={(e) => handleMVPChange(key, i, "team", e.target.value)} className="p-1 w-32" />
                      <input placeholder="Kills" type="number" value={mvps[key]?.[i]?.kills ?? 0} onChange={(e) => handleMVPChange(key, i, "kills", Number(e.target.value) || 0)} className="p-1 w-20" />
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-3">
                  <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => saveRound(activeTab, round)}>Salvar Rodada</button>
                </div>
              </div>
            );
          })}

          <button className="mt-4 bg-gray-600 px-3 py-1 rounded text-white" onClick={goBack}>Voltar</button>
        </div>
      )}

      {/* EDIT */}
      {view === "edit" && selectedTournament && (
        <div>
          <h2 className="text-xl font-bold mb-4">Editando Torneio: {selectedTournament.name}</h2>
          <form className="space-y-3">
            <input type="text" defaultValue={selectedTournament.name} className="w-full p-2 rounded" />
            <input type="date" defaultValue={selectedTournament.startDate.split("T")[0]} className="w-full p-2 rounded" />
            {/* demais campos... */}
            <div className="flex gap-2">
              <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded" onClick={async () => {
                // Exemplo de PUT (implemente formulário real)
                try {
                  await axios.put(`/api/tournaments/${selectedTournament.id}`, { name: selectedTournament.name });
                  alert("Salvo");
                } catch (e) { console.error(e); alert("Erro"); }
              }}>Salvar</button>
              <button type="button" className="bg-gray-600 px-4 py-2 rounded" onClick={goBack}>Voltar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RegistrarTorneio;
