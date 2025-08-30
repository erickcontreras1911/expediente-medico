// src/pages/Home.jsx
import React from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Destruye instancia previa (StrictMode/HMR)
    chartRef.current?.destroy();

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
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" } },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  const citas = [
    { fecha: "12/08/2025", hora: "09:00", paciente: "José Pérez", motivo: "Consulta general" },
    { fecha: "12/08/2025", hora: "10:30", paciente: "José Pérez", motivo: "Control post-operatorio" },
    { fecha: "12/08/2025", hora: "11:15", paciente: "José Pérez", motivo: "Revisión de laboratorio" },
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
              <h2 className="fw-bold">325</h2>
              <p className="mb-0 small">Registrados este año</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-white border-primary shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Citas</h5>
              <h2 className="fw-bold">432</h2>
              <p className="mb-0 small">En el último mes</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-white border-primary shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Notas médicas</h5>
              <h2 className="fw-bold">345</h2>
              <p className="mb-0 small">Registradas en total</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-white border-primary shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Signos vitales</h5>
              <h2 className="fw-bold">322</h2>
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
}
