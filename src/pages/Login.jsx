
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validarLogin } from "../utils/validaciones";
import { LoginForm } from "../components/organisms/LoginForm";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarLogin = async ({ correo, password }) => {
    setError("");

    const resultado = validarLogin(correo, password);

    if (resultado) {
      setError(resultado);
      return;
    }

    try {
      setCargando(true);

      await login(correo.trim().toLowerCase(), password);

      navigate("/");
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="logo-space">SPACE MOVIE</div>
        <h1>Iniciar sesión</h1>
        <p className="subtitle">Bienvenido</p>

        <LoginForm
          onLogin={manejarLogin}
          errorGlobal={error}
          cargando={cargando}
        />

        <p className="auth-link">
          ¿No tienes una cuenta?{" "}
          <Link to="/registro">Regístrate aquí</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
