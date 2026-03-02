import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Scissors,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  SmilePlus,
} from "lucide-react";
import api from "../service/api";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email || !senha) {
      toast.warn("Preencha todos os campos!");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/login", { email, senha });
      const { token, usuario } = response.data.data;
      localStorage.setItem("@barberpro:token", token);
      localStorage.setItem("@barberpro:user", JSON.stringify(usuario));
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error?.response?.data?.message || "Erro ao fazer login.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* ===== LADO ESQUERDO — FORMULÁRIO ===== */}
      <div className="animate-page-in w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-12 bg-linear-to-b from-slate-900 to-slate-950">
        <div className="w-full max-w-md">
          {/* Logo / Ícone */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-linear-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Scissors className="w-6 h-6 text-slate-900" />
            </div>
            <span className="text-xl font-bold text-slate-50 tracking-tight">
              BarberPro
            </span>
          </div>

          {/* Título */}
          <div className="mb-8 mt-6">
            <h1 className="text-3xl font-bold text-slate-50 tracking-tight">
              Bem-vindo de volta!
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Faça login para acessar seu painel de agendamentos
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-50 placeholder-slate-600 transition-all"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-50 placeholder-slate-600 transition-all"
                />
              </div>
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold py-3 rounded-xl transition-all cursor-pointer mt-1 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Divisor */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-700/60" />
            <span className="text-xs text-slate-500">ou</span>
            <div className="flex-1 h-px bg-slate-700/60" />
          </div>

          {/* Link para cadastro */}
          <p className="text-center text-sm text-slate-400">
            Não tem uma conta?{" "}
            <Link
              to="/cadastro"
              className="text-amber-500 hover:text-amber-400 font-semibold transition-colors"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>

      {/* ===== LADO DIREITO — PAINEL DECORATIVO ===== */}
      <div className="animate-panel-in hidden lg:flex w-1/2 bg-linear-to-br from-amber-500/10 via-slate-900 to-slate-950 relative overflow-hidden items-center justify-center">
        {/* Círculos decorativos de fundo */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-15 -left-15 w-60 h-60 bg-amber-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-amber-500/3 rounded-full blur-3xl" />

        {/* Conteúdo central */}
        <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-lg">
          {/* Ícone grande decorativo */}
          <div className="w-28 h-28 bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700/60 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-amber-500/5">
            <Scissors className="w-14 h-14 text-amber-500" />
          </div>

          <h2 className="text-3xl font-bold text-slate-50 tracking-tight mb-3">
            Seu painel te espera
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-10">
            Acesse sua agenda, confira reservas e mantenha tudo sob controle em
            um só lugar.
          </p>

          {/* Cards de features */}
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center gap-4 bg-slate-800/50 border border-slate-700/40 rounded-xl px-5 py-4 backdrop-blur-sm">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-200">
                  Acesso rápido
                </p>
                <p className="text-xs text-slate-500">
                  Veja sua agenda do dia em segundos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-800/50 border border-slate-700/40 rounded-xl px-5 py-4 backdrop-blur-sm">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-200">
                  Dados protegidos
                </p>
                <p className="text-xs text-slate-500">
                  Sua conta é segura com autenticação JWT
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-800/50 border border-slate-700/40 rounded-xl px-5 py-4 backdrop-blur-sm">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
                <SmilePlus className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-200">
                  Experiência simples
                </p>
                <p className="text-xs text-slate-500">
                  Interface intuitiva feita para o seu dia a dia
                </p>
              </div>
            </div>
          </div>

          {/* Indicadores */}
          <div className="flex gap-2 mt-10">
            <div className="w-2 h-2 rounded-full bg-slate-600" />
            <div className="w-8 h-2 rounded-full bg-amber-500" />
            <div className="w-2 h-2 rounded-full bg-slate-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
