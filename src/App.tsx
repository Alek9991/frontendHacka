import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Posts from './pages/Posts';
import Alertas from './pages/Alertas';
import Login from './pages/Login';
import Header from './pages/Header';



function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar lateral */}
        <Navbar open={sidebarOpen} setOpen={setSidebarOpen} />
        
        {/* Contenedor principal */}
        <div className="flex-1 flex flex-col transition-all duration-300">
          {/* Header superior */}
          <Header open={sidebarOpen} setOpen={setSidebarOpen} />

          {/* Contenido */}
          <div className="flex-1 overflow-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts" element={<Posts />} />
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
