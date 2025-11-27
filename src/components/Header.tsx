import { FiMenu, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userLogged: boolean;
  setUserLogged: (v: boolean) => void;
}

export default function Header({ open, setOpen, userLogged, setUserLogged }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // eliminar token
    setUserLogged(false); // actualizar estado global
    navigate('/login'); // redirigir al login
  };

  return (
    <header className="flex items-center justify-between bg-blue-600 text-white p-4 shadow-md sticky top-0 z-20">
      {/* Botón hamburguesa */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded hover:bg-blue-500 transition-colors md:hidden"
      >
        <FiMenu size={24} />
      </button>

  
      {/* Botón usuario / login */}
      <button
        onClick={() => navigate('/login')} // Redirige a la página de login
        className="flex items-center gap-2 p-2 rounded hover:bg-blue-500 transition-colors"
      >
        <FiUser size={20} />
        <span className="hidden md:inline">Login</span>
      </button>
      {/* Título de la app */}
      <h1 className="text-xl font-bold">CuencaApp</h1>

      {/* Botón usuario / login / logout */}
      {userLogged ? (
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-2 rounded hover:bg-red-500 transition-colors"
        >
          <FiUser size={20} />
          <span className="hidden md:inline">Cerrar sesión</span>
        </button>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 p-2 rounded hover:bg-blue-500 transition-colors"
        >
          <FiUser size={20} />
          <span className="hidden md:inline">Login</span>
        </button>
      )}
    </header>
  );
}
