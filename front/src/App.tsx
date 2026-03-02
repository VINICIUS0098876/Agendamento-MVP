import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./pages/Dashboard";
import Horarios from "./pages/Horarios";
import Perfil from "./pages/Perfil";
import Reservas from "./pages/Reservas";
import BarbeiroPublico from "./pages/BarbeiroPublico";
import CancelarReserva from "./pages/CancelarReserva";

function App() {
  return (
    <>
      <Routes>
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />

        {/* Páginas públicas */}
        <Route path="/barbeiro/:slug" element={<BarbeiroPublico />} />
        <Route path="/cancelar" element={<CancelarReserva />} />

        {/* Rotas autenticadas com sidebar */}
        <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/horarios" element={<Horarios />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastClassName="!bg-slate-800 !border !border-slate-700/60 !text-slate-50"
      />
    </>
  );
}

export default App;
