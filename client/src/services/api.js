// client/src/services/api.js
export async function getPaciente(id) {
  const res = await fetch(`/api/pacientes/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}