
function Modal() {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/60 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] w-full max-w-md mx-4 overflow-hidden">
        {/* Faixa dourada decorativa no topo */}
        <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500" />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-50 tracking-tight">
                Agendar Horário
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Preencha seus dados para confirmar
              </p>
            </div>
            <button className="text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg p-1.5 transition-all cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Divisor */}
          <div className="h-px bg-slate-700/60 my-6" />

          {/* Formulário */}
          <form className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nome
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-50 placeholder-slate-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-50 placeholder-slate-600 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold py-3 rounded-xl transition-all cursor-pointer mt-1 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98]"
            >
              Confirmar Agendamento
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Modal;
