
import { useEffect, useState } from 'react'
import { sitio } from '../data/sitio'
import { Header } from '../components/organisms/Header'
import { Footer } from '../components/organisms/Footer'
import MovieCards from '../components/organisms/MovieCards'
import { obtenerPeliculas } from '../services/peliculasService'

function Home() {
  const [movies, setMovies] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    document.title = `Inicio | ${sitio.nombre}`

    async function cargarPeliculas() {
      try {
        const peliculas = await obtenerPeliculas()
        setMovies(peliculas)
      } finally {
        setCargando(false)
      }
    }

    cargarPeliculas()
  }, [])

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header nombre={sitio.nombre} />

      <main className="movies-page">
        {cargando ? (
          <p className="text-center py-5">Cargando películas...</p>
        ) : (
          <MovieCards movies={movies} />
        )}
      </main>

      <Footer sitio={sitio} enlaces={[]} />
    </div>
  )
}

export default Home
