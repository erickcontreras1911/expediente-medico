// src/pages/reportes/ConsultarReportes.jsx
import React from "react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFileExcel } from "@fortawesome/free-solid-svg-icons";

export default function ConsultarReportes() {
  // 4 reportes (2 Excel, 2 PDF) con datos ficticios
  const reportes = [
    {
      id: "r1",
      tipo: "excel",
      titulo: "Pacientes registrados",
      desc: "Listado general de pacientes activos con datos de contacto.",
      file: "pacientes_registrados",
      rows: [
        { Codigo: "PAC-000123", Nombre: "María López", Telefono: "5555-4444", Correo: "maria@example.com" },
        { Codigo: "PAC-000341", Nombre: "Juan Pérez",  Telefono: "5555-3333", Correo: "juan@example.com" },
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
        { Fecha: "01/08/2025", Hora: "09:00", Paciente: "Juan Pérez",    Estado: "Atendida" },
        { Fecha: "05/08/2025", Hora: "10:30", Paciente: "María López",   Estado: "Pendiente" },
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
        { Fecha: "01/08/2025", Paciente: "María López",   Dx: "Faringoamigdalitis aguda" },
        { Fecha: "05/08/2025", Paciente: "Juan Pérez",    Dx: "Rinitis alérgica" },
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

  const fechaISO = () => new Date().toISOString().slice(0, 10);

  const descargarExcel = (rep) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rep.rows);
    XLSX.utils.book_append_sheet(wb, ws, rep.titulo.slice(0, 31)); // máx 31 chars
    XLSX.writeFile(wb, `${rep.file}_${fechaISO()}.xlsx`);
  };

  const descargarPDF = (rep) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const left = 48; let y = 64;

    doc.setFontSize(16);
    doc.text(rep.titulo, left, y); y += 16;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(rep.desc, left, y); y += 20;

    doc.setTextColor(0);
    doc.setFontSize(11);

    const keys = Object.keys(rep.rows[0] || {});
    doc.text(keys.join("  |  "), left, y);
    y += 8; doc.line(left, y, 550, y); y += 16;

    rep.rows.forEach((row) => {
      if (y > 760) { doc.addPage(); y = 64; }
      const line = keys.map((k) => String(row[k])).join("  |  ");
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
}
