// client/src/pages/pacientes/CrearPaciente.jsx
import React from "react";

export default function CrearPaciente() {
  const [foto, setFoto] = React.useState(null);
  const [alergiaInput, setAlergiaInput] = React.useState("");
  const [alergias, setAlergias] = React.useState(["Penicilina", "Polen"]);

  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFoto(reader.result);
    reader.readAsDataURL(file);
  };

  const addAlergia = (e) => {
    e.preventDefault();
    const v = alergiaInput.trim();
    if (!v) return;
    setAlergias((prev) => Array.from(new Set([...prev, v])));
    setAlergiaInput("");
  };
  const removeAlergia = (val) =>
    setAlergias((prev) => prev.filter((a) => a !== val));

  const onSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.alergias = alergias;
    alert("Guardado (demo):\n" + JSON.stringify(payload, null, 2));
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white d-flex align-items-center justify-content-between">
        <h1 className="h6 mb-0">Crear paciente</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => window.print()}>
            <i className="fa-solid fa-print me-1" /> Imprimir
          </button>
          <button className="btn btn-success btn-sm" type="submit" form="frmPaciente">
            <i className="fa-regular fa-floppy-disk me-1" /> Guardar (demo)
          </button>
        </div>
      </div>

      <div className="card-body">
        <form id="frmPaciente" onSubmit={onSubmit} className="row g-4">
          {/* Foto + resumen */}
          <div className="col-12 d-flex align-items-start gap-3">
            <div className="text-center">
              <img
                src={foto || "https://cdn-icons-png.flaticon.com/512/6812/6812879.png"}
                alt="Foto"
                className="rounded-3 border mb-2"
                style={{ width: 128, height: 128, objectFit: "cover" }}
              />
              <div>
                <label className="btn btn-outline-secondary btn-sm mb-0">
                  <input type="file" accept="image/*" hidden onChange={handleFoto} />
                  Cambiar foto
                </label>
              </div>
            </div>

            <div className="flex-grow-1">
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Nombres</label>
                  <input className="form-control" name="nombres" required defaultValue="María Fernanda" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Apellidos</label>
                  <input className="form-control" name="apellidos" required defaultValue="López García" />
                </div>
                <div className="col-6 col-lg-3">
                  <label className="form-label">Sexo</label>
                  <select className="form-select" name="sexo" defaultValue="F">
                    <option value="F">Femenino</option>
                    <option value="M">Masculino</option>
                    <option value="O">Otro</option>
                  </select>
                </div>
                <div className="col-6 col-lg-3">
                  <label className="form-label">Fecha de nacimiento</label>
                  <input type="date" className="form-control" name="fechaNacimiento" defaultValue="1992-04-15" />
                </div>
                <div className="col-6 col-lg-3">
                  <label className="form-label">Estado civil</label>
                  <select className="form-select" name="estadoCivil" defaultValue="Soltera">
                    <option>Soltera</option><option>Casada</option><option>Unión libre</option>
                  </select>
                </div>
                <div className="col-6 col-lg-3">
                  <label className="form-label">Tipo de sangre</label>
                  <select className="form-select" name="tipoSangre" defaultValue="O+">
                    <option>O+</option><option>O-</option><option>A+</option><option>A-</option>
                    <option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-2" />

          {/* Datos de contacto */}
          <div className="col-12">
            <h6 className="mb-2">Datos de contacto</h6>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Teléfono</label>
                <input className="form-control" name="telefono" defaultValue="5555-4444" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Correo</label>
                <input type="email" className="form-control" name="correo" defaultValue="maria@example.com" />
              </div>
              <div className="col-12">
                <label className="form-label">Dirección</label>
                <input className="form-control" name="direccion" defaultValue="6a Av 12-34 Zona 1, Guatemala" />
              </div>
            </div>
          </div>

          {/* Seguro */}
          <div className="col-12">
            <h6 className="mb-2">Seguro</h6>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Aseguradora</label>
                <input className="form-control" name="aseguradora" defaultValue="Seguros AS2" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Póliza</label>
                <input className="form-control" name="poliza" defaultValue="POL-88992" />
              </div>
            </div>
          </div>

          {/* Responsable y emergencia */}
          <div className="col-12">
            <h6 className="mb-2">Responsables y contacto de emergencia</h6>
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
                      <input className="form-control" name="respNombre" defaultValue="Juan López" />
                    </div>
                    <div className="col-6 col-lg-3">
                      <label className="form-label">Parentesco</label>
                      <input className="form-control" name="respParentesco" defaultValue="Hermano" />
                    </div>
                    <div className="col-6 col-lg-3">
                      <label className="form-label">Teléfono</label>
                      <input className="form-control" name="respTelefono" defaultValue="5555-2222" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Dirección</label>
                      <input className="form-control" name="respDireccion" defaultValue="7a Av A 14-36, Guatemala" />
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
                      <input className="form-control" name="emergNombre" defaultValue="Ana Soto" />
                    </div>
                    <div className="col-6 col-lg-3">
                      <label className="form-label">Parentesco</label>
                      <input className="form-control" name="emergParentesco" defaultValue="Amiga" />
                    </div>
                    <div className="col-6 col-lg-3">
                      <label className="form-label">Teléfono</label>
                      <input className="form-control" name="emergTelefono" defaultValue="5555-1111" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Observaciones</label>
                      <input className="form-control" name="emergObs" defaultValue="Disponible en horario laboral" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alergias */}
          <div className="col-12">
            <h6 className="mb-2">Alergias</h6>
            <form className="d-flex gap-2" onSubmit={addAlergia}>
              <input
                className="form-control"
                placeholder="Agregar alergia…"
                value={alergiaInput}
                onChange={(e) => setAlergiaInput(e.target.value)}
              />
              <button className="btn btn-outline-primary" type="submit">Añadir</button>
            </form>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {alergias.map((a) => (
                <span key={a} className="badge text-bg-light border">
                  {a}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-2"
                    aria-label="Eliminar"
                    onClick={() => removeAlergia(a)}
                    style={{ filter: "invert(1) opacity(0.5)", transform: "scale(.8)" }}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Notas */}
          <div className="col-12">
            <h6 className="mb-2">Notas</h6>
            <textarea className="form-control" rows={3} name="notas" defaultValue="Paciente en control trimestral." />
          </div>
        </form>
      </div>
    </div>
  );
}
