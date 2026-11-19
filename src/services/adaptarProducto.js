
export function adaptarProducto(producto) {
  const titulo = producto.titulo || 'Sin título'

  const sinopsis = producto.sinopsis || 'Sin descripción disponible'

  const duracion = producto.duracionMinutos != null
    ? `${producto.duracionMinutos} min`
    : 'Sin duración'

  return {
    id: producto.id,
    poster: producto.poster || '',

    title: titulo,
    score: producto.aprobacionPublico ?? '—',
    year: producto.anio ?? '—',
    duration: duracion,
    description: sinopsis,

    titulo: titulo,
    resumen: sinopsis,
    duracion: duracion,
    fechaEstreno: producto.fechaEstreno || 'Sin fecha',
    genero: producto.genero || 'Sin género',
    aprobacionPublico: producto.aprobacionPublico ?? '—',
    aprobacionCritica: producto.aprobacionCritica ?? '—',

    resenas: []
  }
}
