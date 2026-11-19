import { api } from './api'

// Obtener todas las películas del backend
export async function obtenerPeliculas() {
  return await api('/api/v1/productos')
}

// Obtener una película por su ID
export async function obtenerPeliculaPorId(id) {
  return await api(`/api/v1/productos/${id}`)
}