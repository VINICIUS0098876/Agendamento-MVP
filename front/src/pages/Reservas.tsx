import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Search,
  Filter,
  Trash2,
  X,
  Clock,
  User,
  Mail,
  AlertCircle,
  CalendarDays,
  Eye,
} from "lucide-react";
import api from "../service/api";
import { toast } from "react-toastify";
import { format, isPast, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Horario {
  id_horario: number;
  data_hora: string;
  disponivel: boolean;
}

interface Reserva {
  id_reserva: number;
  id_horario: number | null;
  cliente_nome: string;
  cliente_email: string;
  criado_em: string;
  horarios: Horario | null;
}

type FilterType = "todos" | "futuros" | "passados";

function Reservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("todos");
  const [search, setSearch] = useState("");

  // Cancel confirm modal
  const [cancelId, setCancelId] = useState<number | null>(null);

  // Detail modal
  const [detail, setDetail] = useState<Reserva | null>(null);

  const token = localStorage.getItem("@barberpro:token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    loadReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadReservas() {
    try {
      const res = await api.get("/reservas", { headers });
      setReservas(res.data.data || res.data);
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      if (error?.response?.status === 404) {
        setReservas([]);
      } else {
        toast.error("Erro ao carregar reservas.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!cancelId) return;
    try {
      await api.delete(`/reserva/${cancelId}`, { headers });
      toast.success("Reserva cancelada com sucesso!");
      setCancelId(null);
      loadReservas();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error?.response?.data?.message || "Erro ao cancelar reserva.";
      toast.error(msg);
    }
  }

  function formatDateTime(dateStr: string) {
    try {
      const d = parseISO(dateStr);
      return format(d, "dd 'de' MMM', ' HH:mm", { locale: ptBR });
    } catch {
      return dateStr;
    }
  }

  function formatFullDate(dateStr: string) {
    try {
      const d = parseISO(dateStr);
      return format(d, "EEEE, dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
        locale: ptBR,
      });
    } catch {
      return dateStr;
    }
  }

  function isReservaPast(reserva: Reserva) {
    if (!reserva.horarios) return false;
    return isPast(parseISO(reserva.horarios.data_hora));
  }

  // Filters + search
  const filtered = reservas
    .filter((r) => {
      if (filter === "futuros") return !isReservaPast(r);
      if (filter === "passados") return isReservaPast(r);
      return true;
    })
    .filter((r) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        r.cliente_nome.toLowerCase().includes(s) ||
        r.cliente_email.toLowerCase().includes(s) ||
        (r.horarios &&
          formatDateTime(r.horarios.data_hora).toLowerCase().includes(s))
      );
    })
    .sort((a, b) => {
      const dA = a.horarios ? new Date(a.horarios.data_hora).getTime() : 0;
      const dB = b.horarios ? new Date(b.horarios.data_hora).getTime() : 0;
      return dB - dA; // mais recente primeiro
    });

  const totalFuturos = reservas.filter((r) => !isReservaPast(r)).length;
  const totalPassados = reservas.filter((r) => isReservaPast(r)).length;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Carregando reservas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-page-in flex-1 p-6 lg:p-8">
      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-50 tracking-tight">
            Gerenciamento de Reservas
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Acompanhe e gerencie todas as reservas dos seus clientes
          </p>
        </div>
      </div>

      {/* ===== Stats Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
            <CalendarCheck size={20} className="text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total</p>
            <p className="text-xl font-bold text-slate-50">{reservas.length}</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <Clock size={20} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Futuras</p>
            <p className="text-xl font-bold text-slate-50">{totalFuturos}</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-500/10 rounded-lg flex items-center justify-center">
            <CalendarDays size={20} className="text-slate-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Passadas</p>
            <p className="text-xl font-bold text-slate-50">{totalPassados}</p>
          </div>
        </div>
      </div>

      {/* ===== Search + Filter ===== */}
      <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-slate-800/60">
          {/* Busca */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Buscar por nome, email ou data..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-50 placeholder-slate-600 text-sm transition-all"
            />
          </div>

          {/* Filtro */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-700 rounded-xl p-1">
            <Filter size={14} className="text-slate-500 ml-2" />
            {(["todos", "futuros", "passados"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === f
                    ? "bg-amber-500/15 text-amber-500"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ===== Tabela / Lista ===== */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <AlertCircle size={40} className="mb-3 text-slate-600" />
            <p className="text-sm font-medium">Nenhuma reserva encontrada</p>
            <p className="text-xs text-slate-600 mt-1">
              {search || filter !== "todos"
                ? "Tente alterar os filtros ou a busca"
                : "As reservas dos clientes aparecerão aqui"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/80">
                <tr className="text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Data & Hora
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Reservado em
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filtered.map((r) => {
                  const past = isReservaPast(r);

                  return (
                    <tr
                      key={r.id_reserva}
                      className={`group transition-colors ${
                        past
                          ? "bg-slate-900/20 opacity-60"
                          : "hover:bg-slate-800/30"
                      }`}
                    >
                      {/* Cliente */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-linear-to-br from-amber-500/20 to-amber-600/10 rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-amber-500">
                              {r.cliente_nome.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-slate-200">
                            {r.cliente_nome}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-slate-400">
                          {r.cliente_email}
                        </span>
                      </td>

                      {/* Data & Hora */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-slate-500" />
                          <span className="text-sm text-slate-300">
                            {r.horarios
                              ? formatDateTime(r.horarios.data_hora)
                              : "—"}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        {past ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/15">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Concluída
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Agendada
                          </span>
                        )}
                      </td>

                      {/* Reservado em */}
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-slate-500">
                          {r.criado_em ? formatDateTime(r.criado_em) : "—"}
                        </span>
                      </td>

                      {/* Ações */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setDetail(r)}
                            className="p-2 rounded-lg text-slate-500 hover:text-amber-500 hover:bg-amber-500/10 transition-all"
                            title="Ver detalhes"
                          >
                            <Eye size={16} />
                          </button>
                          {!past && (
                            <button
                              onClick={() => setCancelId(r.id_reserva)}
                              className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              title="Cancelar reserva"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== Modal Detalhes ===== */}
      {detail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-page-in bg-linear-to-b from-slate-800 to-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/40">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Eye size={16} className="text-amber-500" />
                Detalhes da Reserva
              </h3>
              <button
                onClick={() => setDetail(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700/40 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Cliente */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/15 shrink-0">
                  <span className="text-lg font-bold text-slate-900">
                    {detail.cliente_nome.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-50">
                    {detail.cliente_nome}
                  </p>
                  <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Mail size={12} />
                    {detail.cliente_email}
                  </p>
                </div>
              </div>

              <div className="h-px bg-slate-700/40" />

              {/* Data do Horário */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                  <CalendarDays size={18} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Horário agendado</p>
                  <p className="text-sm font-medium text-slate-200">
                    {detail.horarios
                      ? formatFullDate(detail.horarios.data_hora)
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                  <Clock size={18} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  {isReservaPast(detail) ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Concluída
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Agendada
                    </span>
                  )}
                </div>
              </div>

              {/* Reservado em */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                  <User size={18} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Reservado em</p>
                  <p className="text-sm font-medium text-slate-200">
                    {detail.criado_em ? formatFullDate(detail.criado_em) : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-5 py-4 border-t border-slate-700/40">
              <button
                onClick={() => setDetail(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800/50 transition-all text-sm font-medium"
              >
                Fechar
              </button>
              {!isReservaPast(detail) && (
                <button
                  onClick={() => {
                    setCancelId(detail.id_reserva);
                    setDetail(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm font-semibold border border-red-500/15"
                >
                  Cancelar reserva
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal Confirmar Cancelamento ===== */}
      {cancelId !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-page-in bg-linear-to-b from-slate-800 to-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="p-6">
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-50 mb-1 text-center">
                Cancelar reserva?
              </h3>
              <p className="text-sm text-slate-400 mb-6 text-center">
                O horário será liberado novamente para agendamento. Esta ação
                não pode ser desfeita.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setCancelId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800/50 transition-all text-sm font-medium"
                >
                  Manter
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all text-sm font-semibold"
                >
                  Cancelar reserva
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reservas;
