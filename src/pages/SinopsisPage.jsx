
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { ApprovalSection } from '../components/organisms/ApprovalSection'
import { Footer } from '../components/organisms/Footer'
import { Header } from '../components/organisms/Header'

import { MovieDetails } from '../components/organisms/MovieDetails'
import { ReviewForm } from '../components/organisms/ReviewForm'
import { ReviewList } from '../components/organisms/ReviewList'

import { sitio } from '../data/sitio'
import { obtenerPeliculaPorId as obtenerPeliculaLocal } from '../utils/obtenerPelicula'

import { obtenerPeliculaPorId as obtenerPeliculaBackend } from '../services/peliculasService'
import { adaptarProducto } from '../services/adaptarProducto'

function SinopsisContenido({ pelicula }) {
  const [resenas, setResenas] = useState(pelicula.resenas || [])

  useEffect(() => {
    document.title = `${pelicula.titulo} - Sinopsis | ${sitio.nombre}`
  }, [pelicula])

  const publicarResena = (resena) => {
    setResenas((anteriores) => [...anteriores, resena])
  }

  return (
    <main>
      <MovieDetails pelicula={pelicula} />

      <ApprovalSection
        publico={pelicula.aprobacionPublico}
        critica={pelicula.aprobacionCritica}
      />

      <ReviewList resenas={resenas} />

      <ReviewForm onPublicar={publicarResena} />
    </main>
  )
}

function SinopsisPage() {
  const { id } = useParams()

  const peliculaLocal = obtenerPeliculaLocal(id)

  const [peliculaBackend, setPeliculaBackend] = useState(null)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    if (!import.meta.env.VITE_API_URL) return

    let activo = true

    async function cargarPelicula() {
      try {
        const datos = await obtenerPeliculaBackend(id)
        const peliculaAdaptada = adaptarProducto(datos)

        if (activo) {
          setPeliculaBackend(peliculaAdaptada)
          setMensaje('')
        }
      } catch (error) {
        console.error('Error al consultar la película:', error)

        if (activo) {
          setPeliculaBackend(null)
          setMensaje('No se pudo consultar el backend.')
        }
      }
    }

    cargarPelicula()

    return () => {
      activo = false
    }
  }, [id])

  const peliculaRemotaValida =
    peliculaBackend && String(peliculaBackend.id) === String(id)

  const pelicula = peliculaRemotaValida
    ? peliculaBackend
    : peliculaLocal

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header nombre={sitio.nombre} />

      {mensaje && (
        <p role="status" className="text-center p-3">
          {mensaje}
        </p>
      )}

      {pelicula ? (
        <SinopsisContenido
          key={`${id}-${peliculaRemotaValida ? 'api' : 'local'}`}
          pelicula={pelicula}
        />
      ) : (
        <main className="container py-5 text-center">
          <h1>Película no encontrada</h1>
          <Link to="/" className="btn btn-cine mt-3">
            Volver al inicio
          </Link>
        </main>
      )}

      <Footer sitio={sitio} enlaces={[]} />
    </div>
  )
}

export { SinopsisPage }
