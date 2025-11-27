// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Publicaciones from './pages/Publicaciones';
import Alertas from './pages/Alertas';
import Login from './pages/Login';
import Header from './components/Header';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userLogged, setUserLogged] = useState(false);

  // Verificar token al iniciar la app
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setUserLogged(true);
  }, []);

  return (
    <Router>
      <div className="flex h-screen">
        <Navbar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col transition-all duration-300">
          <Header
            open={sidebarOpen}
            setOpen={setSidebarOpen}
            userLogged={userLogged}
            setUserLogged={setUserLogged}
          />

          {/* Contenedor de rutas */}
          <div className="flex-1 relative overflow-auto bg-gray-100">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/publicaciones" element={<Publicaciones />} />
              <Route path="/alertas" element={<Alertas />} />

              {/* Login centrado solo si no está logueado */}
              <Route
                path="/login"
                element={
                  !userLogged ? (
                    <div className="flex-1 flex justify-center items-center">
                      <div className="w-full max-w-sm">
                        <Login setUserLogged={setUserLogged} />
                      </div>
                    </div>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
