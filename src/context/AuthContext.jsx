import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "spaceMovieToken";
const USER_KEY = "spaceMovieUsuario";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY)
  );

  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem(USER_KEY);
    return guardado ? JSON.parse(guardado) : null;
  });

  const login = async (correo, password) => {
    const response = await fetch(
      "http://localhost:8080/api/v1/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, password }),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || "Correo o contraseña incorrectos."
      );
    }

    localStorage.setItem(TOKEN_KEY, data.token);

    const nuevoUsuario = {
      correo: data.correo,
      rol: data.rol,
    };

    localStorage.setItem(USER_KEY, JSON.stringify(nuevoUsuario));

    setToken(data.token);
    setUsuario(nuevoUsuario);

    return nuevoUsuario;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        autenticado: Boolean(token && usuario),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider"
    );
  }

  return context;
}
