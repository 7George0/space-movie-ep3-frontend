
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validarRegistro } from "../utils/validaciones";
import { RegisterForm } from "../components/organisms/RegisterForm";
import "../styles/auth.css";

function Registro() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  const manejarRegistro = async ({
    nombre,
    correo,
    password,
    confirmar,
  }) => {
    setError("");
    setExito(false);

    const resultado = validarRegistro(
      nombre,
      correo,
      password,
      confirmar
    );

    if (resultado) {
      setError(resultado);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/usuarios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: nombre.trim(),
            correo: correo.trim().toLowerCase(),
            password: password,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          "No se pudo completar el registro."
        );
      }

      setExito(true);

    } catch (err) {
      setError(
        err.message || "No se pudo conectar con el servidor."
      );
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="logo-space">SPACE MOVIE</div>
        <h1>Crear cuenta</h1>
        <p className="subtitle">
          Regístrate y comienza tu experiencia
        </p>

        <RegisterForm
          onRegistro={manejarRegistro}
          errorGlobal={error}
          exito={exito}
          irAlLogin={() => navigate("/login")}
        />

        <p className="auth-link">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login">Iniciar sesión</Link>
        </p>
      </section>
    </main>
  );
}

export default Registro;
