// src/pages/citas/ConsultarCitas.jsx
import React from "react";

export default function ConsultarCitas() {
  const [doctorSel, setDoctorSel] = React.useState("aperez");
  const [busqueda, setBusqueda] = React.useState("");

  const citas = React.useMemo(
    () => [
      {
        id: "c1",
        fecha: "2025-08-12",
        hora: "09:00",
        motivo: "Consulta general",
        consultorio: "A-101",
        doctorId: "aperez",
        doctorNombre: "Dra. Andrea Pérez",
        paciente: { id: "123", nombre: "Juan Pérez", edad: 41, codigo: "PAC-000341" },
      },
      {
        id: "c2",
        fecha: "2025-08-12",
        hora: "10:30",
        motivo: "Control post-operatorio",
        consultorio: "A-101",
        doctorId: "aperez",
        doctorNombre: "Dra. Andrea Pérez",
        paciente: { id: "124", nombre: "María López", edad: 33, codigo: "PAC-000123" },
      },
      {
        id: "c4",
        fecha: "2025-08-13",
        hora: "08:10",
        motivo: "Control de asma",
        consultorio: "B-201",
        doctorId: "aperez",
        doctorNombre: "Dra. Andrea Pérez",
        paciente: { id: "126", nombre: "Ana Soto", edad: 29, codigo: "PAC-000228" },
      },
    ],
    []
  );

  const toDateTime = (f, h) => new Date(`${f}T${h}:00`);
  const fDate = (iso) => {
    const d = new Date(iso);
    const p = (n) => String(n).padStart(2, "0");
    return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
  };

  const citasFiltradas = React.useMemo(() => {
    return citas
      .filter((c) => c.doctorId === doctorSel)
      .filter((c) => c.paciente.nombre.toLowerCase().includes(busqueda.toLowerCase()))
      .sort((a, b) => toDateTime(a.fecha, a.hora) - toDateTime(b.fecha, b.hora));
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
            onChange={(e) => setDoctorSel(e.target.value)}
          >
            <option value="aperez">Dra. Andrea Pérez</option>
            <option value="lhernandez">Dr. Luis Hernández</option>
          </select>
          <input
            className="form-control form-control-sm"
            placeholder="Buscar paciente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
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
          {citasFiltradas.map((c) => (
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
                      <small className="text-muted">
                        {c.paciente.codigo} · {c.paciente.edad} años
                      </small>
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
                    <div className="border rounded p-2 small bg-light">{c.motivo}</div>
                  </div>

                  {/* Botón */}
                  <div className="mt-auto d-flex justify-content-end">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => atenderCita(c)}>
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
}
