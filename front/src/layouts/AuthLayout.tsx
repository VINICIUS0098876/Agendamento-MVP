import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AuthLayout() {
  const token = localStorage.getItem("@barberpro:token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;
