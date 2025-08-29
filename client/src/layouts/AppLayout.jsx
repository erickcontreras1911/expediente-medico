import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";


const KEY = "sb-collapsed";

export default function AppLayout() {
  const [collapsed, setCollapsed] = React.useState(() => localStorage.getItem(KEY) === "1");

  React.useEffect(() => {
    localStorage.setItem(KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <div className={`layout ${collapsed ? "layout--collapsed" : ""}`}>
      {/* 👇 pasar onExpand */}
      <Sidebar collapsed={collapsed} onExpand={() => setCollapsed(false)} />

      <header className="topbar">
        <button
          className="btn btn-sm topbar__btn"
          onClick={() => setCollapsed(c => !c)}
        >
          <FontAwesomeIcon icon={faBars} />
            <span className="d-none d-sm-inline"></span>
        </button>
        <div className="topbar__title">Expediente Médico — Demo</div>
      </header>

      <main className="main">
        <div className="container-fluid py-3">
          <Outlet />
        </div>
      </main>
    </div>
  );
}