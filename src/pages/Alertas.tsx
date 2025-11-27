// src/pages/Alertas.tsx
import { useEffect, useState } from 'react';
import API from '../api/axios';
import dayjs from 'dayjs';

interface Alerta {
  id: number;
  tipo: 'ciudadano' | 'clima';
  mensaje: string;
  nivel_riesgo: 'alto' | 'medio' | 'bajo' | null;
  estado: string;
  datos_clima: string | null;
  fecha: string;
}

export default function Alertas() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState<'ciudadano' | 'clima'>('ciudadano');
  const [nuevoNivel, setNuevoNivel] = useState<'alto' | 'medio' | 'bajo' | null>(null);

  useEffect(() => {
    fetchAlertas();
  }, []);

  const fetchAlertas = () => {
    API.get('/alertas')
      .then(res => setAlertas(res.data))
      .catch(err => console.error(err));
  };

  const getAlertColor = (alerta: Alerta) => {
    if (alerta.tipo === 'ciudadano') return 'bg-blue-600';
    if (alerta.tipo === 'clima') {
      switch (alerta.nivel_riesgo) {
        case 'alto': return 'bg-red-600';
        case 'medio': return 'bg-yellow-500';
        case 'bajo': return 'bg-green-500';
        default: return 'bg-gray-500';
      }
    }
    return 'bg-gray-500';
  };

  const handleCrearAlerta = async () => {
    try {
      await API.post(
        '/alertas',
        { tipo: nuevoTipo, mensaje: nuevoMensaje, nivel_riesgo: nuevoNivel, estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setModalOpen(false);
      setNuevoMensaje('');
      setNuevoEstado('');
      setNuevoNivel(null);
      fetchAlertas();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-gray-100 text-black overflow-auto relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center">Alertas</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Nueva Alerta
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {alertas.map(alerta => (
          <div
            key={alerta.id}
            className={`p-4 rounded-xl shadow-lg border-l-4 ${getAlertColor(alerta)} transition-all hover:scale-105`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg capitalize">{alerta.tipo}</span>
              <span className="text-sm text-gray-700">
                {dayjs(alerta.fecha).format('DD MMM YYYY, HH:mm')}
              </span>
            </div>
            <p className="font-medium">{alerta.mensaje}</p>
            {alerta.estado && (
              <p className="mt-2 italic text-sm">Estado: {alerta.estado}</p>
            )}
            {alerta.datos_clima && (
              <p className="mt-1 text-sm">
                Clima: {JSON.parse(alerta.datos_clima).probabilidad_lluvia * 100}% probabilidad de lluvia
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-auto p-6 z-50">
          <div className="bg-white text-black p-6 rounded-lg w-full max-w-md mt-20">
            <h2 className="text-xl font-bold mb-4">Crear alerta</h2>

            <label className="block mb-2 font-semibold">Tipo de alerta</label>
            <select
              value={nuevoTipo}
              onChange={e => setNuevoTipo(e.target.value as 'ciudadano' | 'clima')}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
            >
              <option value="ciudadano">Ciudadano</option>
              <option value="clima">Clima</option>
            </select>

            {nuevoTipo === 'clima' && (
              <>
                <label className="block mb-2 font-semibold">Nivel de riesgo</label>
                <select
                  value={nuevoNivel || ''}
                  onChange={e => setNuevoNivel(e.target.value as 'alto' | 'medio' | 'bajo')}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                >
                  <option value="">Seleccione</option>
                  <option value="alto">Alto</option>
                  <option value="medio">Medio</option>
                  <option value="bajo">Bajo</option>
                </select>
              </>
            )}

            <input
              type="text"
              placeholder="Mensaje"
              value={nuevoMensaje}
              onChange={e => setNuevoMensaje(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
            />
            <input
              type="text"
              placeholder="Estado"
              value={nuevoEstado}
              onChange={e => setNuevoEstado(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearAlerta}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
