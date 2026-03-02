import { useEffect, useState, type FormEvent } from "react";
import {
  Clock,
  Plus,
  Trash2,
  Pencil,
  X,
  CalendarDays,
  Check,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import api from "../service/api";
import { toast } from "react-toastify";

interface Horario {
  id_horario: number;
  id_usuario: number | null;
  data_hora: string;
  disponivel: boolean;
}

type FilterType = "todos" | "disponivel" | "ocupado";

function Horarios() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("todos");
  const [search, setSearch] = useState("");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHorario, setEditingHorario] = useState<Horario | null>(null);
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formDisponivel, setFormDisponivel] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const token = localStorage.getItem("@barberpro:token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    loadHorarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadHorarios() {
    try {
      const res = await api.get("/horarios", { headers });
      setHorarios(res.data.data || res.data);
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      if (error?.response?.status === 404) {
        setHorarios([]);
      } else {
        toast.error("Erro ao carregar horários.");
      }
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingHorario(null);
    setFormDate("");
    setFormTime("");
    setFormDisponivel(true);
    setModalOpen(true);
  }

  function openEditModal(horario: Horario) {
    setEditingHorario(horario);
    const dt = new Date(horario.data_hora);
    setFormDate(dt.toISOString().split("T")[0]);
    setFormTime(
      dt.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    );
    setFormDisponivel(horario.disponivel);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingHorario(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!formDate || !formTime) {
      toast.warn("Preencha data e hora!");
      return;
    }

    const data_hora = `${formDate}T${formTime}:00`;

    setSubmitting(true);
    try {
      if (editingHorario) {
        await api.put(
          `/horario/${editingHorario.id_horario}`,
          { data_hora, disponivel: formDisponivel },
          { headers },
        );
        toast.success("Horário atualizado!");
      } else {
        await api.post(
          "/horario",
          { data_hora, disponivel: formDisponivel },
          { headers },
        );
        toast.success("Horário criado!");
      }
      closeModal();
      loadHorarios();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error?.response?.data?.message || "Erro ao salvar horário.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.delete(`/horario/${id}`, { headers });
      toast.success("Horário excluído!");
      setDeleteId(null);
      loadHorarios();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error?.response?.data?.message || "Erro ao excluir.";
      toast.error(msg);
    }
  }

  // Filtragem e busca
  const filtered = horarios
    .filter((h) => {
      if (filter === "disponivel") return h.disponivel;
      if (filter === "ocupado") return !h.disponivel;
      return true;
    })
    .filter((h) => {
      if (!search) return true;
      const dateStr = formatFullDate(h.data_hora).toLowerCase();
      return dateStr.includes(search.toLowerCase());
    })
    .sort(
      (a, b) =>
        new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime(),
    );

  // Métricas
  const totalHorarios = horarios.length;
  const disponiveis = horarios.filter((h) => h.disponivel).length;
  const ocupados = totalHorarios - disponiveis;

  function formatFullDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function isPast(dateStr: string) {
    return new Date(dateStr) < new Date();
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Carregando horários...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-page-in flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl">
      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-50 tracking-tight">
            Horários
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gerencie seus horários de atendimento
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98]"
        >
          <Plus size={18} />
          Novo horário
        </button>
      </div>

      {/* ===== Mini Métricas ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-50">{totalHorarios}</p>
            <p className="text-xs text-slate-500">Total</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-emerald-400">{disponiveis}</p>
            <p className="text-xs text-slate-500">Disponíveis</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-amber-500">{ocupados}</p>
            <p className="text-xs text-slate-500">Ocupados</p>
          </div>
        </div>
      </div>

      {/* ===== Barra de Busca + Filtros ===== */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Buscar por data..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-50 placeholder-slate-600 text-sm transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800/60 rounded-xl p-1">
          <Filter size={14} className="text-slate-500 ml-2 mr-1" />
          {(["todos", "disponivel", "ocupado"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f
                  ? "bg-amber-500/15 text-amber-500"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {f === "todos"
                ? "Todos"
                : f === "disponivel"
                  ? "Livres"
                  : "Ocupados"}
            </button>
          ))}
        </div>
      </div>

      {/* ===== Lista de Horários ===== */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-slate-800/80 rounded-2xl flex items-center justify-center mb-4">
            <CalendarDays className="w-7 h-7 text-slate-600" />
          </div>
          <p className="text-sm text-slate-500">Nenhum horário encontrado</p>
          <p className="text-xs text-slate-600 mt-1">
            Crie um novo horário clicando no botão acima
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl overflow-hidden">
          {/* Header da tabela */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-slate-800/60 text-xs font-medium text-slate-500 uppercase tracking-wider">
            <div className="col-span-4">Data</div>
            <div className="col-span-2">Hora</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3 text-right">Ações</div>
          </div>

          {/* Linhas */}
          <div className="divide-y divide-slate-800/40">
            {filtered.map((horario) => {
              const past = isPast(horario.data_hora);

              return (
                <div
                  key={horario.id_horario}
                  className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center px-5 py-4 hover:bg-slate-800/20 transition-colors ${
                    past ? "opacity-50" : ""
                  }`}
                >
                  {/* Data */}
                  <div className="sm:col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-800/80 rounded-lg flex items-center justify-center shrink-0">
                      <CalendarDays className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {formatFullDate(horario.data_hora)}
                      </p>
                      {past && (
                        <span className="text-[10px] text-red-400/70 font-medium uppercase tracking-wider">
                          Passado
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hora */}
                  <div className="sm:col-span-2">
                    <span className="text-sm font-semibold text-slate-50">
                      {formatTime(horario.data_hora)}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="sm:col-span-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        horario.disponivel
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          horario.disponivel ? "bg-emerald-400" : "bg-amber-500"
                        }`}
                      />
                      {horario.disponivel ? "Disponível" : "Ocupado"}
                    </span>
                  </div>

                  {/* Ações */}
                  <div className="sm:col-span-3 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(horario)}
                      className="p-2 rounded-lg text-slate-500 hover:text-amber-500 hover:bg-amber-500/5 transition-all"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteId(horario.id_horario)}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== Modal Criar/Editar ===== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-page-in bg-linear-to-b from-slate-800 to-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Faixa dourada */}
            <div className="h-1 bg-linear-to-r from-amber-500 via-amber-400 to-amber-500" />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-50 tracking-tight">
                    {editingHorario ? "Editar horário" : "Novo horário"}
                  </h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {editingHorario
                      ? "Altere os dados do horário"
                      : "Defina data, hora e disponibilidade"}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg p-1.5 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Data */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Data
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-50 transition-all"
                  />
                </div>

                {/* Hora */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-50 transition-all"
                  />
                </div>

                {/* Disponível toggle */}
                <div className="flex items-center justify-between py-3 px-4 bg-slate-900/50 rounded-xl border border-slate-700/40">
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      Disponível para reserva
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Clientes poderão agendar neste horário
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormDisponivel(!formDisponivel)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                      formDisponivel ? "bg-amber-500" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                        formDisponivel ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Botão Salvar */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? "Salvando..."
                    : editingHorario
                      ? "Salvar alterações"
                      : "Criar horário"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal Confirmar Exclusão ===== */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-page-in bg-linear-to-b from-slate-800 to-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-50 mb-1">
                Excluir horário?
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                Esta ação não pode ser desfeita. O horário será removido
                permanentemente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800/50 transition-all text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all text-sm font-semibold"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Horarios;
