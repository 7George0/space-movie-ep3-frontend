
import { AuthProvider, useAuth } from './context/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/home';
import { SinopsisPage } from './pages/SinopsisPage';
import Login from './pages/Login';
import Registro from './pages/Registro';
import AdminPage from './pages/Admin';

function RutaAdmin({ children }) {
  const { autenticado, usuario } = useAuth();

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  if (usuario?.rol?.toUpperCase() !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sinopsis/:id" element={<SinopsisPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          <Route
            path="/admin"
            element={
              <RutaAdmin>
                <AdminPage />
              </RutaAdmin>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
