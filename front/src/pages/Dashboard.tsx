import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Clock,
  Users,
  TrendingUp,
  CalendarDays,
  ArrowUpRight,
  Scissors,
} from "lucide-react";
import api from "../service/api";
import { toast } from "react-toastify";

interface Reserva {
  id_reserva: number;
  id_horario: number | null;
  cliente_nome: string;
  cliente_email: string;
  criado_em: string | null;
  horarios?: {
    id_horario: number;
    data_hora: string;
    disponivel: boolean;
  } | null;
}

interface Horario {
  id_horario: number;
  data_hora: string;
  disponivel: boolean;
}

function Dashboard() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const token = localStorage.getItem("@barberpro:token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // Pegar nome do usuário salvo no login
      const savedUser = localStorage.getItem("@barberpro:user");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setUserName(user.nome || "");
      }

      // Buscar reservas (pode retornar 404 se não houver nenhuma)
      try {
        const reservasRes = await api.get("/reservas", { headers });
        setReservas(reservasRes.data.data || reservasRes.data);
      } catch {
        setReservas([]);
      }

      // Buscar horários (pode retornar 404 se não houver nenhum)
      try {
        const horariosRes = await api.get("/horarios", { headers });
        setHorarios(horariosRes.data.data || horariosRes.data);
      } catch {
        setHorarios([]);
      }
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      if (error?.response?.status === 401) {
        toast.error("Sessão expirada. Faça login novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Métricas
  const totalReservas = reservas.length;
  const totalHorarios = horarios.length;
  const horariosDisponiveis = horarios.filter((h) => h.disponivel).length;
  const horariosOcupados = totalHorarios - horariosDisponiveis;
  const taxaOcupacao =
    totalHorarios > 0
      ? Math.round((horariosOcupados / totalHorarios) * 100)
      : 0;

  // Próximas reservas (ordenar por data do horário)
  const proximasReservas = [...reservas]
    .filter((r) => r.horarios?.data_hora)
    .sort(
      (a, b) =>
        new Date(a.horarios!.data_hora).getTime() -
        new Date(b.horarios!.data_hora).getTime(),
    )
    .slice(0, 5);

  // Saudação baseada na hora
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-page-in flex-1 p-6 lg:p-8 max-w-7xl">
      {/* ===== Header ===== */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-50 tracking-tight">
          {getGreeting()}, {userName || "Barbeiro"}!
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Aqui está um resumo do seu dia.
        </p>
      </div>

      {/* ===== Cards de Métricas ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {/* Total de Reservas */}
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 flex items-start justify-between group hover:border-slate-700/60 transition-colors">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Reservas
            </p>
            <p className="text-3xl font-bold text-slate-50">{totalReservas}</p>
            <p className="text-xs text-slate-500 mt-1">total agendadas</p>
          </div>
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
            <CalendarCheck className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        {/* Total de Horários */}
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 flex items-start justify-between group hover:border-slate-700/60 transition-colors">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Horários
            </p>
            <p className="text-3xl font-bold text-slate-50">{totalHorarios}</p>
            <p className="text-xs text-slate-500 mt-1">cadastrados</p>
          </div>
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        {/* Disponíveis */}
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 flex items-start justify-between group hover:border-slate-700/60 transition-colors">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Disponíveis
            </p>
            <p className="text-3xl font-bold text-emerald-400">
              {horariosDisponiveis}
            </p>
            <p className="text-xs text-slate-500 mt-1">horários livres</p>
          </div>
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        {/* Taxa de Ocupação */}
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 flex items-start justify-between group hover:border-slate-700/60 transition-colors">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Ocupação
            </p>
            <p className="text-3xl font-bold text-slate-50">{taxaOcupacao}%</p>
            <p className="text-xs text-slate-500 mt-1">dos horários</p>
          </div>
          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
        </div>
      </div>

      {/* ===== Seções Inferiores ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximas Reservas */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/60 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-slate-200">
                Próximas reservas
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              {proximasReservas.length} agendamento
              {proximasReservas.length !== 1 ? "s" : ""}
            </span>
          </div>

          {proximasReservas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 bg-slate-800/80 rounded-2xl flex items-center justify-center mb-4">
                <Scissors className="w-7 h-7 text-slate-600" />
              </div>
              <p className="text-sm text-slate-500">
                Nenhuma reserva encontrada
              </p>
              <p className="text-xs text-slate-600 mt-1">
                As reservas aparecerão aqui quando clientes agendarem
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/40">
              {proximasReservas.map((reserva) => (
                <div
                  key={reserva.id_reserva}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {reserva.cliente_nome}
                      </p>
                      <p className="text-xs text-slate-500">
                        {reserva.cliente_email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-300">
                      {reserva.horarios?.data_hora
                        ? formatTime(reserva.horarios.data_hora)
                        : "—"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {reserva.horarios?.data_hora
                        ? formatDate(reserva.horarios.data_hora)
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumo Rápido */}
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800/60">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-slate-200">
              Resumo rápido
            </h2>
          </div>

          <div className="p-5 flex flex-col gap-4">
            {/* Barra de ocupação visual */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Taxa de ocupação</span>
                <span className="text-xs font-semibold text-amber-500">
                  {taxaOcupacao}%
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${taxaOcupacao}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center justify-between py-2.5 px-3 bg-slate-800/40 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-400">Livres</span>
                </div>
                <span className="text-sm font-semibold text-slate-200">
                  {horariosDisponiveis}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5 px-3 bg-slate-800/40 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-slate-400">Ocupados</span>
                </div>
                <span className="text-sm font-semibold text-slate-200">
                  {horariosOcupados}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5 px-3 bg-slate-800/40 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-xs text-slate-400">Total horários</span>
                </div>
                <span className="text-sm font-semibold text-slate-200">
                  {totalHorarios}
                </span>
              </div>
            </div>

            {/* Link rápido */}
            <a
              href="/horarios"
              className="mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-700/60 text-slate-400 hover:text-amber-500 hover:border-amber-500/30 transition-all text-xs font-medium"
            >
              Gerenciar horários
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
