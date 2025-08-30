// src/pages/examenes/SolicitarExamenes.jsx
import React from "react";

/* ============================
   Catálogos (fuera del componente)
   ============================ */
const LABORATORIO = [
  "Hemograma completo",
  "Glucosa en ayunas",
  "Hemoglobina glicosilada (HbA1c)",
  "Perfil lipídico (CT, HDL, LDL, TG)",
  "Colesterol total",
  "HDL colesterol",
  "LDL colesterol",
  "Triglicéridos",
  "Creatinina sérica",
  "Urea",
  "Ácido úrico",
  "TGO (AST)",
  "TGP (ALT)",
  "Fosfatasa alcalina",
  "Bilirrubinas totales",
  "Proteína C Reactiva (PCR)",
  "TSH",
  "T4 libre",
  "Examen general de orina (EGO)",
  "Coprológico",
  "Coproparasitario",
  "Hemocultivo",
  "Urocultivo",
  "Beta-hCG cuantitativa",
  "VDRL",
  "ELISA VIH",
  "Ferritina sérica",
  "Vitamina D",
];

const IMAGEN = [
  "Rayos X de tórax (PA)",
  "Rayos X de columna lumbar",
  "Rayos X de extremidad",
  "Ultrasonido abdominal",
  "Ultrasonido pélvico",
  "Ultrasonido transvaginal",
  "Ultrasonido obstétrico",
  "Tomografía (TC) de cráneo",
  "Tomografía (TC) de abdomen",
  "Resonancia (RM) de rodilla",
  "Resonancia (RM) columna",
  "Mamografía",
  "Densitometría ósea",
];

const OTROS = [
  "Electrocardiograma (ECG)",
  "Holter 24 horas",
  "Prueba de esfuerzo",
  "Ecocardiograma",
  "Espirometría",
  "Endoscopia digestiva alta",
  "Colonoscopia",
  "Audiometría",
  "Optometría",
  "Papanicolaou (citología cervical)",
  "Prueba rápida VIH",
  "Grupo sanguíneo y Rh",
  "Prueba de tolerancia a la glucosa (PTGO)",
];

/* ============================
   Vista
   ============================ */
