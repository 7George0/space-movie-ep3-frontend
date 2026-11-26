import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  listarPeliculasAdmin,
  listarCategorias,
  listarEquiposDireccion,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula,
  listarUsuariosAdmin,
  listarTiposUsuario,
  actualizarUsuarioAdmin,
  eliminarUsuarioAdmin,
  listarResenasAdmin,
  eliminarResenaAdmin,
} from "../services/adminService";

const formularioInicial = {
  poster: "",
  titulo: "",
  sinopsis: "",
  anio: "",
  duracionMinutos: "",
  fechaEstreno: "",
  genero: "",
  aprobacionPublico: "",
  aprobacionCritica: "",
  equipoDireccionId: "",
  categoriaId: "",
};

const estilos = {
  pagina: {
    minHeight: "100vh",
    background: "#101018",
    color: "#ffffff",
    padding: "35px",
    fontFamily: "Arial, sans-serif",
  },
  panel: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  tarjeta: {
    background: "#1b1b27",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "25px",
  },
  input: {
    width: "100%",
    padding: "11px",
    borderRadius: "6px",
    border: "1px solid #444",
    background: "#292938",
    color: "white",
    boxSizing: "border-box",
  },
  boton: {
    padding: "11px 17px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

function AdminPage() {
  const { token, usuario } = useAuth();

  const [peliculas, setPeliculas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [equipos, setEquipos] = useState([]);

  // Gestión de usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  // Moderación de reseñas
  const [resenas, setResenas] = useState([]);
  const [cargandoResenas, setCargandoResenas] = useState(false);
  const [errorResenas, setErrorResenas] = useState("");
  const [mensajeResenas, setMensajeResenas] = useState("");

  const [formularioUsuario, setFormularioUsuario] = useState({
    nombre: "",
    correo: "",
    tipoUsuarioId: "",
  });

  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);
  const [errorUsuarios, setErrorUsuarios] = useState("");
  const [mensajeUsuarios, setMensajeUsuarios] = useState("");

  const [formulario, setFormulario] = useState(formularioInicial);
  const [peliculaEditando, setPeliculaEditando] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError("");

    try {
      const [listaPeliculas, listaCategorias, listaEquipos] =
        await Promise.all([
          listarPeliculasAdmin(),
          listarCategorias(),
          listarEquiposDireccion(),
        ]);

      setPeliculas(listaPeliculas || []);
      setCategorias(listaCategorias || []);
      setEquipos(listaEquipos || []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los datos.");
    } finally {
      setCargando(false);
    }
  }, []);

  const cargarUsuarios = useCallback(async () => {
    try {
      setCargandoUsuarios(true);
      setErrorUsuarios("");

      const [listaUsuarios, listaTipos] = await Promise.all([
        listarUsuariosAdmin(token),
        listarTiposUsuario(token),
      ]);

      setUsuarios(listaUsuarios || []);
      setTiposUsuario(listaTipos || []);
    } catch (error) {
      setErrorUsuarios(
        error.message || "No se pudieron cargar los usuarios."
      );
    } finally {
      setCargandoUsuarios(false);
    }
  }, [token]);

  const cargarResenas = useCallback(async () => {
    try {
      setCargandoResenas(true);
      setErrorResenas("");

      const listaResenas = await listarResenasAdmin();
      setResenas(listaResenas || []);
    } catch (error) {
      setErrorResenas(
        error.message || "No se pudieron cargar las reseñas."
      );
    } finally {
      setCargandoResenas(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(cargarDatos);
  }, [cargarDatos]);

  useEffect(() => {
    if (token) {
      void Promise.resolve().then(cargarUsuarios);
    }
  }, [token, cargarUsuarios]);

  useEffect(() => {
    void Promise.resolve().then(cargarResenas);
  }, [cargarResenas]);

  function cambiarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));
  }

  function limpiarFormulario() {
    setFormulario(formularioInicial);
    setPeliculaEditando(null);
    setError("");
    setMensaje("");
  }

  function prepararEdicion(pelicula) {
    setPeliculaEditando(pelicula.id);

    setFormulario({
      poster: pelicula.poster || "",
      titulo: pelicula.titulo || "",
      sinopsis: pelicula.sinopsis || "",
      anio: pelicula.anio ?? "",
      duracionMinutos: pelicula.duracionMinutos ?? "",
      fechaEstreno: pelicula.fechaEstreno || "",
      genero: pelicula.genero || "",
      aprobacionPublico: pelicula.aprobacionPublico ?? "",
      aprobacionCritica: pelicula.aprobacionCritica ?? "",
      equipoDireccionId: pelicula.equipoDireccionId ?? "",
      categoriaId: pelicula.categoriaId ?? "",
    });

    setMensaje("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function convertirDatos() {
    return {
      poster: formulario.poster.trim(),
      titulo: formulario.titulo.trim(),
      sinopsis: formulario.sinopsis.trim(),
      anio: Number(formulario.anio),
      duracionMinutos: formulario.duracionMinutos
        ? Number(formulario.duracionMinutos)
        : null,
      fechaEstreno: formulario.fechaEstreno,
      genero: formulario.genero.trim() || null,
      aprobacionPublico: formulario.aprobacionPublico === ""
        ? null
        : Number(formulario.aprobacionPublico),
      aprobacionCritica: formulario.aprobacionCritica === ""
        ? null
        : Number(formulario.aprobacionCritica),
      equipoDireccionId: Number(formulario.equipoDireccionId),
      categoriaId: Number(formulario.categoriaId),
    };
  }

  async function guardarPelicula(evento) {
    evento.preventDefault();

    setError("");
    setMensaje("");

    if (!token) {
      setError("No se encontró la sesión. Inicia sesión nuevamente.");
      return;
    }

    setGuardando(true);

    try {
      const datos = convertirDatos();

      if (peliculaEditando !== null) {
        await actualizarPelicula(peliculaEditando, datos, token);
        setMensaje("Película actualizada correctamente.");
      } else {
        await crearPelicula(datos, token);
        setMensaje("Película creada correctamente.");
      }

      limpiarFormulario();
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo guardar la película.");
    } finally {
      setGuardando(false);
    }
  }

  async function borrarPelicula(pelicula) {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar "${pelicula.titulo}"? Esta acción no se puede deshacer.`
    );

    if (!confirmar) return;

    setError("");
    setMensaje("");

    try {
      await eliminarPelicula(pelicula.id, token);

      setMensaje("Película eliminada correctamente.");

      if (peliculaEditando === pelicula.id) {
        limpiarFormulario();
      }

      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la película.");
    }
  }

  // Preparar edición de un usuario
  function prepararEdicionUsuario(usuarioSeleccionado) {
    setUsuarioEditando(usuarioSeleccionado.id);

    setFormularioUsuario({
      nombre: usuarioSeleccionado.nombre || "",
      correo: usuarioSeleccionado.correo || "",
      tipoUsuarioId: String(usuarioSeleccionado.tipoUsuarioId || ""),
    });

    setErrorUsuarios("");
    setMensajeUsuarios("");
  }

  // Actualizar campos del formulario de usuario
  function cambiarCampoUsuario(evento) {
    const { name, value } = evento.target;

    setFormularioUsuario((actual) => ({
      ...actual,
      [name]: value,
    }));
  }

  // Cancelar edición
  function cancelarEdicionUsuario() {
    setUsuarioEditando(null);

    setFormularioUsuario({
      nombre: "",
      correo: "",
      tipoUsuarioId: "",
    });

    setErrorUsuarios("");
    setMensajeUsuarios("");
  }

  // Guardar cambios del usuario
  async function guardarUsuario(evento) {
    evento.preventDefault();

    setErrorUsuarios("");
    setMensajeUsuarios("");

    if (!token) {
      setErrorUsuarios("No se encontró la sesión de administrador.");
      return;
    }

    const tipoAdmin = tiposUsuario.find(
      (tipo) => tipo.nombre?.toUpperCase() === "ADMIN"
    );

    const esMiCuenta =
      usuarios.find((u) => u.id === usuarioEditando)?.correo === usuario?.correo;

    if (
      esMiCuenta &&
      Number(formularioUsuario.tipoUsuarioId) !== Number(tipoAdmin?.id)
    ) {
      setErrorUsuarios("No puedes quitarte tus propios permisos de administrador.");
      return;
    }

    try {
      const datos = {
        nombre: formularioUsuario.nombre.trim(),
        correo: formularioUsuario.correo.trim(),
        tipoUsuarioId: Number(formularioUsuario.tipoUsuarioId),
      };

      await actualizarUsuarioAdmin(usuarioEditando, datos, token);

      setMensajeUsuarios("Usuario actualizado correctamente.");
      cancelarEdicionUsuario();
      await cargarUsuarios();
    } catch (error) {
      setErrorUsuarios(error.message || "No se pudo actualizar el usuario.");
    }
  }

  // Eliminar un usuario
  async function borrarUsuario(usuarioSeleccionado) {
    if (usuarioSeleccionado.correo === usuario?.correo) {
      setErrorUsuarios("No puedes eliminar tu propia cuenta de administrador.");
      return;
    }

    const tipoAdmin = tiposUsuario.find(
      (tipo) => tipo.nombre?.toUpperCase() === "ADMIN"
    );

    const esAdmin =
      Number(usuarioSeleccionado.tipoUsuarioId) === Number(tipoAdmin?.id);

    const cantidadAdmins = usuarios.filter(
      (u) => Number(u.tipoUsuarioId) === Number(tipoAdmin?.id)
    ).length;

    if (esAdmin && cantidadAdmins <= 1) {
      setErrorUsuarios("No puedes eliminar al último administrador.");
      return;
    }

    const confirmar = window.confirm(
      `¿Eliminar la cuenta de ${usuarioSeleccionado.correo}? Esta acción no se puede deshacer.`
    );

    if (!confirmar) return;

    try {
      setErrorUsuarios("");
      setMensajeUsuarios("");

      await eliminarUsuarioAdmin(usuarioSeleccionado.id, token);

      setMensajeUsuarios("Usuario eliminado correctamente.");

      if (usuarioEditando === usuarioSeleccionado.id) {
        cancelarEdicionUsuario();
      }

      await cargarUsuarios();
    } catch (error) {
      setErrorUsuarios(error.message || "No se pudo eliminar el usuario.");
    }
  }

    // Eliminar una reseña
  async function borrarResena(resena) {
    const confirmar = window.confirm(
      `¿Eliminar la reseña de ${resena.usuarioNombre || "este usuario"} sobre "${resena.productoTitulo || "esta película"}"? Esta acción no se puede deshacer.`
    );

    if (!confirmar) return;

    try {
      setErrorResenas("");
      setMensajeResenas("");

      await eliminarResenaAdmin(resena.id, token);

      setMensajeResenas("Reseña eliminada correctamente.");

      await cargarResenas();
    } catch (error) {
      setErrorResenas(
        error.message || "No se pudo eliminar la reseña."
      );
    }
  }

  return (
    <main style={estilos.pagina}>
      <div style={estilos.panel}>
        <header style={{ marginBottom: "30px" }}>
          <h1>Panel de Administración</h1>
          <p>Bienvenido, {usuario?.correo || "Administrador"}.</p>
          <p style={{ color: "#aaa" }}>
            Gestión del catálogo audiovisual de Space Movie.
          </p>
        </header>

        {error && (
          <div style={{
            background: "#642c35",
            padding: "14px",
            borderRadius: "7px",
            marginBottom: "20px",
          }}>
            {error}
          </div>
        )}

        {mensaje && (
          <div style={{
            background: "#20583e",
            padding: "14px",
            borderRadius: "7px",
            marginBottom: "20px",
          }}>
            {mensaje}
          </div>
        )}

        <section style={estilos.tarjeta}>
          <h2>
            {peliculaEditando !== null
              ? "Editar película"
              : "Registrar película"}
          </h2>

          <form onSubmit={guardarPelicula}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "18px",
            }}>
              <label>
                Título *
                <input
                  style={estilos.input}
                  name="titulo"
                  value={formulario.titulo}
                  onChange={cambiarCampo}
                  maxLength={150}
                  required
                />
              </label>

              <label>
                Poster (URL) *
                <input
                  style={estilos.input}
                  name="poster"
                  value={formulario.poster}
                  onChange={cambiarCampo}
                  maxLength={500}
                  required
                />
              </label>

              <label>
                Año *
                <input
                  style={estilos.input}
                  type="number"
                  name="anio"
                  value={formulario.anio}
                  onChange={cambiarCampo}
                  min="1888"
                  max="2100"
                  required
                />
              </label>

              <label>
                Fecha de estreno *
                <input
                  style={estilos.input}
                  type="date"
                  name="fechaEstreno"
                  value={formulario.fechaEstreno}
                  onChange={cambiarCampo}
                  required
                />
              </label>

              <label>
                Duración (minutos)
                <input
                  style={estilos.input}
                  type="number"
                  name="duracionMinutos"
                  value={formulario.duracionMinutos}
                  onChange={cambiarCampo}
                  min="1"
                  max="1000"
                />
              </label>

              <label>
                Género
                <input
                  style={estilos.input}
                  name="genero"
                  value={formulario.genero}
                  onChange={cambiarCampo}
                  maxLength={100}
                />
              </label>

              <label>
                Aprobación del público (%)
                <input
                  style={estilos.input}
                  type="number"
                  name="aprobacionPublico"
                  value={formulario.aprobacionPublico}
                  onChange={cambiarCampo}
                  min="0"
                  max="100"
                />
              </label>

              <label>
                Aprobación de la crítica (%)
                <input
                  style={estilos.input}
                  type="number"
                  name="aprobacionCritica"
                  value={formulario.aprobacionCritica}
                  onChange={cambiarCampo}
                  min="0"
                  max="100"
                />
              </label>

              <label>
                Equipo de dirección *
                <select
                  style={estilos.input}
                  name="equipoDireccionId"
                  value={formulario.equipoDireccionId}
                  onChange={cambiarCampo}
                  required
                >
                  <option value="">Seleccionar director</option>
                  {equipos.map((equipo) => (
                    <option key={equipo.id} value={equipo.id}>
                      {equipo.nombre} {equipo.apellido}
                      {equipo.cargo ? ` - ${equipo.cargo}` : ""}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Categoría *
                <select
                  style={estilos.input}
                  name="categoriaId"
                  value={formulario.categoriaId}
                  onChange={cambiarCampo}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label style={{
              display: "block",
              marginTop: "20px",
            }}>
              Sinopsis *
              <textarea
                style={{
                  ...estilos.input,
                  minHeight: "120px",
                  resize: "vertical",
                }}
                name="sinopsis"
                value={formulario.sinopsis}
                onChange={cambiarCampo}
                minLength={10}
                maxLength={2000}
                required
              />
            </label>

            <div style={{
              display: "flex",
              gap: "12px",
              marginTop: "22px",
              flexWrap: "wrap",
            }}>
              <button
                type="submit"
                disabled={guardando}
                style={{
                  ...estilos.boton,
                  background: "#6845c5",
                  color: "white",
                }}
              >
                {guardando
                  ? "Guardando..."
                  : peliculaEditando !== null
                    ? "Guardar cambios"
                    : "Crear película"}
              </button>

              {peliculaEditando !== null && (
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  style={{
                    ...estilos.boton,
                    background: "#555",
                    color: "white",
                  }}
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </section>

        <section style={estilos.tarjeta}>
          <h2>Películas registradas</h2>

          {cargando ? (
            <p>Cargando películas desde Neon...</p>
          ) : peliculas.length === 0 ? (
            <p>No hay películas registradas en el backend.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}>
                <thead>
                  <tr>
                    {["ID", "Título", "Año", "Público", "Crítica", "Acciones"].map(
                      (titulo) => (
                        <th key={titulo} style={{
                          padding: "13px",
                          borderBottom: "1px solid #444",
                        }}>
                          {titulo}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {peliculas.map((pelicula) => (
                    <tr key={pelicula.id}>
                      <td style={{ padding: "13px" }}>{pelicula.id}</td>
                      <td style={{ padding: "13px" }}>{pelicula.titulo}</td>
                      <td style={{ padding: "13px" }}>{pelicula.anio}</td>
                      <td style={{ padding: "13px" }}>
                        {pelicula.aprobacionPublico ?? "—"}%
                      </td>
                      <td style={{ padding: "13px" }}>
                        {pelicula.aprobacionCritica ?? "—"}%
                      </td>
                      <td style={{
                        padding: "13px",
                        whiteSpace: "nowrap",
                      }}>
                        <button
                          type="button"
                          onClick={() => prepararEdicion(pelicula)}
                          style={{
                            ...estilos.boton,
                            background: "#315c91",
                            color: "white",
                            marginRight: "7px",
                          }}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => borrarPelicula(pelicula)}
                          style={{
                            ...estilos.boton,
                            background: "#a83242",
                            color: "white",
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            type="button"
            onClick={cargarDatos}
            style={{
              ...estilos.boton,
              background: "#444",
              color: "white",
              marginTop: "20px",
            }}
          >
            Actualizar listado
          </button>
        </section>
        <section style={estilos.tarjeta}>
          <h2>Gestión de usuarios</h2>

          <p style={{ color: "#aaa" }}>
            Administra las cuentas y los permisos de Space Movie.
          </p>

          {errorUsuarios && (
            <div style={{
              background: "#642c35",
              padding: "14px",
              borderRadius: "7px",
              marginBottom: "15px",
            }}>
              {errorUsuarios}
            </div>
          )}

          {mensajeUsuarios && (
            <div style={{
              background: "#20583e",
              padding: "14px",
              borderRadius: "7px",
              marginBottom: "15px",
            }}>
              {mensajeUsuarios}
            </div>
          )}

          {usuarioEditando !== null && (
            <form onSubmit={guardarUsuario} style={{
              background: "#292938",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "25px",
            }}>
              <h3>Editar usuario</h3>

              <label>
                Nombre
                <input
                  style={estilos.input}
                  name="nombre"
                  value={formularioUsuario.nombre}
                  onChange={cambiarCampoUsuario}
                  minLength={3}
                  maxLength={50}
                  required
                />
              </label>

              <label style={{ display: "block", marginTop: "15px" }}>
                Correo
                <input
                  style={estilos.input}
                  type="email"
                  name="correo"
                  value={formularioUsuario.correo}
                  onChange={cambiarCampoUsuario}
                  required
                />
              </label>

              <label style={{ display: "block", marginTop: "15px" }}>
                Tipo de cuenta
                <select
                  style={estilos.input}
                  name="tipoUsuarioId"
                  value={formularioUsuario.tipoUsuarioId}
                  onChange={cambiarCampoUsuario}
                  required
                >
                  <option value="">Seleccionar rol</option>

                  {tiposUsuario.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre} - {tipo.tipoCuenta}
                    </option>
                  ))}
                </select>
              </label>

              <div style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
              }}>
                <button
                  type="submit"
                  style={{
                    ...estilos.boton,
                    background: "#6845c5",
                    color: "white",
                  }}
                >
                  Guardar cambios
                </button>

                <button
                  type="button"
                  onClick={cancelarEdicionUsuario}
                  style={{
                    ...estilos.boton,
                    background: "#555",
                    color: "white",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {cargandoUsuarios ? (
            <p>Cargando usuarios...</p>
          ) : usuarios.length === 0 ? (
            <p>No hay usuarios registrados.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}>
                <thead>
                  <tr>
                    {["ID", "Nombre", "Correo", "Rol", "Acciones"].map(
                      (titulo) => (
                        <th key={titulo} style={{
                          padding: "13px",
                          borderBottom: "1px solid #444",
                        }}>
                          {titulo}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {usuarios.map((usuarioFila) => {
                    const tipo = tiposUsuario.find(
                      (t) => Number(t.id) === Number(usuarioFila.tipoUsuarioId)
                    );

                    return (
                      <tr key={usuarioFila.id}>
                        <td style={{ padding: "13px" }}>
                          {usuarioFila.id}
                        </td>

                        <td style={{ padding: "13px" }}>
                          {usuarioFila.nombre}
                        </td>

                        <td style={{ padding: "13px" }}>
                          {usuarioFila.correo}
                        </td>

                        <td style={{ padding: "13px" }}>
                          {tipo?.nombre || "Sin rol"}
                        </td>

                        <td style={{
                          padding: "13px",
                          whiteSpace: "nowrap",
                        }}>
                          <button
                            type="button"
                            onClick={() => prepararEdicionUsuario(usuarioFila)}
                            style={{
                              ...estilos.boton,
                              background: "#315c91",
                              color: "white",
                              marginRight: "7px",
                            }}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => borrarUsuario(usuarioFila)}
                            disabled={
                              usuarioFila.correo === usuario?.correo
                            }
                            style={{
                              ...estilos.boton,
                              background: "#a83242",
                              color: "white",
                              opacity:
                                usuarioFila.correo === usuario?.correo
                                  ? 0.4
                                  : 1,
                            }}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <button
            type="button"
            onClick={cargarUsuarios}
            disabled={cargandoUsuarios}
            style={{
              ...estilos.boton,
              background: "#444",
              color: "white",
              marginTop: "20px",
            }}
          >
            Actualizar usuarios
          </button>
        </section>

        <section style={estilos.tarjeta}>
          <h2>Moderación de reseñas</h2>

          <p style={{ color: "#aaa" }}>
            Revisa los comentarios publicados por los usuarios y elimina
            aquellos que incumplan las normas de Space Movie.
          </p>

          {errorResenas && (
            <div style={{
              background: "#642c35",
              padding: "14px",
              borderRadius: "7px",
              marginBottom: "15px",
            }}>
              {errorResenas}
            </div>
          )}

          {mensajeResenas && (
            <div style={{
              background: "#20583e",
              padding: "14px",
              borderRadius: "7px",
              marginBottom: "15px",
            }}>
              {mensajeResenas}
            </div>
          )}

          {cargandoResenas ? (
            <p>Cargando reseñas...</p>
          ) : resenas.length === 0 ? (
            <p>No hay reseñas registradas.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}>
                <thead>
                  <tr>
                    {[
                      "ID",
                      "Usuario",
                      "Correo",
                      "Película",
                      "Tipo",
                      "Puntuación",
                      "Comentario",
                      "Fecha",
                      "Acciones",
                    ].map((titulo) => (
                      <th key={titulo} style={{
                        padding: "13px",
                        borderBottom: "1px solid #444",
                      }}>
                        {titulo}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {resenas.map((resena) => (
                    <tr key={resena.id}>
                      <td style={{ padding: "13px" }}>
                        {resena.id}
                      </td>

                      <td style={{ padding: "13px" }}>
                        {resena.usuarioNombre || "Sin nombre"}
                      </td>

                      <td style={{ padding: "13px" }}>
                        {resena.usuarioCorreo || "Sin correo"}
                      </td>

                      <td style={{ padding: "13px" }}>
                        {resena.productoTitulo || "Sin película"}
                      </td>

                      <td style={{ padding: "13px" }}>
                        {resena.tipoResenaNombre || "—"}
                      </td>

                      <td style={{ padding: "13px" }}>
                        {resena.valoracionPuntuacion ?? "—"}
                      </td>

                      <td style={{
                        padding: "13px",
                        minWidth: "220px",
                        maxWidth: "350px",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                      }}>
                        {resena.contenido}
                      </td>

                      <td style={{ padding: "13px" }}>
                        {resena.fechaCreacion
                          ? new Date(resena.fechaCreacion).toLocaleDateString()
                          : "—"}
                      </td>

                      <td style={{
                        padding: "13px",
                        whiteSpace: "nowrap",
                      }}>
                        <button
                          type="button"
                          onClick={() => borrarResena(resena)}
                          style={{
                            ...estilos.boton,
                            background: "#a83242",
                            color: "white",
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            type="button"
            onClick={cargarResenas}
            disabled={cargandoResenas}
            style={{
              ...estilos.boton,
              background: "#444",
              color: "white",
              marginTop: "20px",
            }}
          >
            Actualizar reseñas
          </button>
        </section>
      </div>
    </main>
  );
}

export default AdminPage;