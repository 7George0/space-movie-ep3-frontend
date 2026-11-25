
import { movies } from "../data/movies";
import { peliculas } from "../data/peliculas";
import { obtenerPeliculaPorId as obtenerPeliculaLocal } from "../utils/obtenerPelicula";

const API_URL = "http://localhost:8080/api/v1/productos";

// Convierte los minutos a un formato legible.
function convertirDuracion(minutos) {
  if (minutos == null) return "Duración no disponible";

  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;

  return horas > 0
    ? `${horas} h ${resto} min`
    : `${resto} min`;
}

// Adapta los datos del backend al formato del frontend.
function adaptarProducto(producto) {
  const fichaLocal = peliculas.find(
  (p) =>
    p.titulo.trim().toLowerCase() ===
    (producto.titulo || "").trim().toLowerCase()
    );

  return {
    id: `neon-${producto.id}`,
    poster: producto.poster || fichaLocal?.poster || "/images/poster-default.webp",
    title: producto.titulo,
    score: producto.aprobacionPublico ?? 0,
    year: producto.anio ?? "",
    duration: convertirDuracion(producto.duracionMinutos),
    description: producto.sinopsis || "",
    titulo: producto.titulo,
    fechaEstreno: producto.fechaEstreno || String(producto.anio ?? ""),
    duracion: convertirDuracion(producto.duracionMinutos),
    genero: producto.genero || "Por definir",
    resumen: producto.sinopsis || "",
    aprobacionPublico: producto.aprobacionPublico ?? 0,
    aprobacionCritica: producto.aprobacionCritica ?? fichaLocal?.aprobacionCritica ?? 0,
    resenas: fichaLocal?.resenas ?? [],
  };
}

// Convierte una película local al formato del frontend.
function adaptarPeliculaLocal(movie) {
  const ficha = peliculas.find(
    (p) => String(p.id) === String(movie.id)
  );

  return {
    ...movie,
    titulo: ficha?.titulo ?? movie.title,
    fechaEstreno: ficha?.fechaEstreno ?? String(movie.year),
    duracion: ficha?.duracion ?? movie.duration,
    genero: ficha?.genero ?? "Por definir",
    resumen: ficha?.resumen ?? movie.description,
    aprobacionPublico: ficha?.aprobacionPublico ?? movie.score,
    aprobacionCritica: ficha?.aprobacionCritica ?? movie.score,
    resenas: ficha?.resenas ?? [],
  };
}

// Obtiene películas locales y las combina con las de Neon.
export async function obtenerPeliculas() {
  const catalogo = new Map();

  // Cargar primero todas las películas locales.
  movies.forEach((movie) => {
    const pelicula = adaptarPeliculaLocal(movie);
    const clave = (pelicula.titulo || pelicula.title || "")
      .trim()
      .toLowerCase();

    if (clave) {
      catalogo.set(clave, pelicula);
    }
  });

  try {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error("No se pudieron obtener las películas");
    }

    const productos = await respuesta.json();

    if (Array.isArray(productos)) {
      productos.forEach((producto) => {
        const pelicula = adaptarProducto(producto);
        const clave = (pelicula.titulo || "")
          .trim()
          .toLowerCase();

        if (clave) {
          catalogo.set(clave, pelicula);
        }
      });
    }
  } catch (error) {
    console.error("Error al conectar con el catálogo:", error);
  }

  return Array.from(catalogo.values());
}

// Obtiene la ficha de una película desde el backend.
// Si no está disponible, conserva la ficha local.
export async function obtenerDetallePelicula(id) {
  // Las películas locales conservan sus identificadores originales.
  if (!String(id).startsWith("neon-")) {
    return obtenerPeliculaLocal(id);
  }

  // Quitamos el prefijo para consultar el ID real de Neon.
  const idBackend = String(id).replace("neon-", "");

  try {
    const respuesta = await fetch(`${API_URL}/${idBackend}`);

    if (!respuesta.ok) {
      throw new Error("Película no encontrada en el backend");
    }

    const producto = await respuesta.json();

    const tituloNormalizado = (producto.titulo || "")
      .trim()
      .toLowerCase();

    const fichaLocal = peliculas.find(
      (p) => p.titulo.trim().toLowerCase() === tituloNormalizado
    );

    return {
      id: `neon-${producto.id}`,
      titulo: producto.titulo,
      poster: producto.poster || fichaLocal?.poster || "",
      fechaEstreno: producto.fechaEstreno || String(producto.anio ?? ""),
      duracion: convertirDuracion(producto.duracionMinutos),
      genero: producto.genero || fichaLocal?.genero || "Por definir",
      resumen: producto.sinopsis || "",
      aprobacionPublico: producto.aprobacionPublico ?? 0,
      aprobacionCritica: producto.aprobacionCritica ?? fichaLocal?.aprobacionCritica ?? 0,
      resenas: fichaLocal?.resenas ?? [],
    };
  } catch (error) {
    console.error("Error al obtener la película de Neon:", error);
    return null;
  }
}