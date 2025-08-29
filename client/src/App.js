// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import AppLayout from "./layouts/AppLayout";

// Páginas existentes
import Home from "./pages/Home";
import CrearPaciente from "./pages/pacientes/CrearPaciente";
import ConsultarSignos from "./pages/signos/ConsultarSignos";
import ConsultarNotas from "./pages/notas/ConsultarNotas";
import ConsultarCitas from "./pages/citas/ConsultarCitas";
import ConsultarReportes from "./pages/reportes/ConsultarReportes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login fuera del layout */}
        <Route path="/login" element={<div>Login</div>} />

        {/* App con layout */}
        <Route element={<AppLayout />}>
          {/* Home */}
          <Route index element={<Home />} />

          {/* Pacientes */}
          <Route path="pacientes">
            <Route index element={<Navigate to="consultar" replace />} />
            <Route path="crear" element={<CrearPaciente />} />
            <Route path="editar" element={<div className="card p-3">Editar paciente (WIP)</div>} />
            <Route path="consultar" element={<div className="card p-3">Consultar pacientes (WIP)</div>} />
          </Route>

          {/* Citas */}
          <Route path="citas">
            <Route index element={<ConsultarCitas />} /> {/* coincide con /citas */}
            <Route path="agendar" element={<div className="card p-3">Agendar cita (WIP)</div>} />
            <Route path="modificar" element={<div className="card p-3">Modificar cita (WIP)</div>} />
          </Route>

          {/* Signos vitales */}
          <Route path="signos">
            <Route index element={<Navigate to="consultar" replace />} />
            <Route path="consultar" element={<ConsultarSignos />} />
            <Route path="crear" element={<div className="card p-3">Registrar signos (WIP)</div>} />
            <Route path="editar" element={<div className="card p-3">Editar signos (WIP)</div>} />
          </Route>

          {/* Notas médicas */}
          <Route path="notas">
            <Route index element={<Navigate to="consultar" replace />} />
            <Route path="registrar" element={<div className="card p-3">Registrar nota (WIP)</div>} />
            <Route path="editar" element={<div className="card p-3">Editar nota (WIP)</div>} />
            <Route path="consultar" element={<ConsultarNotas />} />
          </Route>

          {/* Exámenes médicos */}
          <Route path="examenes">
            <Route index element={<Navigate to="consultar" replace />} />
            <Route path="registrar" element={<div className="card p-3">Registrar examen (WIP)</div>} />
            <Route path="editar" element={<div className="card p-3">Editar examen (WIP)</div>} />
            <Route path="consultar" element={<div className="card p-3">Consultar exámenes (WIP)</div>} />
          </Route>

          {/* Reportes y otras */}
          <Route path="reportes" element={<ConsultarReportes />} />
          <Route path="config" element={<div className="card p-3">Config</div>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
