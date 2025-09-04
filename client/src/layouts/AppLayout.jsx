// src/layouts/AppLayout.jsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faGrip } from "@fortawesome/free-solid-svg-icons";

const KEY = "sb-collapsed";

export default function AppLayout() {
  const [collapsed, setCollapsed] = React.useState(
    () => localStorage.getItem(KEY) === "1"
  );
  const navigate = useNavigate();

  React.useEffect(() => {
    localStorage.setItem(KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <div className={`layout ${collapsed ? "layout--collapsed" : ""}`}>
      <Sidebar collapsed={collapsed} onExpand={() => setCollapsed(false)} />

      <header className="topbar">
        <button
          className="btn btn-outline-secondary btn-sm topbar__btn"
          onClick={() => setCollapsed(c => !c)}
        >
          <FontAwesomeIcon icon={faBars} />
          <span className="d-none d-sm-inline"> Menú</span>
        </button>

        {/* 👉 Botón para ir al menú gráfico */}
        <button
          className="btn btn-primary btn-sm ms-2"
          onClick={() => navigate("/menu")}
        >
          <FontAwesomeIcon icon={faGrip} className="me-1" />
          Menú Gráfico
        </button>

        <div className="topbar__title ms-auto">
          Expediente Médico - Análisis de Sistemas 2
        </div>
      </header>

      <main className="main">
        <div className="container-fluid py-3">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
