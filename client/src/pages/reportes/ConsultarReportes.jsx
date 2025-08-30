// src/pages/reportes/ConsultarReportes.jsx
import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFileExcel } from "@fortawesome/free-solid-svg-icons";

export default function ConsultarReportes() {
  /* ========= Config ========= */
  const LOGO_PATH = "/img/icono.png";   // coloca icono.png en public/img
  const LOGO_FORMAT = "PNG";            // formato para addImage
  const PRIMARY = [47, 93, 162];        // color encabezado tablas PDF
  const TEXT_DARK = [30, 30, 30];

  const logoDataUrlRef = useRef(null);

  // Carga imagen y la RECORTA a CUADRADO (centro) -> DataURL PNG
  const loadSquareDataURL = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const side = Math.min(img.naturalWidth, img.naturalHeight);
          const sx = (img.naturalWidth - side) / 2;
          const sy = (img.naturalHeight - side) / 2;

          const canvas = document.createElement("canvas");
          canvas.width = side;
          canvas.height = side;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, sx, sy, side, side, 0, 0, side, side);

          resolve(canvas.toDataURL("image/png"));
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = reject;
      img.src = url;
    });

  const ensureLogoLoaded = async () => {
    if (logoDataUrlRef.current) return;
    try {
      logoDataUrlRef.current = await loadSquareDataURL(LOGO_PATH);
    } catch {
      logoDataUrlRef.current = null; // seguir sin logo si falla
    }
  };

  const fechaISO = () => new Date().toISOString().slice(0, 10);
  const hoyLegible = () =>
    new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });

  /* ========= Datos: 10 reportes (5 Excel, 5 PDF) ========= */
  const excelReports = [
    {
      id: "x1",
      tipo: "excel",
      titulo: "Pacientes — Listado Maestro",
      desc: "Pacientes activos y medios de contacto.",
      file: "pacientes_listado_maestro",
      rows: [
        { Codigo: "PAC-001", Nombres: "María López", Telefono: "5555-4444", Correo: "maria@example.com", Estado: "Activo" },
        { Codigo: "PAC-002", Nombres: "Juan Pérez", Telefono: "5555-3333", Correo: "juan@example.com", Estado: "Activo" },
        { Codigo: "PAC-003", Nombres: "Carlos Martínez", Telefono: "5555-2222", Correo: "carlos@example.com", Estado: "Inactivo" },
        { Codigo: "PAC-004", Nombres: "Ana García", Telefono: "5555-1111", Correo: "ana@example.com", Estado: "Activo" },
      ],
    },
    {
      id: "x2",
      tipo: "excel",
      titulo: "Citas Pendientes — Próximas 2 semanas",
      desc: "Citas con estado Pendiente y por confirmar.",
      file: "citas_pendientes_quincena",
      rows: [
        { Fecha: "01/09/2025", Hora: "09:00", Paciente: "María López", Motivo: "Control general", Estado: "Pendiente" },
        { Fecha: "03/09/2025", Hora: "10:30", Paciente: "Juan Pérez", Motivo: "Resfriado", Estado: "Pendiente" },
        { Fecha: "07/09/2025", Hora: "11:15", Paciente: "Ana García", Motivo: "Dolor lumbar", Estado: "Confirmada" },
        { Fecha: "10/09/2025", Hora: "08:45", Paciente: "Carlos Martínez", Motivo: "Chequeo anual", Estado: "Pendiente" },
      ],
    },
    {
      id: "x3",
      tipo: "excel",
      titulo: "Citas Realizadas — Último Mes",
      desc: "Histórico de citas completadas con diagnóstico corto.",
      file: "citas_realizadas_ultimo_mes",
      rows: [
        { Fecha: "12/08/2025", Hora: "10:00", Paciente: "Juan Pérez", Dx: "Rinitis alérgica" },
        { Fecha: "15/08/2025", Hora: "09:30", Paciente: "María López", Dx: "Faringitis aguda" },
        { Fecha: "21/08/2025", Hora: "12:00", Paciente: "Carlos Martínez", Dx: "Asma leve" },
        { Fecha: "25/08/2025", Hora: "11:15", Paciente: "Ana García", Dx: "Dolor lumbar mecánico" },
      ],
    },
    {
      id: "x4",
      tipo: "excel",
      titulo: "Notas Médicas",
      desc: "Diagnósticos frecuentes (conteo) para muestra.",
      file: "notas_medicas_conteo_dx",
      rows: [
        { Diagnostico: "Rinitis alérgica", Casos: 12 },
        { Diagnostico: "Faringitis", Casos: 8 },
        { Diagnostico: "Asma", Casos: 5 },
        { Diagnostico: "Dolor lumbar", Casos: 7 },
      ],
    },
    {
      id: "x5",
      tipo: "excel",
      titulo: "Signos vitales — promedios semanales",
      desc: "Temp, FC, SpO₂ promedio x semana.",
      file: "signos_vitales_promedios",
      rows: [
        { Semana: "2025-W31", Temp: 36.9, FC: 78, SpO2: 98 },
        { Semana: "2025-W32", Temp: 37.0, FC: 80, SpO2: 97 },
        { Semana: "2025-W33", Temp: 36.8, FC: 76, SpO2: 99 },
        { Semana: "2025-W34", Temp: 36.7, FC: 75, SpO2: 98 },
      ],
    },
  ];

  const pdfReports = [
    {
      id: "p1",
      tipo: "pdf",
      titulo: "Pacientes — Ficha Resumida",
      desc: "Datos principales de pacientes activos para contacto rápido.",
      file: "pacientes_ficha_resumida",
      columns: [
        { header: "Código", dataKey: "Codigo" },
        { header: "Paciente", dataKey: "Nombre" },
        { header: "Teléfono", dataKey: "Telefono" },
        { header: "Correo", dataKey: "Correo" },
        { header: "Estado", dataKey: "Estado" },
      ],
      rows: [
        { Codigo: "PAC-001", Nombre: "María López", Telefono: "5555-4444", Correo: "maria@example.com", Estado: "Activo" },
        { Codigo: "PAC-002", Nombre: "Juan Pérez", Telefono: "5555-3333", Correo: "juan@example.com", Estado: "Activo" },
        { Codigo: "PAC-003", Nombre: "Carlos Martínez", Telefono: "5555-2222", Correo: "carlos@example.com", Estado: "Inactivo" },
        { Codigo: "PAC-004", Nombre: "Ana García", Telefono: "5555-1111", Correo: "ana@example.com", Estado: "Activo" },
      ],
    },
    {
      id: "p2",
      tipo: "pdf",
      titulo: "Citas Pendientes - Detalle",
      desc: "Agenda de citas pendientes con motivo y médico asignado.",
      file: "citas_pendientes_detalle",
      columns: [
        { header: "Fecha", dataKey: "Fecha" },
        { header: "Hora", dataKey: "Hora" },
        { header: "Paciente", dataKey: "Paciente" },
        { header: "Médico", dataKey: "Medico" },
        { header: "Motivo", dataKey: "Motivo" },
        { header: "Estado", dataKey: "Estado" },
      ],
      rows: [
        { Fecha: "01/09/2025", Hora: "09:00", Paciente: "María López", Medico: "Dra. Molina", Motivo: "Control", Estado: "Pendiente" },
        { Fecha: "03/09/2025", Hora: "10:30", Paciente: "Juan Pérez", Medico: "Dr. Herrera", Motivo: "Resfriado", Estado: "Pendiente" },
        { Fecha: "07/09/2025", Hora: "11:15", Paciente: "Ana García", Medico: "Dra. López", Motivo: "Dolor lumbar", Estado: "Confirmada" },
        { Fecha: "10/09/2025", Hora: "08:45", Paciente: "Carlos Martínez", Medico: "Dr. Sandoval", Motivo: "Chequeo", Estado: "Pendiente" },
      ],
    },
    {
      id: "p3",
      tipo: "pdf",
      titulo: "Citas Realizadas",
      desc: "Histórico con resultados y recomendaciones breves.",
      file: "citas_realizadas_trazabilidad",
      columns: [
        { header: "Fecha", dataKey: "Fecha" },
        { header: "Paciente", dataKey: "Paciente" },
        { header: "Dx", dataKey: "Dx" },
        { header: "Recomendación", dataKey: "Recom" },
      ],
      rows: [
        { Fecha: "12/08/2025", Paciente: "Juan Pérez", Dx: "Rinitis alérgica", Recom: "Antihistamínico nocturno" },
        { Fecha: "15/08/2025", Paciente: "María López", Dx: "Faringitis aguda", Recom: "Hidratación + reposo" },
        { Fecha: "21/08/2025", Paciente: "Carlos Martínez", Dx: "Asma leve", Recom: "Inhalador de rescate PRN" },
        { Fecha: "25/08/2025", Paciente: "Ana García", Dx: "Dolor lumbar", Recom: "Fisioterapia 2/sem" },
      ],
    },
    {
      id: "p4",
      tipo: "pdf",
      titulo: "Notas Médicas",
      desc: "Diagnóstico principal y evolución resumida.",
      file: "notas_medicas_resumen_ejecutivo",
      columns: [
        { header: "Fecha", dataKey: "Fecha" },
        { header: "Paciente", dataKey: "Paciente" },
        { header: "Diagnóstico", dataKey: "Dx" },
        { header: "Evolución", dataKey: "Evo" },
      ],
      rows: [
        { Fecha: "01/08/2025", Paciente: "María López", Dx: "Faringoamigdalitis", Evo: "Mejora con ATB" },
        { Fecha: "05/08/2025", Paciente: "Juan Pérez", Dx: "Rinitis alérgica", Evo: "Controlado con spray" },
        { Fecha: "12/08/2025", Paciente: "Carlos Martínez", Dx: "Asma leve", Evo: "Sin crisis" },
      ],
    },
    {
      id: "p5",
      tipo: "pdf",
      titulo: "Laboratorios Solicitados",
      desc: "Últimos exámenes y estado de resultados.",
      file: "laboratorios_solicitados_control",
      columns: [
        { header: "Fecha", dataKey: "Fecha" },
        { header: "Paciente", dataKey: "Paciente" },
        { header: "Examen", dataKey: "Examen" },
        { header: "Estado", dataKey: "Estado" },
        { header: "Observación", dataKey: "Obs" },
      ],
      rows: [
        { Fecha: "20/08/2025", Paciente: "María López", Examen: "Hemograma", Estado: "Entregado", Obs: "Leve anemia" },
        { Fecha: "22/08/2025", Paciente: "Juan Pérez", Examen: "Perfil lipídico", Estado: "Pendiente", Obs: "-" },
        { Fecha: "25/08/2025", Paciente: "Ana García", Examen: "Glucosa", Estado: "Entregado", Obs: "Control adecuado" },
      ],
    },
  ];

  const reportes = [...excelReports, ...pdfReports];

  /* ========= Exportar Excel ========= */
  const descargarExcel = (rep) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rep.rows);
    const headers = Object.keys(rep.rows[0] || {});
    ws["!cols"] = headers.map((h) => ({ wch: Math.max(h.length + 2, 16) }));
    XLSX.utils.book_append_sheet(wb, ws, rep.titulo.slice(0, 31));
    XLSX.writeFile(wb, `${rep.file}_${fechaISO()}.xlsx`);
  };

  /* ========= Exportar PDF con logo cuadrado a la derecha + tabla ========= */
  const descargarPDF = async (rep) => {
    await ensureLogoLoaded();

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();

    const marginX = 48;

    // Logo cuadrado a la derecha
    const logoSize = 56;
    const logoX = pageW - marginX - logoSize;
    const logoY = 36;

    if (logoDataUrlRef.current) {
      doc.addImage(logoDataUrlRef.current, LOGO_FORMAT, logoX, logoY, logoSize, logoSize);
    }

    // Título a la izquierda
    let y = 64;
    doc.setFontSize(16);
    doc.setTextColor(...TEXT_DARK);
    doc.text(rep.titulo, marginX, y);

    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(rep.desc, marginX, (y += 16));
    doc.text(`Generado: ${hoyLegible()}`, marginX, (y += 14));

    // Separador
    y += 8;
    doc.setDrawColor(...PRIMARY);
    doc.setLineWidth(1);
    doc.line(marginX, y, pageW - marginX, y);
    y += 16;

    // Tabla
    autoTable(doc, {
      startY: y,
      head: [rep.columns.map((c) => c.header)],
      body: rep.rows.map((r) => rep.columns.map((c) => String(r[c.dataKey] ?? ""))),
      styles: {
        fontSize: 9,
        cellPadding: 6,
        textColor: 40,
        lineColor: [230, 230, 230],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: PRIMARY,
        textColor: 255,
        halign: "left",
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [248, 252, 250] },
      theme: "grid",
      didDrawPage: (data) => {
        const str = `Página ${doc.internal.getNumberOfPages()}`;
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(str, pageW - marginX, doc.internal.pageSize.getHeight() - 24, { align: "right" });
      },
      margin: { left: marginX, right: marginX },
    });

    doc.save(`${rep.file}_${fechaISO()}.pdf`);
  };

  const handleDescargar = async (rep) => {
    if (rep.tipo === "excel") return descargarExcel(rep);
    return descargarPDF(rep);
  };

  /* ========= UI ========= */
  return (
    <div className="container-fluid">
      <h1 className="h4 mb-2">Reportes</h1>
      <p className="text-muted mb-4">Descarga reportes predefinidos en formato Excel o PDF.</p>

      <div className="row g-3">
        {reportes.map((rep) => (
          <div className="col-12 col-md-6 col-xl-4" key={rep.id}>
            <div className="card border border-secondary-subtle bg-white shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <small className="text-uppercase text-muted">Reporte {rep.tipo.toUpperCase()}</small>
                <h6 className="mt-1 mb-1">{rep.titulo}</h6>
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
