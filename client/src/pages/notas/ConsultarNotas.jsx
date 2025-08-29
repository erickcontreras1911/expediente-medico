// src/pages/notas/ConsultarNotas.jsx
import React from "react";

export default function ConsultarNotas() {
  const [notas] = React.useState([
    {
      id: 1,
      fecha: "01/08/2025",
      hora: "09:15",
      medico: "Dra. Andrea Pérez",
      diagnostico: "Faringoamigdalitis aguda",
      motivo: "Dolor de garganta, odinofagia y congestión nasal desde hace 2 días.",
      exploracion: "T° 37.0°C, FC 79 lpm, PA 119/78 mmHg. Amígdalas hiperémicas, sin exudado.",
      impresion: "Faringoamigdalitis aguda no complicada.",
      plan: "Paracetamol 500 mg c/8h por 3 días, Loratadina 10 mg 1 diaria por 5 días. Control en 72 h."
    },
    {
      id: 2,
      fecha: "05/08/2025",
      hora: "10:40",
      medico: "Dr. Luis Hernández",
      diagnostico: "Rinitis alérgica",
      motivo: "Estornudos, rinorrea hialina y prurito nasal estacional.",
      exploracion: "Cornetes hipertrofiados, mucosa pálida. T° 36.8°C, FC 76 lpm, PA 118/76.",
      impresion: "Rinitis alérgica estacional.",
      plan: "Antihistamínico VO por 10 días, lavados nasales, evitar alérgenos; control PRN."
    },
    {
      id: 3,
      fecha: "12/08/2025",
      hora: "08:05",
      medico: "Dra. Andrea Pérez",
      diagnostico: "Control de asma leve",
      motivo: "Revisión periódica, refiere tos nocturna 1–2 veces/semana.",
      exploracion: "FR 18, SatO₂ 98%, auscultación sin sibilancias en reposo.",
      impresion: "Asma leve intermitente en control.",
      plan: "Mantener plan de acción, evaluar técnica inhalatoria, control en 1 mes."
    }
  ]);

  const [abierta, setAbierta] = React.useState(false);
  const [seleccionada, setSeleccionada] = React.useState(null);

  const abrirNota = (nota) => {
    setSeleccionada(nota);
    setAbierta(true);
  };

  const cerrarModal = () => {
    setAbierta(false);
    setTimeout(() => setSeleccionada(null), 150);
  };

  // Cerrar con ESC
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") cerrarModal(); };
    if (abierta) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [abierta]);

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white d-flex align-items-center justify-content-between">
        <h1 className="h6 mb-0">Notas médicas</h1>
        <div className="text-muted small">{notas.length} notas</div>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: 140 }}>Fecha</th>
                <th>Diagnóstico</th>
                <th style={{ width: 220 }}>Médico</th>
                <th style={{ width: 140 }}></th>
              </tr>
            </thead>
            <tbody>
              {notas.map((n) => (
                <tr key={n.id}>
                  <td>
                    <div className="fw-semibold">{n.fecha}</div>
                    <div className="text-muted small">{n.hora} h</div>
                  </td>
                  <td>
                    <div className="fw-semibold">{n.diagnostico}</div>
                    <div className="text-muted small text-truncate" style={{ maxWidth: 420 }}>
                      {n.motivo}
                    </div>
                  </td>
                  <td className="text-muted">{n.medico}</td>
                  <td className="text-end">
                    <button className="btn btn-outline-primary btn-sm" onClick={() => abrirNota(n)}>
                      Ver nota
                    </button>
                  </td>
                </tr>
              ))}
              {notas.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">
                    Sin notas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL simple en React (sin Bootstrap JS) */}
      {abierta && (
        <>
          {/* backdrop */}
          <div
            className="modal-backdrop fade show"
            onClick={cerrarModal}
            style={{ cursor: "pointer" }}
          />
          {/* modal */}
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notaTitulo"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 id="notaTitulo" className="modal-title">
                    Nota médica — {seleccionada?.fecha} {seleccionada?.hora} h
                  </h5>
                  <button type="button" className="btn-close" aria-label="Cerrar" onClick={cerrarModal}></button>
                </div>
                <div className="modal-body">
                  {seleccionada && (
                    <>
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Médico</label>
                          <input className="form-control" readOnly value={seleccionada.medico} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Diagnóstico</label>
                          <input className="form-control" readOnly value={seleccionada.diagnostico} />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Motivo de consulta</label>
                        <textarea className="form-control" rows={2} readOnly value={seleccionada.motivo} />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Exploración física</label>
                        <textarea className="form-control" rows={2} readOnly value={seleccionada.exploracion} />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Impresión diagnóstica</label>
                        <textarea className="form-control" rows={2} readOnly value={seleccionada.impresion} />
                      </div>

                      <div>
                        <label className="form-label">Plan</label>
                        <textarea className="form-control" rows={3} readOnly value={seleccionada.plan} />
                      </div>
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-outline-secondary" onClick={cerrarModal}>Cerrar</button>
                  <button className="btn btn-primary" onClick={() => window.print()}>
                    Imprimir (demo)
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Evitar scroll del body mientras el modal está abierto */}
          <style>{`body { overflow: hidden; }`}</style>
        </>
      )}
    </div>
  );
}
