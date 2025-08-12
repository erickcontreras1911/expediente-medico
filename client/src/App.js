import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import AppLayout from "./layouts/AppLayout";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFileExcel } from "@fortawesome/free-solid-svg-icons";


const Home = () => {
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // si ya hay un chart, destrúyelo (evita el error en HMR/StrictMode)
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
        datasets: [
          {
            label: "Pacientes atendidos",
            data: [32, 45, 50, 42, 60, 70, 66],
            borderColor: "#0d6efd",
            backgroundColor: "rgba(13,110,253,0.2)",
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" } }
      }
    });

    // cleanup: destruir al desmontar o al re-ejecutar efecto
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  const citas = [
    { fecha: "12/08/2025", hora: "09:00", paciente: "Juan Pérez", motivo: "Consulta general" },
    { fecha: "12/08/2025", hora: "10:30", paciente: "María López", motivo: "Control post-operatorio" },
    { fecha: "12/08/2025", hora: "11:15", paciente: "Carlos Martínez", motivo: "Revisión de laboratorio" }
  ];

  return (
    <div className="container-fluid">
      <h1 className="h4 mb-4">Dashboard</h1>

      {/* Tarjetas resumen */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-white border-primary shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Pacientes</h5>
              <h2 className="fw-bold">124</h2>
              <p className="mb-0 small">Registrados este año</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-white border-primary shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Citas</h5>
              <h2 className="fw-bold">87</h2>
              <p className="mb-0 small">En el último mes</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-white border-primary shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Notas médicas</h5>
              <h2 className="fw-bold">240</h2>
              <p className="mb-0 small">Registradas en total</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-white border-primary shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Signos vitales</h5>
              <h2 className="fw-bold">360</h2>
              <p className="mb-0 small">Registros históricos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfica */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white">
          <h6 className="mb-0">Pacientes atendidos por mes</h6>
        </div>
        <div className="card-body">
          <canvas ref={canvasRef} height="100" />
        </div>
      </div>

      {/* Próximas citas */}
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h6 className="mb-0">Próximas citas</h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Paciente</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((c, i) => (
                  <tr key={i}>
                    <td>{c.fecha}</td>
                    <td>{c.hora}</td>
                    <td>{c.paciente}</td>
                    <td>{c.motivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const Ficha = () => (
  <div className="card shadow-sm">
    <div className="card-header bg-white">
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <div className="fw-semibold">María Fernanda López García</div>
          <div className="text-muted small">Código: PAC-000123 · CUI: 1234 56789 0101</div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={()=>window.print()}>
            <i className="fa-solid fa-print me-1" /> Imprimir
          </button>
          <button className="btn btn-success btn-sm">
            <i className="fa-regular fa-pen-to-square me-1" /> Editar
          </button>
        </div>
      </div>
    </div>

    <div className="card-body">
      {/* ENCABEZADO: FOTO + RESUMEN */}
      <div className="row g-4 align-items-start mb-2">
        <div className="col-auto">
          <img
            src="https://cdn-icons-png.flaticon.com/512/6812/6812879.png"
            alt="Foto del paciente"
            className="rounded-3 border"
            style={{ width: 128, height: 128, objectFit: "cover" }}
          />
        </div>
        <div className="col">
          <div className="row g-3">
            <div className="col-6 col-lg-3">
              <label className="form-label">Sexo</label>
              <input className="form-control" value="Femenino" readOnly />
            </div>
            <div className="col-6 col-lg-3">
              <label className="form-label">Fecha de nacimiento</label>
              <input className="form-control" value="15/04/1992" readOnly />
            </div>
            <div className="col-6 col-lg-3">
              <label className="form-label">Edad</label>
              <input className="form-control" value="33 años" readOnly />
            </div>
            <div className="col-6 col-lg-3">
              <label className="form-label">Estado civil</label>
              <input className="form-control" value="Soltera" readOnly />
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      {/* DATOS GENERALES */}
      <h6 className="mb-3">Datos generales</h6>
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Teléfono</label>
          <input className="form-control" value="5555-4444" readOnly />
        </div>
        <div className="col-md-4">
          <label className="form-label">Correo</label>
          <input className="form-control" value="maria@example.com" readOnly />
        </div>
        <div className="col-md-4">
          <label className="form-label">Tipo de sangre</label>
          <input className="form-control" value="O+" readOnly />
        </div>
        <div className="col-12">
          <label className="form-label">Dirección</label>
          <input className="form-control" value="6a Av 12-34 Zona 1, Guatemala" readOnly />
        </div>
        <div className="col-md-6">
          <label className="form-label">Aseguradora</label>
          <input className="form-control" value="Seguros AS2" readOnly />
        </div>
        <div className="col-md-6">
          <label className="form-label">Póliza</label>
          <input className="form-control" value="POL-88992" readOnly />
        </div>
      </div>

      <hr className="my-4" />

      {/* RESPONSABLE / CONTACTO DE EMERGENCIA */}
      <h6 className="mb-3">Responsables y contacto de emergencia</h6>
      <div className="row g-3">
        <div className="col-md-6">
          <div className="border rounded p-3 h-100">
            <div className="fw-semibold mb-2">
              <i className="fa-solid fa-user-shield me-2" />
              Responsable principal
            </div>
            <div className="row g-2">
              <div className="col-12 col-lg-6">
                <label className="form-label">Nombre</label>
                <input className="form-control" value="Juan López" readOnly />
              </div>
              <div className="col-6 col-lg-3">
                <label className="form-label">Parentesco</label>
                <input className="form-control" value="Hermano" readOnly />
              </div>
              <div className="col-6 col-lg-3">
                <label className="form-label">Teléfono</label>
                <input className="form-control" value="5555-2222" readOnly />
              </div>
              <div className="col-12">
                <label className="form-label">Dirección</label>
                <input className="form-control" value="7a Av A 14-36, Guatemala" readOnly />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="border rounded p-3 h-100">
            <div className="fw-semibold mb-2">
              <i className="fa-solid fa-phone-volume me-2" />
              Contacto de emergencia (alterno)
            </div>
            <div className="row g-2">
              <div className="col-12 col-lg-6">
                <label className="form-label">Nombre</label>
                <input className="form-control" value="Ana Soto" readOnly />
              </div>
              <div className="col-6 col-lg-3">
                <label className="form-label">Parentesco</label>
                <input className="form-control" value="Amiga" readOnly />
              </div>
              <div className="col-6 col-lg-3">
                <label className="form-label">Teléfono</label>
                <input className="form-control" value="5555-1111" readOnly />
              </div>
              <div className="col-12">
                <label className="form-label">Observaciones</label>
                <input className="form-control" value="Disponible en horario laboral" readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      {/* ALERGIAS / CONDICIONES / ALERTAS */}
      <div className="row g-3">
        <div className="col-lg-4">
          <h6 className="mb-2">Alergias</h6>
          <div className="d-flex flex-wrap gap-2">
            <span className="badge text-bg-light border">Penicilina</span>
            <span className="badge text-bg-light border">Ambiente (polen)</span>
            <span className="badge text-bg-light border">Mariscos</span>
          </div>
        </div>
        <div className="col-lg-4">
          <h6 className="mb-2">Condiciones médicas</h6>
          <ul className="mb-0 small">
            <li>Asma leve intermitente</li>
            <li>Rinitis alérgica</li>
          </ul>
        </div>
        <div className="col-lg-4">
          <h6 className="mb-2">Alertas</h6>
          <div className="border rounded p-2 small bg-warning-subtle">
            <i className="fa-solid fa-triangle-exclamation me-2" />
            Evitar antibióticos del grupo betalactámicos.
          </div>
        </div>
      </div>

      <hr className="my-4" />

      {/* INFORMACIÓN IMPORTANTE */}
      <h6 className="mb-2">Información importante</h6>
      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label">Peso</label>
          <input className="form-control" value="62 kg" readOnly />
        </div>
        <div className="col-md-3">
          <label className="form-label">Talla</label>
          <input className="form-control" value="1.64 m" readOnly />
        </div>
        <div className="col-md-3">
          <label className="form-label">IMC (aprox.)</label>
          <input className="form-control" value="23.0" readOnly />
        </div>
        <div className="col-md-3">
          <label className="form-label">Última actualización</label>
          <input className="form-control" value="12/08/2025" readOnly />
        </div>
        <div className="col-12">
          <label className="form-label">Notas</label>
          <textarea className="form-control" rows={3} readOnly>
Paciente con control periódico trimestral. Indicar inhalador de rescate en caso de crisis.
          </textarea>
        </div>
      </div>
    </div>
  </div>
);

const Signos = () => {
  const [signos, setSignos] = React.useState([
    { fecha: "01/08/2025", temp: 36.8, fc: 78, pas: 118, pad: 76, spo2: 98 },
    { fecha: "05/08/2025", temp: 37.1, fc: 82, pas: 120, pad: 80, spo2: 97 },
    { fecha: "10/08/2025", temp: 36.7, fc: 76, pas: 115, pad: 74, spo2: 99 },
    { fecha: "12/08/2025", temp: 37.0, fc: 79, pas: 119, pad: 78, spo2: 98 },
  ]);

  // refs para el canvas y la instancia Chart
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);

  // helpers
  const hoy = () => {
    const d = new Date(), p = n => String(n).padStart(2, "0");
    return `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()}`;
  };

  // renderiza / actualiza la gráfica cuando cambian los datos
  React.useEffect(() => {
    const labels = signos.map(s => s.fecha);
    const dsTemp = signos.map(s => s.temp);
    const dsFC   = signos.map(s => s.fc);
    const dsSpO2 = signos.map(s => s.spo2);

    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "FC (lpm)", data: dsFC, tension: 0.35, borderWidth: 2 },
          { label: "SpO₂ (%)", data: dsSpO2, tension: 0.35, borderWidth: 2 },
          { label: "Temp (°C)", data: dsTemp, tension: 0.35, borderWidth: 2, yAxisID: "y1" },
        ]
      },
      options: {
        responsive: true,
        interaction: { mode: "index", intersect: false },
        plugins: { legend: { position: "top" } },
        scales: {
          y:  { suggestedMin: 60, suggestedMax: 110, title: { display: true, text: "FC / SpO₂" } },
          y1: { position: "right", suggestedMin: 35, suggestedMax: 39, title: { display: true, text: "Temp" } }
        }
      }
    });

    // cleanup
    return () => chartRef.current?.destroy();
  }, [signos]);

  // manejo de formulario (no controlado para mantener simple)
  const handleAgregar = () => {
    const pas = Number(document.getElementById("pa_sis")?.value || 120);
    const pad = Number(document.getElementById("pa_dia")?.value || 80);
    const temp = Number(document.getElementById("temp")?.value || 36.9);
    const fc = Number(document.getElementById("fc")?.value || 80);
    const spo2 = Number(document.getElementById("spo2")?.value || 98);

    setSignos(prev => [...prev, { fecha: hoy(), temp, fc, pas, pad, spo2 }]);
    // limpia inputs (opcional)
    ["pa_sis","pa_dia","temp","fc","spo2"].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white d-flex align-items-center justify-content-between">
        <h1 className="h6 mb-0">Signos vitales</h1>
        <div className="small text-muted">Última toma: {signos.at(-1)?.fecha ?? "-"}</div>
      </div>

      <div className="card-body">
        <div className="row g-4">
          {/* Gráfica */}
          <div className="col-lg-8">
            <canvas ref={canvasRef} height="140" />
          </div>

          {/* Formulario rápido */}
          <div className="col-lg-4">
            <form className="row g-3">
              <div className="col-12">
                <label className="form-label">Presión arterial (mmHg)</label>
                <div className="input-group">
                  <input type="number" className="form-control" placeholder="Sistólica" id="pa_sis" />
                  <span className="input-group-text">/</span>
                  <input type="number" className="form-control" placeholder="Diastólica" id="pa_dia" />
                </div>
              </div>
              <div className="col-6">
                <label className="form-label">Temperatura (°C)</label>
                <input type="number" step="0.1" className="form-control" id="temp" placeholder="36.8" />
              </div>
              <div className="col-6">
                <label className="form-label">Frec. Cardíaca (lpm)</label>
                <input type="number" className="form-control" id="fc" placeholder="78" />
              </div>
              <div className="col-12">
                <label className="form-label">SpO₂ (%)</label>
                <input type="number" className="form-control" id="spo2" placeholder="98" />
              </div>
              <div className="col-12 d-grid">
                <button type="button" className="btn btn-primary" onClick={handleAgregar}>
                  <i className="fa-solid fa-plus me-1"></i> Guardar (demo)
                </button>
              </div>
            </form>
          </div>
        </div>

        <hr className="my-4" />

        {/* Tabla */}
        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead className="table-light">
              <tr>
                <th>Fecha</th>
                <th>Temp (°C)</th>
                <th>FC (lpm)</th>
                <th>PA (mmHg)</th>
                <th>SpO₂ (%)</th>
              </tr>
            </thead>
            <tbody>
              {signos.map((s, i) => (
                <tr key={`${s.fecha}-${i}`}>
                  <td>{s.fecha}</td>
                  <td>{s.temp.toFixed(1)}</td>
                  <td>{s.fc}</td>
                  <td>{s.pas}/{s.pad}</td>
                  <td>{s.spo2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

const Notas = () => {
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
    // pequeña demora para limpiar después de la animación si quieres
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
                <th style={{width: 140}}>Fecha</th>
                <th>Diagnóstico</th>
                <th style={{width: 220}}>Médico</th>
                <th style={{width: 140}}></th>
              </tr>
            </thead>
            <tbody>
              {notas.map(n => (
                <tr key={n.id}>
                  <td>
                    <div className="fw-semibold">{n.fecha}</div>
                    <div className="text-muted small">{n.hora} h</div>
                  </td>
                  <td>
                    <div className="fw-semibold">{n.diagnostico}</div>
                    <div className="text-muted small text-truncate" style={{maxWidth: 420}}>
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
                  <td colSpan={4} className="text-center text-muted py-4">Sin notas registradas.</td>
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
                  <h5 id="notaTitulo" className="modal-title">Nota médica — {seleccionada?.fecha} {seleccionada?.hora} h</h5>
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
                        <textarea className="form-control" rows={2} readOnly defaultValue={seleccionada.motivo} />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Exploración física</label>
                        <textarea className="form-control" rows={2} readOnly defaultValue={seleccionada.exploracion} />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Impresión diagnóstica</label>
                        <textarea className="form-control" rows={2} readOnly defaultValue={seleccionada.impresion} />
                      </div>

                      <div>
                        <label className="form-label">Plan</label>
                        <textarea className="form-control" rows={3} readOnly defaultValue={seleccionada.plan} />
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
          {/* Evita scroll del body al abrir modal */}
          <style>{`body { overflow: hidden; }`}</style>
        </>
      )}
    </div>
  );
};

const Citas = () => {
  const [doctorSel, setDoctorSel] = React.useState("aperez");
  const [busqueda, setBusqueda] = React.useState("");

  const citas = React.useMemo(() => ([
    {
      id: "c1",
      fecha: "2025-08-12", hora: "09:00",
      motivo: "Consulta general",
      consultorio: "A-101",
      doctorId: "aperez", doctorNombre: "Dra. Andrea Pérez",
      paciente: { id: "123", nombre: "Juan Pérez", edad: 41, codigo: "PAC-000341" }
    },
    {
      id: "c2",
      fecha: "2025-08-12", hora: "10:30",
      motivo: "Control post-operatorio",
      consultorio: "A-101",
      doctorId: "aperez", doctorNombre: "Dra. Andrea Pérez",
      paciente: { id: "124", nombre: "María López", edad: 33, codigo: "PAC-000123" }
    },
    {
      id: "c4",
      fecha: "2025-08-13", hora: "08:10",
      motivo: "Control de asma",
      consultorio: "B-201",
      doctorId: "aperez", doctorNombre: "Dra. Andrea Pérez",
      paciente: { id: "126", nombre: "Ana Soto", edad: 29, codigo: "PAC-000228" }
    }
  ]), []);

  const toDateTime = (f, h) => new Date(`${f}T${h}:00`);
  const fDate = (iso) => {
    const d = new Date(iso);
    const p = (n) => String(n).padStart(2,"0");
    return `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()}`;
  };

  const citasFiltradas = React.useMemo(() => {
    return citas
      .filter(c => c.doctorId === doctorSel)
      .filter(c => c.paciente.nombre.toLowerCase().includes(busqueda.toLowerCase()))
      .sort((a,b) => toDateTime(a.fecha,a.hora) - toDateTime(b.fecha,b.hora));
  }, [citas, doctorSel, busqueda]);

  const atenderCita = (cita) => {
    alert(`Atendiendo a ${cita.paciente.nombre} (${cita.fecha} ${cita.hora})`);
  };

  return (
    <div className="container-fluid">
      {/* Filtros */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Citas programadas</h1>
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            style={{ minWidth: 220 }}
            value={doctorSel}
            onChange={(e)=>setDoctorSel(e.target.value)}
          >
            <option value="aperez">Dra. Andrea Pérez</option>
            <option value="lhernandez">Dr. Luis Hernández</option>
          </select>
          <input
            className="form-control form-control-sm"
            placeholder="Buscar paciente..."
            value={busqueda}
            onChange={(e)=>setBusqueda(e.target.value)}
            style={{ minWidth: 220 }}
          />
        </div>
      </div>

      {/* Lista de citas */}
      {citasFiltradas.length === 0 ? (
        <div className="alert alert-light border" role="alert">
          No hay citas para mostrar con los filtros actuales.
        </div>
      ) : (
        <div className="row g-3">
          {citasFiltradas.map(c => (
            <div className="col-12 col-md-6 col-xl-4" key={c.id}>
              <div className="card border border-secondary-subtle shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  {/* Encabezado con foto y nombre */}
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.paciente.nombre)}&background=dee2e6&color=495057`}
                      alt={c.paciente.nombre}
                      className="rounded-circle me-3"
                      width="48"
                      height="48"
                    />
                    <div>
                      <h6 className="mb-0">{c.paciente.nombre}</h6>
                      <small className="text-muted">{c.paciente.codigo} · {c.paciente.edad} años</small>
                    </div>
                  </div>

                  {/* Datos de la cita */}
                  <div className="mb-2 small text-muted">
                    <i className="fa-regular fa-calendar me-1" />
                    {fDate(c.fecha)} &nbsp;·&nbsp;
                    <i className="fa-regular fa-clock me-1" />
                    {c.hora}
                  </div>
                  <div className="mb-2 small text-muted">
                    <i className="fa-solid fa-door-open me-1" />
                    Consultorio: {c.consultorio}
                  </div>

                  {/* Motivo */}
                  <div className="mb-3">
                    <div className="fw-semibold small text-secondary">Motivo</div>
                    <div className="border rounded p-2 small bg-light">
                      {c.motivo}
                    </div>
                  </div>

                  {/* Botón */}
                  <div className="mt-auto d-flex justify-content-end">
                    <button className="btn btn-sm btn-outline-primary" onClick={()=>atenderCita(c)}>
                      Atender cita
                    </button>
                  </div>
                </div>

                {/* Pie */}
                <div className="card-footer bg-white small text-muted">
                  Médico: {c.doctorNombre} — ID cita: {c.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Reportes = () => {
  // Definición de 4 reportes (2 Excel, 2 PDF) con datos ficticios
  const reportes = [
    {
      id: "r1",
      tipo: "excel",
      titulo: "Pacientes registrados",
      desc: "Listado general de pacientes activos con datos de contacto.",
      file: "pacientes_registrados",
      rows: [
        { Codigo: "PAC-000123", Nombre: "María López", Telefono: "5555-4444", Correo: "maria@example.com" },
        { Codigo: "PAC-000341", Nombre: "Juan Pérez", Telefono: "5555-3333", Correo: "juan@example.com" },
        { Codigo: "PAC-000512", Nombre: "Carlos Martínez", Telefono: "5555-2222", Correo: "carlos@example.com" },
      ],
    },
    {
      id: "r2",
      tipo: "excel",
      titulo: "Citas del mes",
      desc: "Citas programadas y estado para el mes actual.",
      file: "citas_mes",
      rows: [
        { Fecha: "01/08/2025", Hora: "09:00", Paciente: "Juan Pérez", Estado: "Atendida" },
        { Fecha: "05/08/2025", Hora: "10:30", Paciente: "María López", Estado: "Pendiente" },
        { Fecha: "12/08/2025", Hora: "11:15", Paciente: "Carlos Martínez", Estado: "Reprogramada" },
      ],
    },
    {
      id: "r3",
      tipo: "pdf",
      titulo: "Notas médicas — resumen",
      desc: "Resumen breve de notas médicas registradas (diagnóstico principal).",
      file: "notas_medicas_resumen",
      rows: [
        { Fecha: "01/08/2025", Paciente: "María López", Dx: "Faringoamigdalitis aguda" },
        { Fecha: "05/08/2025", Paciente: "Juan Pérez", Dx: "Rinitis alérgica" },
        { Fecha: "12/08/2025", Paciente: "Carlos Martínez", Dx: "Asma leve intermitente" },
      ],
    },
    {
      id: "r4",
      tipo: "pdf",
      titulo: "Indicadores de signos vitales",
      desc: "Promedios de temperatura, FC y SpO₂ por semana.",
      file: "indicadores_signos_vitales",
      rows: [
        { Semana: "2025-W31", Temp: 36.9, FC: 78, SpO2: 98 },
        { Semana: "2025-W32", Temp: 37.0, FC: 80, SpO2: 97 },
        { Semana: "2025-W33", Temp: 36.8, FC: 76, SpO2: 99 },
      ],
    },
  ];

  const fechaISO = () => new Date().toISOString().slice(0,10);

  const descargarExcel = (rep) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rep.rows);
    XLSX.utils.book_append_sheet(wb, ws, rep.titulo.slice(0,31)); // nombre hoja máx 31 chars
    XLSX.writeFile(wb, `${rep.file}_${fechaISO()}.xlsx`);
  };

  const descargarPDF = (rep) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const left = 48; let y = 64;

    doc.setFontSize(16);
    doc.text(rep.titulo, left, y);
    y += 16;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(rep.desc, left, y);
    y += 20;

    doc.setTextColor(0);
    doc.setFontSize(11);
    // Encabezados simples
    const keys = Object.keys(rep.rows[0] || {});
    doc.text(keys.join("  |  "), left, y);
    y += 8;
    doc.line(left, y, 550, y);
    y += 16;

    // Filas
    rep.rows.forEach((row) => {
      const line = keys.map(k => String(row[k])).join("  |  ");
      // Salto de página simple
      if (y > 760) { doc.addPage(); y = 64; }
      doc.text(line, left, y);
      y += 18;
    });

    doc.save(`${rep.file}_${fechaISO()}.pdf`);
  };

  const handleDescargar = (rep) => {
    if (rep.tipo === "excel") return descargarExcel(rep);
    return descargarPDF(rep);
  };

  return (
    <div className="container-fluid">
      <h1 className="h4 mb-3">Reportes</h1>
      <p className="text-muted">Descarga reportes predefinidos en formato Excel o PDF.</p>

      <div className="row g-3">
        {reportes.map((rep) => (
          <div className="col-12 col-md-6 col-xl-3" key={rep.id}>
            <div className="card border border-secondary-subtle bg-white shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h6 className="mb-1">{rep.titulo}</h6>
                <p className="text-muted small mb-3">{rep.desc}</p>

                <div className="mt-auto d-grid">
                  {rep.tipo === "excel" ? (
                    <button className="btn btn-success" onClick={() => handleDescargar(rep)}>
                      <FontAwesomeIcon icon={faFileExcel} className="me-2" />
                      Descargar Excel
                    </button>
                  ) : (
                    <button className="btn btn-danger" onClick={() => handleDescargar(rep)}>
                      <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                      Descargar PDF
                    </button>
                  )}
                </div>
              </div>
              <div className="card-footer bg-white small text-muted">
                ID: {rep.id} · Actualizado: {fechaISO()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const Login = () => (
  <div className="container py-5">
    <div className="row justify-content-center">
      <div className="col-12 col-sm-8 col-md-6">
        <div className="card p-4">
          <h1 className="h4 mb-3">Iniciar sesión</h1>
          {/* formulario muy básico */}
          <input className="form-control mb-2" placeholder="Usuario" />
          <input className="form-control mb-3" placeholder="Contraseña" type="password" />
          <button className="btn btn-primary w-100">Entrar</button>
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas sin sidebar */}
        <Route path="/login" element={<Login />} />

        {/* Rutas con sidebar (layout) */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/ficha" element={<Ficha />} />
          <Route path="/signos" element={<Signos />} />
          <Route path="/notas" element={<Notas />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/config" element={<div className="card p-3"><h1 className="h4">Configuración</h1></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