export default function SolicitarExamenes() {
  // Búsquedas por sección
  const [qLab, setQLab] = React.useState("");
  const [qImg, setQImg] = React.useState("");
  const [qOtros, setQOtros] = React.useState("");

  // Selecciones por sección (Set para toggle eficiente)
  const [selLab, setSelLab] = React.useState(new Set());
  const [selImg, setSelImg] = React.useState(new Set());
  const [selOtros, setSelOtros] = React.useState(new Set());

  // Encabezado de orden
  const [prioridad, setPrioridad] = React.useState("Rutina");
  const [fechaSugerida, setFechaSugerida] = React.useState("");
  const [observaciones, setObservaciones] = React.useState("");

  // Helpers
  const filtrar = (lista, q) =>
    lista.filter((x) => x.toLowerCase().includes(q.trim().toLowerCase()));

  // Listas filtradas (solo dependen del query)
  const labFiltrado = React.useMemo(() => filtrar(LABORATORIO, qLab), [qLab]);
  const imgFiltrado = React.useMemo(() => filtrar(IMAGEN, qImg), [qImg]);
  const otrosFiltrado = React.useMemo(() => filtrar(OTROS, qOtros), [qOtros]);

  const toggleItem = (setter, currentSet, item) => {
    const next = new Set(currentSet);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    setter(next);
  };

  const marcarTodos = (lista, setter) => setter(new Set(lista));
  const limpiarTodos = (setter) => setter(new Set());

  const totalSeleccionados = selLab.size + selImg.size + selOtros.size;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      prioridad,
      fechaSugerida: fechaSugerida || null,
      observaciones: observaciones.trim(),
      examenes: {
        laboratorio: Array.from(selLab),
        imagen: Array.from(selImg),
        otros: Array.from(selOtros),
      },
    };
    // Aquí llamarías tu API. Por ahora: vista previa en alert
    alert("Solicitud enviada (demo):\n\n" + JSON.stringify(payload, null, 2));
  };

  const limpiarTodo = () => {
    setSelLab(new Set());
    setSelImg(new Set());
    setSelOtros(new Set());
    setObservaciones("");
    setFechaSugerida("");
    setPrioridad("Rutina");
    setQLab("");
    setQImg("");
    setQOtros("");
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Solicitar estudios</h1>
        <span className="badge bg-primary-subtle text-primary">
          Seleccionados: <strong>{totalSeleccionados}</strong>
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Datos de la orden */}
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-3">
            <label className="form-label">Prioridad</label>
            <select
              className="form-select"
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value)}
            >
              <option>Rutina</option>
              <option>Preferente</option>
              <option>Urgente</option>
            </select>
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label">Fecha sugerida</label>
            <input
              type="date"
              className="form-control"
              value={fechaSugerida}
              onChange={(e) => setFechaSugerida(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Observaciones / Indicaciones</label>
            <input
              className="form-control"
              placeholder="Ayuno, suspender anticoagulantes, llevar estudios previos, etc."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>
        </div>

        {/* Sección: Laboratorio clínico */}
        <Section
          title="Laboratorio clínico"
          query={qLab}
          setQuery={setQLab}
          items={labFiltrado}
          totalOriginal={LABORATORIO.length}
          selected={selLab}
          toggle={(name) => toggleItem(setSelLab, selLab, name)}
          selectAll={() =>
            marcarTodos(labFiltrado.length ? labFiltrado : LABORATORIO, setSelLab)
          }
          clearAll={() => limpiarTodos(setSelLab)}
        />

        {/* Sección: Diagnóstico por imágenes */}
        <Section
          title="Diagnóstico por imágenes"
          query={qImg}
          setQuery={setQImg}
          items={imgFiltrado}
          totalOriginal={IMAGEN.length}
          selected={selImg}
          toggle={(name) => toggleItem(setSelImg, selImg, name)}
          selectAll={() =>
            marcarTodos(imgFiltrado.length ? imgFiltrado : IMAGEN, setSelImg)
          }
          clearAll={() => limpiarTodos(setSelImg)}
        />

        {/* Sección: Otros estudios */}
        <Section
          title="Otros estudios"
          query={qOtros}
          setQuery={setQOtros}
          items={otrosFiltrado}
          totalOriginal={OTROS.length}
          selected={selOtros}
          toggle={(name) => toggleItem(setSelOtros, selOtros, name)}
          selectAll={() =>
            marcarTodos(otrosFiltrado.length ? otrosFiltrado : OTROS, setSelOtros)
          }
          clearAll={() => limpiarTodos(setSelOtros)}
        />

        {/* Resumen */}
        <div className="card mt-3 border border-secondary-subtle">
          <div className="card-body">
            <h6 className="mb-2">Resumen de selección</h6>
            <Summary label="Laboratorio" set={selLab} />
            <Summary label="Imágenes" set={selImg} />
            <Summary label="Otros" set={selOtros} />
          </div>
        </div>

        {/* Acciones */}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-outline-secondary" onClick={limpiarTodo}>
            Limpiar todo
          </button>
          <button type="submit" className="btn btn-primary" disabled={totalSeleccionados === 0}>
            Enviar solicitud
          </button>
        </div>
      </form>
    </div>
  );
}

/* ============================
   Subcomponentes
   ============================ */

function Section({
  title,
  query,
  setQuery,
  items,
  totalOriginal,
  selected,
  toggle,
  selectAll,
  clearAll,
}) {
  return (
    <div className="card mb-3 border border-secondary-subtle bg-white shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h6 className="mb-0">{title}</h6>
          <div className="text-muted small">
            {selected.size} seleccionados · {items.length}/{totalOriginal} visibles
          </div>
        </div>

        <div className="row g-2 align-items-center mb-2">
          <div className="col-12 col-md-6">
            <input
              className="form-control form-control-sm"
              placeholder="Buscar en esta sección…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
            <button type="button" className="btn btn-sm btn-outline-success" onClick={selectAll}>
              Seleccionar todo
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={clearAll}>
              Limpiar
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="alert alert-light border py-2 mb-0">
            No hay resultados para el filtro actual.
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-2">
            {items.map((name) => {
              const id = `${title}-${name}`;
              const checked = selected.has(name);
              return (
                <div className="col" key={id}>
                  <label
                    className="border rounded px-2 py-2 w-100 d-flex align-items-center gap-2"
                    style={{ cursor: "pointer" }}
                  >
                    <input
                      className="form-check-input me-1"
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(name)}
                    />
                    <span className="small">{name}</span>
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Summary({ label, set }) {
  if (set.size === 0) {
    return (
      <div className="small text-muted mb-1">
        {label}: — (sin selección)
      </div>
    );
    }
  return (
    <div className="mb-2">
      <div className="small fw-semibold mb-1">{label}:</div>
      <div className="d-flex flex-wrap gap-1">
        {Array.from(set).map((x) => (
          <span className="badge text-bg-light border" key={`${label}-${x}`}>
            {x}
          </span>
        ))}
      </div>
    </div>
  );
}
