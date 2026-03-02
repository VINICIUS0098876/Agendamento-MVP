import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Scissors,
  LayoutDashboard,
  Clock,
  CalendarCheck,
  UserCog,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    to: "/dashboard",
  },
  {
    label: "Horários",
    icon: Clock,
    to: "/horarios",
  },
  {
    label: "Reservas",
    icon: CalendarCheck,
    to: "/reservas",
  },
  {
    label: "Perfil",
    icon: UserCog,
    to: "/perfil",
  },
];

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem("@barberpro:token");
    navigate("/login");
  }

  return (
    <aside
      className={`
        ${collapsed ? "w-18" : "w-64"}
        h-full flex flex-col
        bg-linear-to-b from-slate-900 to-slate-950
        border-r border-slate-800/60
        transition-all duration-300 ease-in-out
      `}
    >
      {/* ===== Header ===== */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800/60">
        <div className="w-9 h-9 bg-linear-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md shadow-amber-500/15 shrink-0">
          <Scissors className="w-5 h-5 text-slate-900" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-slate-50 tracking-tight whitespace-nowrap overflow-hidden">
            BarberPro
          </span>
        )}
      </div>

      {/* ===== Navegação ===== */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-hidden">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200 group relative
                ${
                  isActive
                    ? "bg-amber-500/10 text-amber-500"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }
              `}
            >
              {/* Indicador lateral ativo */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 bg-amber-500 rounded-r-full" />
              )}

              <item.icon
                size={20}
                className={`shrink-0 ${isActive ? "text-amber-500" : "text-slate-500 group-hover:text-slate-300"}`}
              />

              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
                  {item.label}
                </span>
              )}

              {/* Tooltip quando colapsado */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 border border-slate-700/60 text-slate-200 text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ===== Footer ===== */}
      <div className="px-3 pb-4 flex flex-col gap-2">
        {/* Botão Sair */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 group relative w-full"
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && (
            <span className="text-sm font-medium whitespace-nowrap">Sair</span>
          )}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 border border-slate-700/60 text-slate-200 text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
              Sair
            </div>
          )}
        </button>

        {/* Divisor */}
        <div className="h-px bg-slate-800/60 mx-1" />

        {/* Botão colapsar */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all duration-200 w-full"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && (
            <span className="text-xs font-medium whitespace-nowrap">
              Recolher menu
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
