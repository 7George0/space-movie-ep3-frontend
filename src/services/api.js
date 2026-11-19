
const API_URL = import.meta.env.VITE_API_URL

export async function api(ruta, opciones = {}) {
  if (!API_URL) {
    throw new Error('Falta configurar la URL del backend')
  }

  const respuesta = await fetch(
    `${API_URL.replace(/\/$/, '')}/${ruta.replace(/^\//, '')}`,
    {
      ...opciones,
      headers: {
        ...(opciones.body ? { 'Content-Type': 'application/json' } : {}),
        ...opciones.headers
      }
    }
  )

  const datos = await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    throw new Error(
      datos?.mensaje ||
      datos?.message ||
      `Error HTTP ${respuesta.status}`
    )
  }

  return datos
}
