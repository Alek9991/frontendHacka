// src/pages/Alertas.tsx
import { useEffect, useState } from 'react';
import API from '../api/axios';
import dayjs from 'dayjs';

interface Alerta {
  id: number;
  tipo: string;
  mensaje: string;
  nivel_riesgo: 'alto' | 'medio' | 'bajo' | null;
  estado: string;
  datos_clima: string | null;
  fecha: string;
}

export default function Alertas() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);

  useEffect(() => {
    API.get('/alertas')
      .then(res => setAlertas(res.data))
      .catch(err => console.error(err));
  }, []);

  // Función para determinar color según tipo y nivel
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

  return (
    <div className="p-6 bg-red-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Alertas</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {alertas.map(alerta => (
          <div
            key={alerta.id}
            className={`p-4 rounded-xl shadow-lg border-l-4 ${getAlertColor(alerta)} transition-all hover:scale-105`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg capitalize">{alerta.tipo}</span>
              <span className="text-sm text-gray-200">
                {dayjs(alerta.fecha).format('DD MMM YYYY, HH:mm')}
              </span>
            </div>
            <p className="text-white font-medium">{alerta.mensaje}</p>
            {alerta.estado && (
              <p className="mt-2 text-gray-200 italic text-sm">Estado: {alerta.estado}</p>
            )}
            {alerta.datos_clima && (
              <p className="mt-1 text-gray-300 text-sm">
                Clima: {JSON.parse(alerta.datos_clima).probabilidad_lluvia * 100}% probabilidad de lluvia
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
