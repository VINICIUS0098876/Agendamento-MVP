import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Menu, Scissors } from "lucide-react";

function AuthLayout() {
  const token = localStorage.getItem("@barberpro:token");
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 lg:hidden flex items-center gap-3 px-4 h-14 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800/60">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Menu size={22} />
        </button>
        <div className="w-7 h-7 bg-linear-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
          <Scissors className="w-4 h-4 text-slate-900" />
        </div>
        <span className="text-lg font-bold text-slate-50 tracking-tight">
          BarberPro
        </span>
      </div>

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;
