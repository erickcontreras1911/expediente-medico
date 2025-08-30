// src/components/sidebar.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse, faIdCard, faStethoscope, faHeartPulse,
  faCalendarCheck, faChartLine, faGear, faChevronDown, faFlaskVial
} from "@fortawesome/free-solid-svg-icons";
import { faHospital } from "@fortawesome/free-solid-svg-icons";

const EXACT_MATCH = new Set(["/", "/citas"]);

const MENU = [
  { type: "item", to: "/", label: "Inicio", icon: faHouse },
  {
    type: "group", key: "pacientes", label: "Pacientes", icon: faIdCard, children: [
      { to: "/pacientes/crear",     label: "Crear paciente" },
      { to: "/pacientes/editar",    label: "Modificar paciente" },
      { to: "/pacientes/consultar", label: "Consultar pacientes" },
    ]
  },
  {
    type: "group", key: "citas", label: "Citas médicas", icon: faCalendarCheck, children: [
      { to: "/citas/agendar",   label: "Agendar cita" },
      { to: "/citas/modificar", label: "Modificar cita" },
      { to: "/citas",           label: "Consultar citas" },
    ]
  },
  {
    type: "group", key: "signos", label: "Signos vitales", icon: faHeartPulse, children: [
      { to: "/signos/crear",     label: "Registrar signos" },
      { to: "/signos/editar",    label: "Editar signos" },
      { to: "/signos/consultar", label: "Consultar signos" },
    ]
  },
  {
    type: "group", key: "notas", label: "Notas médicas", icon: faStethoscope, children: [
      { to: "/notas/registrar",  label: "Registrar nota" },
      { to: "/notas/editar",     label: "Editar nota" },
      { to: "/notas/consultar",  label: "Consultar notas" },
    ]
  },
  {
    type: "group", key: "examenes", label: "Exámenes médicos", icon: faFlaskVial, children: [
      { to: "/examenes/solicitar", label: "Solicitar exámenes" },
      { to: "/examenes/editar",    label: "Editar solicitud" },
      { to: "/examenes/consultar", label: "Consultar exámenes" },
    ]
  },
  { type: "item", to: "/reportes", label: "Reportes", icon: faChartLine },
  { type: "item", to: "/config",   label: "Configuración", icon: faGear },
];

const STORE_KEY = "sb-groups-open";

export default function Sidebar({ collapsed, onExpand }) {   // 👈 recibe onExpand
  const { pathname } = useLocation();

  const [open, setOpen] = React.useState(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });

  const handleGroupClick = (key) => {
    if (collapsed && typeof onExpand === "function") onExpand(); // 👈 expandir layout
    setOpen((prev) => {
      const next = Object.fromEntries(Object.keys(prev).map(k => [k, false]));
      next[key] = collapsed ? true : !prev[key];
      return next;
    });
  };

  React.useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(open));
  }, [open]);

  React.useEffect(() => {
    const next = { ...open };
    MENU.forEach(m => {
      if (m.type === "group") {
        const match = m.children?.some(ch => pathname.startsWith(ch.to));
        if (match) next[m.key] = true;
      }
    });
    setOpen(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const linkItem = (item, key) => (
    <li key={key}>
      <NavLink
        to={item.to}
        className={({ isActive }) => "sb__link" + (isActive ? " active" : "")}
        end={EXACT_MATCH.has(item.to)}
      >
        <FontAwesomeIcon icon={item.icon} />
        <span className="label">{item.label}</span>
      </NavLink>
    </li>
  );

  return (
    <aside className={`sb ${collapsed ? "sb--collapsed" : ""}`}>
      <div className="sb__brand">
        <div className="sb__logo"><FontAwesomeIcon icon={faHospital} /></div>
        <span className="sb__brandText">Expediente Médico</span>
      </div>

      <ul className="sb__nav">
        {MENU.map((item, idx) => {
          if (item.type === "item") return linkItem(item, idx);

          const isOpen = !!open[item.key] && !collapsed;
          return (
            <li key={item.key}>
              <button
                type="button"
                className="sb__groupBtn"
                onClick={() => handleGroupClick(item.key)}   // 👈 sin comentario dentro
                aria-expanded={isOpen}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span className="label">{item.label}</span>
                {!collapsed && (
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={"sb__chev " + (open[item.key] ? "open" : "")}
                  />
                )}
              </button>

              {isOpen && (
                <div className="sb__submenu open">
                  {item.children?.map((ch) => (
                    <NavLink
                      key={ch.to}
                      to={ch.to}
                      end={EXACT_MATCH.has(ch.to)}
                      className={({ isActive }) =>
                        "sb__sublink" + (isActive ? " active" : "")
                      }
                    >
                      <span className="bullet" />
                      <span className="label">{ch.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
