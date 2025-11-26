import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { FiMail, FiLock } from 'react-icons/fi';
import AnimatedBackground from './AnimatedBackground';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/');
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err: any) {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen relative overflow-hidden">
      {/* Fondo animado */}
      <AnimatedBackground />

      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Formulario */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-96 space-y-6 animate-fadeIn"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-900">
          CuencaApp
        </h2>
        <p className="text-center text-gray-700 mb-4">
          Inicia sesión para continuar
        </p>

        {error && (
          <p className="text-red-500 text-center font-medium">{error}</p>
        )}

        <div className="relative">
          <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transform transition-all"
        >
          Entrar
        </button>
      </form>

      {/* Animaciones */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease forwards;
          }
        `}
      </style>
    </div>
  );
}
