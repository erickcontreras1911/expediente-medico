import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse, faIdCard, faHeartPulse, faNotesMedical,
  faCalendarCheck, faChartLine, faGear
} from "@fortawesome/free-solid-svg-icons";

const navItems = [
  { to: "/", label: "Inicio", icon: faHouse },
  { to: "/ficha", label: "Ficha del paciente", icon: faIdCard },
  { to: "/signos", label: "Signos vitales", icon: faHeartPulse },
  { to: "/notas", label: "Notas médicas", icon: faNotesMedical },
  { to: "/citas", label: "Citas", icon: faCalendarCheck },
  { to: "/reportes", label: "Reportes", icon: faChartLine },
  { to: "/config", label: "Configuración", icon: faGear },
];

export default function Sidebar({ collapsed }) {
  return (
    <aside className={`sb ${collapsed ? "sb--collapsed" : ""}`}>
      <div className="sb__brand">
        <div className="sb__logo"><FontAwesomeIcon icon={faHouse} /></div>
        <span className="sb__brandText">Expediente Médico</span>
      </div>

      <ul className="sb__nav">
        {navItems.map(item => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) => "sb__link" + (isActive ? " active" : "")}
              end={item.to === "/"}
            >
              <FontAwesomeIcon icon={item.icon} />
              <span className="label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
