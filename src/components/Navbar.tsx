import { Link } from 'react-router-dom';
import {
  FiMenu,
  FiHome,
  FiFileText,
  FiAlertCircle,
} from 'react-icons/fi';

interface NavbarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Navbar({ open, setOpen }: NavbarProps) {
  const links = [
    { name: 'Inicio', path: '/', icon: <FiHome size={20} /> },
    { name: 'Publicaciones', path: '/publicaciones', icon: <FiFileText size={20} /> },
    { name: 'Alertas', path: '/alertas', icon: <FiAlertCircle size={20} /> },
  ];

  return (
    <nav
      className={`flex flex-col h-screen bg-blue-600 text-white p-4 transition-all duration-300 ${
        open ? 'w-56' : 'w-16'
      }`}
    >
      {/* Botón menú */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-blue-600 z-10">
        {open && <span className="text-lg font-bold">CuencaApp</span>}
        <button
          onClick={() => setOpen(!open)}
          className="p-1 rounded hover:bg-blue-500 transition-colors text-white"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Links */}
      <div className="flex flex-col gap-4 mt-4">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="flex items-center gap-2 text-white hover:text-black relative group"
          >
            {link.icon}
            {open && <span>{link.name}</span>}

            {/* Tooltip cuando la sidebar está colapsada */}
            {!open && (
              <span className="absolute left-16 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {link.name}
              </span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
