// src/pages/signos/ConsultarSignos.jsx
import React from "react";
import Chart from "chart.js/auto";

export default function ConsultarSignos() {
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
    const d = new Date(), p = (n) => String(n).padStart(2, "0");
    return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
  };

  // renderiza / actualiza la gráfica cuando cambian los datos
  React.useEffect(() => {
    const labels = signos.map((s) => s.fecha);
    const dsTemp = signos.map((s) => s.temp);
    const dsFC = signos.map((s) => s.fc);
    const dsSpO2 = signos.map((s) => s.spo2);

    // destruir si existe (StrictMode/HMR)
    chartRef.current?.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "FC (lpm)", data: dsFC, tension: 0.35, borderWidth: 2 },
          { label: "SpO₂ (%)", data: dsSpO2, tension: 0.35, borderWidth: 2 },
          { label: "Temp (°C)", data: dsTemp, tension: 0.35, borderWidth: 2, yAxisID: "y1" },
        ],
      },
      options: {
        responsive: true,
        interaction: { mode: "index", intersect: false },
        plugins: { legend: { position: "top" } },
        scales: {
          y: { suggestedMin: 60, suggestedMax: 110, title: { display: true, text: "FC / SpO₂" } },
          y1: { position: "right", suggestedMin: 35, suggestedMax: 39, title: { display: true, text: "Temp" } },
        },
      },
    });

    // cleanup
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [signos]);

  // manejo de formulario (no controlado para mantener simple)
  const handleAgregar = () => {
    const pas = Number(document.getElementById("pa_sis")?.value || 120);
    const pad = Number(document.getElementById("pa_dia")?.value || 80);
    const temp = Number(document.getElementById("temp")?.value || 36.9);
    const fc = Number(document.getElementById("fc")?.value || 80);
    const spo2 = Number(document.getElementById("spo2")?.value || 98);

    setSignos((prev) => [...prev, { fecha: hoy(), temp, fc, pas, pad, spo2 }]);
    // limpia inputs (opcional)
    ["pa_sis", "pa_dia", "temp", "fc", "spo2"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
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
                  <td>
                    {s.pas}/{s.pad}
                  </td>
                  <td>{s.spo2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
