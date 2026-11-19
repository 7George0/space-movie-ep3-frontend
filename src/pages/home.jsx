
import { useEffect, useState } from 'react'
import { movies } from '../data/movies'
import { sitio } from '../data/sitio'
import { Header } from '../components/organisms/Header'
import { Footer } from '../components/organisms/Footer'
import MovieCards from '../components/organisms/MovieCards'

import { obtenerPeliculas } from '../services/peliculasService'
import { adaptarProducto } from '../services/adaptarProducto'

function Home() {

  const [peliculas, setPeliculas] = useState(movies)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    document.title = `Inicio | ${sitio.nombre}`
  }, [])

  useEffect(() => {

    if (!import.meta.env.VITE_API_URL) return

    let activo = true

    async function cargarPeliculas() {
      try {
        const datos = await obtenerPeliculas()

        if (!Array.isArray(datos)) {
          throw new Error('La API no devolvió una lista de películas')
        }

        const peliculasAdaptadas = datos.map(adaptarProducto)

        if (activo) {
          setPeliculas(peliculasAdaptadas)
          setMensaje('')
        }

      } catch (error) {
        console.error('Error al cargar películas:', error)

        if (activo) {
          setMensaje('No se pudo conectar con el catálogo. Mostrando películas de ejemplo.')
        }
      }
    }

    cargarPeliculas()

    return () => {
      activo = false
    }

  }, [])

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header nombre={sitio.nombre} />

      <main className="movies-page">
        {mensaje && (
          <p role="status" className="text-center p-3">
            {mensaje}
          </p>
        )}

        <MovieCards movies={peliculas} />
      </main>

      <Footer sitio={sitio} enlaces={[]} />
    </div>
  )
}

export default Home
