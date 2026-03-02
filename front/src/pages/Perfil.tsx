import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Tag,
  Save,
  Trash2,
  Link as LinkIcon,
  Copy,
  Check,
  Shield,
} from "lucide-react";
import api from "../service/api";
import { toast } from "react-toastify";

interface UserData {
  id_usuario: number;
  nome: string;
  email: string;
  slug: string;
}

function Perfil() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [slug, setSlug] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Copy slug
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem("@barberpro:token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadUser() {
    try {
      const savedUser = localStorage.getItem("@barberpro:user");
      if (!savedUser) {
        navigate("/login");
        return;
      }

      const parsed = JSON.parse(savedUser) as UserData;
      const res = await api.get(`/user/${parsed.id_usuario}`, { headers });
      const userData = res.data.data || res.data;

      setUser(userData);
      setNome(userData.nome);
      setEmail(userData.email);
      setSlug(userData.slug);
    } catch {
      toast.error("Erro ao carregar perfil.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault();

    if (!nome || !email || !slug) {
      toast.warn("Nome, email e slug são obrigatórios!");
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, string> = { nome, email, slug };

      // Só envia senha se preencheu a nova
      if (novaSenha) {
        if (!senhaAtual) {
          toast.warn("Informe a senha atual para alterar a senha.");
          setSaving(false);
          return;
        }
        body.senha = novaSenha;
      }

      const res = await api.put(`/user/${user!.id_usuario}`, body, { headers });
      const updatedUser = res.data.data || res.data;

      // Atualizar localStorage
      localStorage.setItem(
        "@barberpro:user",
        JSON.stringify({
          id_usuario: user!.id_usuario,
          nome: updatedUser.nome || nome,
          email: updatedUser.email || email,
        }),
      );

      setUser({ ...user!, nome, email, slug });
      setSenhaAtual("");
      setNovaSenha("");
      toast.success("Perfil atualizado com sucesso!");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error?.response?.data?.message || "Erro ao atualizar perfil.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirmText !== "EXCLUIR") return;

    try {
      await api.delete(`/user/${user!.id_usuario}`, { headers });
      localStorage.removeItem("@barberpro:token");
      localStorage.removeItem("@barberpro:user");
      toast.success("Conta excluída com sucesso.");
      navigate("/login");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error?.response?.data?.message || "Erro ao excluir conta.";
      toast.error(msg);
    }
  }

  function handleCopySlug() {
    const url = `${window.location.origin}/barbeiro/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Carregando perfil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-page-in flex-1 p-6 lg:p-8 max-w-4xl">
      {/* ===== Header ===== */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-50 tracking-tight">
          Perfil & Configurações
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Gerencie seus dados pessoais e configurações da conta
        </p>
      </div>

      {/* ===== Card do Perfil ===== */}
      <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl overflow-hidden mb-6">
        {/* Banner */}
        <div className="h-20 bg-linear-to-r from-amber-500/10 via-slate-900 to-slate-950 relative">
          <div className="absolute -bottom-8 left-6">
            <div className="w-16 h-16 bg-linear-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 border-4 border-slate-900">
              <span className="text-2xl font-bold text-slate-900">
                {nome.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-12 px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-50">{nome}</h2>
              <p className="text-sm text-slate-400">{email}</p>
            </div>
            {/* Link da página */}
            <button
              onClick={handleCopySlug}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 border border-slate-700/40 rounded-lg text-xs text-slate-400 hover:text-amber-500 hover:border-amber-500/30 transition-all"
            >
              <LinkIcon size={12} />
              <span>/barbeiro/{slug}</span>
              {copied ? (
                <Check size={12} className="text-emerald-400" />
              ) : (
                <Copy size={12} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===== Formulário de Dados ===== */}
      <form onSubmit={handleSaveProfile}>
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl overflow-hidden mb-6">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800/60">
            <User className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-200">
              Dados pessoais
            </h3>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nome
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-50 placeholder-slate-600 text-sm transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-50 placeholder-slate-600 text-sm transition-all"
                />
              </div>
            </div>

            {/* Slug */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Slug (link da sua página)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Tag size={16} />
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-50 placeholder-slate-600 text-sm transition-all"
                />
              </div>
              {slug && (
                <p className="text-xs text-slate-500 mt-1.5 ml-1">
                  Sua página:{" "}
                  <span className="text-amber-500/80">/barbeiro/{slug}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ===== Alterar Senha ===== */}
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl overflow-hidden mb-6">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800/60">
            <Shield className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-200">
              Alterar senha
            </h3>
            <span className="text-xs text-slate-500 ml-auto">Opcional</span>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Senha atual */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Senha atual
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-50 placeholder-slate-600 text-sm transition-all"
                />
              </div>
            </div>

            {/* Nova senha */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nova senha
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-50 placeholder-slate-600 text-sm transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ===== Botão Salvar ===== */}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>

      {/* ===== Zona de Perigo ===== */}
      <div className="mt-10 bg-red-500/5 border border-red-500/15 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-red-500/10">
          <Trash2 className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-semibold text-red-400">Zona de perigo</h3>
        </div>

        <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-300 font-medium">Excluir conta</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Todos os seus dados, horários e reservas serão apagados
              permanentemente.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium shrink-0"
          >
            Excluir minha conta
          </button>
        </div>
      </div>

      {/* ===== Modal Confirmar Exclusão ===== */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-page-in bg-linear-to-b from-slate-800 to-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="p-6">
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-50 mb-1 text-center">
                Excluir sua conta?
              </h3>
              <p className="text-sm text-slate-400 mb-4 text-center">
                Esta ação é irreversível. Todos os seus horários e reservas
                serão apagados.
              </p>

              <p className="text-xs text-slate-500 mb-2 text-center">
                Digite <span className="text-red-400 font-bold">EXCLUIR</span>{" "}
                para confirmar
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="EXCLUIR"
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 text-slate-50 placeholder-slate-600 text-sm text-center mb-5 transition-all"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText("");
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800/50 transition-all text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "EXCLUIR"}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Excluir conta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;
