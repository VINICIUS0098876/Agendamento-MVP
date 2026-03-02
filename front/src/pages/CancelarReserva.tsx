import { useState, type FormEvent } from "react";
import {
  Mail,
  Hash,
  Trash2,
  Check,
  AlertCircle,
  Scissors,
  ArrowLeft,
  Search,
} from "lucide-react";
import api from "../service/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CancelarReserva() {
  const [idReserva, setIdReserva] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  // Confirm step
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();

    if (!idReserva || !email) {
      toast.warn("Preencha o código da reserva e seu email!");
      return;
    }

    setShowConfirm(true);
  }

  async function handleCancel() {
    setSubmitting(true);
    try {
      await api.post(`/reserva/${idReserva}/cancelar`, {
        cliente_email: email,
      });
      setCancelled(true);
      toast.success("Reserva cancelada com sucesso!");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error?.response?.data?.message || "Erro ao cancelar reserva.";
      toast.error(msg);
      setShowConfirm(false);
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setIdReserva("");
    setEmail("");
    setCancelled(false);
    setShowConfirm(false);
  }

  // Success state
  if (cancelled) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="animate-page-in text-center max-w-sm">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Check size={36} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-50 mb-2">
            Reserva Cancelada
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            Sua reserva foi cancelada com sucesso e o horário foi liberado
            novamente.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleReset}
              className="w-full py-2.5 bg-slate-800 border border-slate-700 text-slate-300 hover:text-slate-50 rounded-xl text-sm font-medium transition-all hover:bg-slate-700"
            >
              Cancelar outra reserva
            </button>
            <button
              onClick={() => window.history.back()}
              className="text-xs text-slate-500 hover:text-amber-500 transition-colors"
            >
              Voltar
            </button>
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-linear-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/20">
            <Scissors size={28} className="text-slate-900" />
          </div>
          <h1 className="text-2xl font-bold text-slate-50 tracking-tight">
            Cancelar Reserva
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Informe o código da sua reserva e o email utilizado no agendamento
          </p>
        </div>

        {/* Card */}
        <div className="animate-page-in bg-slate-900/60 border border-slate-800/60 rounded-2xl overflow-hidden">
          {!showConfirm ? (
            <>
              {/* Search Form */}
              <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800/60">
                <Search size={16} className="text-amber-500" />
                <h3 className="text-sm font-semibold text-slate-200">
                  Localizar reserva
                </h3>
              </div>

              <form onSubmit={handleSearch} className="p-5 space-y-4">
                {/* Código da reserva */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Código da reserva
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                      <Hash size={16} />
                    </span>
                    <input
                      type="number"
                      placeholder="Ex: 1"
                      value={idReserva}
                      onChange={(e) => setIdReserva(e.target.value)}
                      required
                      min="1"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-50 placeholder-slate-600 text-sm transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 ml-1">
                    O código foi informado quando você fez a reserva
                  </p>
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-50 placeholder-slate-600 text-sm transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 ml-1">
                    O mesmo email usado no momento da reserva
                  </p>
                </div>

                {/* Info box */}
                <div className="flex items-start gap-2.5 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                  <AlertCircle
                    size={16}
                    className="text-amber-500 shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-slate-400">
                    Ao cancelar, o horário será liberado para outros clientes.
                    Esta ação não pode ser desfeita.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98]"
                >
                  Buscar reserva
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Confirm Cancel */}
              <div className="p-6 text-center">
                <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-50 mb-1">
                  Confirmar cancelamento?
                </h3>
                <p className="text-sm text-slate-400 mb-2">
                  Tem certeza que deseja cancelar a reserva{" "}
                  <span className="text-amber-500 font-semibold">
                    #{idReserva}
                  </span>
                  ?
                </p>
                <p className="text-xs text-slate-500 mb-6">
                  O horário será liberado e esta ação não pode ser desfeita.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800/50 transition-all text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={14} />
                    Voltar
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Cancelando..." : "Cancelar reserva"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer link */}
        <div className="text-center mt-6">
          <button
            onClick={() => window.history.back()}
            className="text-xs text-slate-500 hover:text-amber-500 transition-colors"
          >
            Voltar
          </button>
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

export default CancelarReserva;
