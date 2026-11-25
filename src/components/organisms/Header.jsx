
import { Link, useNavigate } from 'react-router-dom';
import { NavLinks } from '../molecules/NavLinks';
import { useAuth } from '../../context/AuthContext';
import '../../styles/organisms/header.css';

export function Header({ nombre }) {
  const navigate = useNavigate();
  const { usuario, autenticado, logout } = useAuth();

  const cerrarSesion = () => {
    logout();
    navigate('/login');
  };

  const enlaces = [
    { label: 'Inicio', to: '/' },
    ...(autenticado
      ? [
          {
            label: usuario.rol === 'ADMIN'
              ? `Administrador (${usuario.correo})`
              : `Usuario (${usuario.correo})`,
            to: '/',
          },
          {
            label: 'Cerrar sesión',
            onClick: cerrarSesion,
          },
        ]
      : [
          { label: 'Iniciar sesión', to: '/login' },
          { label: 'Registrarse', to: '/registro' },
        ]),
  ];

  return (
    <header className="site-header sticky-top">
      <nav className="navbar container py-3" aria-label="Navegación principal">
        <Link className="navbar-brand brand" to="/">
          {nombre}
        </Link>

        <NavLinks items={enlaces} />
      </nav>
    </header>
  );
}
