const API_URL = "http://localhost:8080/api/v1";

// Procesa respuestas del backend y gestiona errores.
async function solicitar(url, opciones = {}) {
  const respuesta = await fetch(url, opciones);
  const texto = await respuesta.text();

  let datos = null;

  try {
    datos = texto ? JSON.parse(texto) : null;
  } catch {
    datos = texto;
  }

  if (!respuesta.ok) {
    const mensaje =
      datos?.message ||
      datos?.error ||
      (typeof datos === "string" ? datos : null) ||
      `Error HTTP ${respuesta.status}`;

    throw new Error(mensaje);
  }

  return datos;
}

// Cabeceras para operaciones protegidas.
function cabecerasAdmin(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Consultas públicas.
export function listarPeliculasAdmin() {
  return solicitar(`${API_URL}/productos`);
}

export function listarCategorias() {
  return solicitar(`${API_URL}/categorias`);
}

export function listarEquiposDireccion() {
  return solicitar(`${API_URL}/equipos-direccion`);
}

// Crear película.
export function crearPelicula(datos, token) {
  return solicitar(`${API_URL}/productos`, {
    method: "POST",
    headers: cabecerasAdmin(token),
    body: JSON.stringify(datos),
  });
}

// Actualizar película.
export function actualizarPelicula(id, datos, token) {
  return solicitar(`${API_URL}/productos/${id}`, {
    method: "PUT",
    headers: cabecerasAdmin(token),
    body: JSON.stringify(datos),
  });
}

// Eliminar película.
export function eliminarPelicula(id, token) {
  return solicitar(`${API_URL}/productos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export function listarUsuariosAdmin(token) {
  return solicitar(`${API_URL}/usuarios`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function listarTiposUsuario(token) {
  return solicitar(`${API_URL}/tipos-usuario`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function actualizarUsuarioAdmin(id, datos, token) {
  return solicitar(`${API_URL}/usuarios/${id}`, {
    method: "PUT",
    headers: cabecerasAdmin(token),
    body: JSON.stringify(datos),
  });
}

export function eliminarUsuarioAdmin(id, token) {
  return solicitar(`${API_URL}/usuarios/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Listar todas las reseñas para el panel de administración.
export function listarResenasAdmin() {
  return solicitar(`${API_URL}/resenas`);
}

// Eliminar una reseña como administrador.
export function eliminarResenaAdmin(id, token) {
  return solicitar(`${API_URL}/resenas/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}