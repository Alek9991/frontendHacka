import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Publicaciones from './pages/Publicaciones';
import Alertas from './pages/Alertas';
import Login from './pages/Login';
import Header from './components/Header';


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
    <div className="flex h-screen">
  <Navbar open={sidebarOpen} setOpen={setSidebarOpen} />

  <div className="flex-1 flex flex-col transition-all duration-300">
    <Header open={sidebarOpen} setOpen={setSidebarOpen} />

    {/* Contenedor de rutas */}
    <div className="flex-1 flex relative overflow-hidden">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/publicaciones" element={<Publicaciones />} />
        <Route path="/alertas" element={<Alertas />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  </div>
</div>

    </Router>
  );
}


export default App;
