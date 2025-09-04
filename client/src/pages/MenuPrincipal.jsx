import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdCard, faCalendarCheck, faHeartPulse, faNotesMedical,
  faFlaskVial, faChartLine, faGear, faChevronDown,
  faUserPlus, faUserPen, faUsers,
  faCalendarPlus, faPenToSquare, faListCheck
} from "@fortawesome/free-solid-svg-icons";

const TILES = [
  {
    key: "pacientes",
    label: "Pacientes",
    icon: faIdCard,
    imgPng: "/img/pacientes.png",
    imgGif: "/img/pacientes.gif",
    children: [
      { to: "/pacientes/crear",     label: "Crear paciente",      icon: faUserPlus },
      { to: "/pacientes/editar",    label: "Modificar paciente",  icon: faUserPen },
      { to: "/pacientes/consultar", label: "Consultar pacientes", icon: faUsers },
    ],
  },
  {
    key: "citas",
    label: "Citas médicas",
    icon: faCalendarCheck,
    imgPng: "/img/citas.png",
    imgGif: "/img/citas.gif",
    children: [
      { to: "/citas/agendar",   label: "Agendar cita",   icon: faCalendarPlus },
      { to: "/citas/modificar", label: "Modificar cita", icon: faPenToSquare },
      { to: "/citas",           label: "Consultar citas",icon: faListCheck },
    ],
  },
  {
    key: "signos",
    label: "Signos vitales",
    icon: faHeartPulse,
    imgPng: "/img/signos.png",
    imgGif: "/img/signos.gif",
    children: [
      { to: "/signos/crear",     label: "Registrar signos", icon: faHeartPulse },
      { to: "/signos/editar",    label: "Editar signos",    icon: faPenToSquare },
      { to: "/signos/consultar", label: "Consultar signos", icon: faListCheck },
    ],
  },
  {
    key: "notas",
    label: "Notas médicas",
    icon: faNotesMedical,
    imgPng: "/img/notas.png",
    imgGif: "/img/notas.gif",
    children: [
      { to: "/notas/registrar",  label: "Registrar nota",  icon: faNotesMedical },
      { to: "/notas/editar",     label: "Editar nota",     icon: faPenToSquare },
      { to: "/notas/consultar",  label: "Consultar notas", icon: faListCheck },
    ],
  },
  {
    key: "examenes",
    label: "Exámenes médicos",
    icon: faFlaskVial,
    imgPng: "/img/examenes.png",
    imgGif: "/img/examenes.gif",
    children: [
      { to: "/examenes/solicitar", label: "Solicitar examen",  icon: faFlaskVial },
      { to: "/examenes/editar",    label: "Editar examen",     icon: faPenToSquare },
      { to: "/examenes/consultar", label: "Consultar exámenes",icon: faListCheck },
    ],
  },
  {
    key: "reportes",
    label: "Reportes",
    icon: faChartLine,
    imgPng: "/img/reportes.png",
    imgGif: "/img/reportes.gif",
    children: [{ to: "/reportes", label: "Ver reportes", icon: faChartLine }],
  },
  {
    key: "config",
    label: "Configuración",
    icon: faGear,
    imgPng: "/img/config.png",
    imgGif: "/img/config.gif",
    children: [{ to: "/config", label: "Preferencias", icon: faGear }],
  },
];

export default function MenuPrincipal() {
  const [open, setOpen] = React.useState(null);
  const toggle = (key) => setOpen((k) => (k === key ? null : key));

  return (
    <div className="container-fluid">
      <h1 className="h4 mb-3">Menú principal</h1>
      <p className="text-muted">Accede a las secciones a través de un menú visual.</p>

      <div className="row g-3">
        {TILES.map((tile) => (
          <div className="col-12 col-sm-6 col-lg-3" key={tile.key}>
            <div className={`card shadow-sm h-100 menu-tile ${open === tile.key ? "border-primary" : ""}`}>
              {/* Título */}
              <div className="tile-title">
                <FontAwesomeIcon icon={tile.icon} className="me-2" />
                {tile.label}
              </div>

              {/* Imagen con PNG/GIF swap, recorte seguro y padding */}
              <div
                className="tile-hero"
                role="button"
                tabIndex={0}
                onClick={() => toggle(tile.key)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggle(tile.key)}
                title="Abrir opciones"
              >
                <div className="tile-hero-inner">
                  {/* Estática (PNG) */}
                  <img src={tile.imgPng} alt={`${tile.label} estático`} className="img-static" />
                  {/* Animada (GIF) */}
                  <img src={tile.imgGif} alt={`${tile.label} animado`} className="img-animated" />
                </div>
              </div>

              {/* Header acordeón */}
              <div
                className="tile-header d-flex align-items-center justify-content-between"
                role="button"
                tabIndex={0}
                onClick={() => toggle(tile.key)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggle(tile.key)}
              >
                <div className="text-secondary small">Opciones</div>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`chev ${open === tile.key ? "open" : ""}`}
                />
              </div>

              {/* Body (acordeón) */}
              {open === tile.key && (
                <div className="tile-body pt-0">
                  <div className="list-group list-group-flush">
                    {tile.children.map((ch) => (
                      <Link
                        key={ch.to}
                        to={ch.to}
                        className="list-group-item list-group-item-action d-flex align-items-center gap-2"
                      >
                        <FontAwesomeIcon icon={ch.icon} className="text-muted" />
                        <span>{ch.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
