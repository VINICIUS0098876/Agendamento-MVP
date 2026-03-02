import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import {
  Scissors,
  Clock,
  Calendar,
  User,
  Mail,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import api from "../service/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format, parseISO, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Barbeiro {
  id_usuario: number;
  nome: string;
  email: string;
  slug: string;
}

interface Horario {
  id_horario: number;
  id_usuario: number;
  data_hora: string;
  disponivel: boolean;
}

function BarbeiroPublico() {
  const { slug } = useParams<{ slug: string }>();

  const [barbeiro, setBarbeiro] = useState<Barbeiro | null>(null);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Selected date + time
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHorario, setSelectedHorario] = useState<Horario | null>(null);

  // Booking form
  const [showForm, setShowForm] = useState(false);
  const [clienteNome, setClienteNome] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookedId, setBookedId] = useState<number | null>(null);

  useEffect(() => {
    loadBarbeiro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function loadBarbeiro() {
    try {
      const res = await api.get(`/barbeiro/${slug}`);
      const data = res.data.data || res.data;
      setBarbeiro(data);

      // Buscar horários disponíveis
      try {
        const hRes = await api.get(`/horarios/disponiveis/${data.id_usuario}`);
        setHorarios(hRes.data.data || hRes.data);
      } catch (err: unknown) {
        const error = err as { response?: { status?: number } };
        if (error?.response?.status === 404) {
          setHorarios([]);
        }
      }
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      if (error?.response?.status === 404) {
        setNotFound(true);
      } else {
        toast.error("Erro ao carregar página do barbeiro.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleBooking(e: FormEvent) {
    e.preventDefault();
    if (!selectedHorario || !clienteNome || !clienteEmail) {
      toast.warn("Preencha todos os campos!");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/reserva", {
        id_horario: selectedHorario.id_horario,
        cliente_nome: clienteNome,
        cliente_email: clienteEmail,
      });

      const reservaCriada = res.data.data || res.data;
      setBookedId(reservaCriada.id_reserva);

      // Remove o horário reservado da lista local imediatamente
      setHorarios((prev) =>
        prev.filter((h) => h.id_horario !== selectedHorario.id_horario),
      );
      setBooked(true);
      toast.success("Reserva confirmada com sucesso!");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error?.response?.data?.message || "Erro ao realizar reserva.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function resetBooking() {
    setBooked(false);
    setShowForm(false);
    setSelectedHorario(null);
    setSelectedDate(null);
    setClienteNome("");
    setClienteEmail("");
    loadBarbeiro();
  }

  // === Date helpers ===
  // Get unique dates from available horarios
  const uniqueDates = [
    ...new Set(
      horarios.map((h) => format(parseISO(h.data_hora), "yyyy-MM-dd")),
    ),
  ].sort();

  // Paginated dates — show 5 at a time
  const [datePageIndex, setDatePageIndex] = useState(0);
  const DATES_PER_PAGE = 5;
  const pagedDates = uniqueDates.slice(
    datePageIndex,
    datePageIndex + DATES_PER_PAGE,
  );

  // Horarios for selected date
  const horariosForDate = selectedDate
    ? horarios
        .filter((h) => isSameDay(parseISO(h.data_hora), parseISO(selectedDate)))
        .sort(
          (a, b) =>
            new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime(),
        )
    : [];

  // === Render ===
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Carregando...</span>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-slate-900 border border-slate-800/60 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Scissors size={36} className="text-slate-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-50 mb-2">
            Barbeiro não encontrado
          </h1>
          <p className="text-slate-400 text-sm max-w-sm">
            O link que você acessou não corresponde a nenhum barbeiro
            cadastrado. Verifique o endereço e tente novamente.
          </p>
        </div>
      </div>
    );
  }

  // Success state after booking
  if (booked) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="animate-page-in text-center max-w-md">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Check size={36} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-50 mb-2">
            Reserva Confirmada!
          </h1>
          <p className="text-slate-400 text-sm mb-2">
            Seu horário com{" "}
            <span className="text-amber-500 font-semibold">
              {barbeiro?.nome}
            </span>{" "}
            foi reservado com sucesso.
          </p>
          {/* Código da reserva em destaque */}
          {bookedId && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-3 my-4 inline-block">
              <p className="text-xs text-amber-500/70 mb-0.5">
                Código da reserva
              </p>
              <p className="text-2xl font-bold text-amber-500">#{bookedId}</p>
            </div>
          )}

          <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4 my-4 text-left">
            <div className="flex items-center gap-3 mb-3">
              <Calendar size={16} className="text-amber-500" />
              <span className="text-sm text-slate-200">
                {selectedHorario &&
                  format(
                    parseISO(selectedHorario.data_hora),
                    "EEEE, dd 'de' MMMM 'às' HH:mm",
                    { locale: ptBR },
                  )}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <User size={16} className="text-amber-500" />
              <span className="text-sm text-slate-200">{clienteNome}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-amber-500" />
              <span className="text-sm text-slate-200">{clienteEmail}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-5">
            Guarde o{" "}
            <span className="text-amber-500 font-semibold">código</span> e o{" "}
            <span className="text-amber-500 font-semibold">email</span> caso
            precise cancelar sua reserva.
          </p>
          <div className="flex flex-col gap-3 items-center">
            <button
              onClick={resetBooking}
              className="px-6 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 hover:text-slate-50 rounded-xl text-sm font-medium transition-all hover:bg-slate-700"
            >
              Fazer outra reserva
            </button>
            <a
              href="/cancelar"
              className="text-xs text-slate-500 hover:text-amber-500 transition-colors"
            >
              Precisa cancelar? Clique aqui
            </a>
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="dark"
          toastClassName="!bg-slate-800 !border !border-slate-700/60 !text-slate-50"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* ===== Hero / Header ===== */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-amber-500/5 via-slate-950 to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-3xl" />

        <div className="relative px-4 pt-12 pb-8 max-w-2xl mx-auto text-center">
          {/* Avatar */}
          <div className="w-20 h-20 bg-linear-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/20 border-4 border-slate-900">
            <Scissors size={32} className="text-slate-900" />
          </div>

          <h1 className="text-3xl font-bold text-slate-50 tracking-tight mb-1">
            {barbeiro?.nome}
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <MapPin size={14} />
            <span>Barbearia</span>
          </div>

          <p className="text-slate-500 text-sm mt-3 max-w-sm mx-auto">
            Escolha uma data e horário disponível para agendar seu atendimento
          </p>
        </div>
      </div>

      {/* ===== Main content ===== */}
      <div className="max-w-2xl mx-auto px-4 pb-12">
        {horarios.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-12 text-center">
            <AlertCircle size={40} className="mx-auto mb-3 text-slate-600" />
            <p className="text-sm font-medium text-slate-400">
              Nenhum horário disponível no momento
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Volte mais tarde para verificar novos horários
            </p>
          </div>
        ) : (
          <>
            {/* ===== Step 1: Select Date ===== */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-slate-900">
                  1
                </div>
                <h2 className="text-sm font-semibold text-slate-200">
                  Escolha a data
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setDatePageIndex(
                      Math.max(0, datePageIndex - DATES_PER_PAGE),
                    )
                  }
                  disabled={datePageIndex === 0}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex-1 flex gap-2 overflow-hidden">
                  {pagedDates.map((dateStr) => {
                    const d = parseISO(dateStr);
                    const isSelected = selectedDate === dateStr;
                    return (
                      <button
                        key={dateStr}
                        onClick={() => {
                          setSelectedDate(dateStr);
                          setSelectedHorario(null);
                          setShowForm(false);
                        }}
                        className={`flex-1 min-w-0 py-3 px-2 rounded-xl border text-center transition-all ${
                          isSelected
                            ? "bg-amber-500/15 border-amber-500/40 text-amber-500"
                            : "bg-slate-900/60 border-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                        }`}
                      >
                        <p className="text-[10px] uppercase font-semibold tracking-wider">
                          {format(d, "EEE", { locale: ptBR })}
                        </p>
                        <p className="text-lg font-bold mt-0.5">
                          {format(d, "dd")}
                        </p>
                        <p className="text-[10px] mt-0.5">
                          {format(d, "MMM", { locale: ptBR })}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setDatePageIndex(
                      Math.min(
                        uniqueDates.length - DATES_PER_PAGE,
                        datePageIndex + DATES_PER_PAGE,
                      ),
                    )
                  }
                  disabled={
                    datePageIndex + DATES_PER_PAGE >= uniqueDates.length
                  }
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* ===== Step 2: Select Time ===== */}
            {selectedDate && (
              <div className="animate-page-in mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-slate-900">
                    2
                  </div>
                  <h2 className="text-sm font-semibold text-slate-200">
                    Escolha o horário
                  </h2>
                  <span className="text-xs text-slate-500 ml-auto">
                    {horariosForDate.length} disponíve
                    {horariosForDate.length === 1 ? "l" : "is"}
                  </span>
                </div>

                {horariosForDate.length === 0 ? (
                  <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-6 text-center">
                    <p className="text-sm text-slate-500">
                      Nenhum horário disponível nesta data
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {horariosForDate.map((h) => {
                      const time = format(parseISO(h.data_hora), "HH:mm");
                      const isSelected =
                        selectedHorario?.id_horario === h.id_horario;

                      return (
                        <button
                          key={h.id_horario}
                          onClick={() => {
                            setSelectedHorario(h);
                            setShowForm(true);
                          }}
                          className={`py-3 px-2 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? "bg-amber-500/15 border-amber-500/40 text-amber-500"
                              : "bg-slate-900/60 border-slate-800/60 text-slate-300 hover:border-slate-700 hover:text-slate-100"
                          }`}
                        >
                          <Clock size={14} />
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ===== Step 3: Booking Form ===== */}
            {showForm && selectedHorario && (
              <div className="animate-page-in">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-slate-900">
                    3
                  </div>
                  <h2 className="text-sm font-semibold text-slate-200">
                    Seus dados
                  </h2>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl overflow-hidden">
                  {/* Resumo selecionado */}
                  <div className="px-5 py-3 border-b border-slate-800/60 bg-amber-500/5 flex items-center gap-3">
                    <Calendar size={16} className="text-amber-500 shrink-0" />
                    <span className="text-sm text-slate-200 font-medium">
                      {format(
                        parseISO(selectedHorario.data_hora),
                        "EEEE, dd 'de' MMMM 'às' HH:mm",
                        { locale: ptBR },
                      )}
                    </span>
                  </div>

                  <form onSubmit={handleBooking} className="p-5 space-y-4">
                    {/* Nome */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Seu nome
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                          <User size={16} />
                        </span>
                        <input
                          type="text"
                          placeholder="Nome completo"
                          value={clienteNome}
                          onChange={(e) => setClienteNome(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-50 placeholder-slate-600 text-sm transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Seu email
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                          <Mail size={16} />
                        </span>
                        <input
                          type="email"
                          placeholder="email@exemplo.com"
                          value={clienteEmail}
                          onChange={(e) => setClienteEmail(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-50 placeholder-slate-600 text-sm transition-all"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5 ml-1">
                        Necessário para cancelar sua reserva
                      </p>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Agendando..." : "Confirmar agendamento"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ===== Footer ===== */}
      <footer className="border-t border-slate-800/60 py-6 text-center">
        <p className="text-xs text-slate-600">
          Agendamento por{" "}
          <span className="text-amber-500/60 font-semibold">BarberPro</span>
        </p>
      </footer>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastClassName="!bg-slate-800 !border !border-slate-700/60 !text-slate-50"
      />
    </div>
  );
}

export default BarbeiroPublico;
