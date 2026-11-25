
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApprovalSection } from '../components/organisms/ApprovalSection'
import { Footer } from '../components/organisms/Footer'
import { Header } from '../components/organisms/Header'
import { MovieDetails } from '../components/organisms/MovieDetails'
import { ReviewForm } from '../components/organisms/ReviewForm'
import { ReviewList } from '../components/organisms/ReviewList'
import { sitio } from '../data/sitio'
import { obtenerDetallePelicula } from '../services/peliculasService'

function SinopsisContenido({ pelicula }) {
  const [resenas, setResenas] = useState(pelicula.resenas || [])

  useEffect(() => {
    document.title = `${pelicula.titulo} — Sinopsis | ${sitio.nombre}`
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

export function SinopsisPage() {
  const { id } = useParams()
  const [pelicula, setPelicula] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true

    async function cargarPelicula() {
      setCargando(true)
      const resultado = await obtenerDetallePelicula(id)

      if (activo) {
        setPelicula(resultado)
        setCargando(false)
      }
    }

    cargarPelicula()

    return () => {
      activo = false
    }
  }, [id])

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header nombre={sitio.nombre} />

      {cargando ? (
        <main className="container py-5 text-center">
          <p>Cargando película...</p>
        </main>
      ) : pelicula ? (
        <SinopsisContenido key={pelicula.id} pelicula={pelicula} />
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