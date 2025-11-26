// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import API from '../api/axios';
import Balatro from './AnimatedBackground';

interface Punto {
  id: number;
  nombre: string;
  descripcion?: string;
  tipo: string;
  lat: number;
  lng: number;
}

// Colores por categoría
const colores: Record<string, string> = {
  contaminacion: 'red',
  proyectos: 'orange',
  'recursos hídricos': 'green',
  voluntariado: 'blue',
};

// Ajustar coordenadas cercanas para no solaparse
const ajustarCercanos = (puntos: Punto[]): Punto[] => {
  const mapa: Record<string, number> = {};
  return puntos.map(p => {
    const key = `${p.lat}-${p.lng}`;
    const count = mapa[key] || 0;
    mapa[key] = count + 1;
    const offset = 0.00005 * count; // pequeño desplazamiento
    return {
      ...p,
      lat: p.lat + offset,
      lng: p.lng + offset,
    };
  });
};

// Componente para markers que cambian de tamaño según zoom
function ResizableMarker({ punto }: { punto: Punto }) {
  const map = useMap();
  const [icon, setIcon] = useState<L.Icon>(
    new L.Icon({
      iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-${
        colores[punto.tipo] || 'grey'
      }.png`,
      shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
      iconSize: [30, 60],
      iconAnchor: [20, 60],
      popupAnchor: [0, -60],
    })
  );

  useEffect(() => {
    const updateSize = () => {
      const zoom = map.getZoom();
      const scale = Math.min(Math.max(zoom / 5, 1), 2.5);
      const size: [number, number] = [20 * scale, 30 * scale];
      const anchor: [number, number] = [size[0] / 2, size[1]];

      setIcon(
        new L.Icon({
          iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-${
            colores[punto.tipo] || 'grey'
          }.png`,
          shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
          iconSize: size,
          iconAnchor: anchor,
          popupAnchor: [0, -size[1]],
        })
      );
    };

    map.on('zoomend', updateSize);
    updateSize(); // tamaño inicial

    return () => {
      map.off('zoomend', updateSize); // limpieza
    };
  }, [map, punto.tipo]);

  return (
    <Marker key={punto.id} position={[punto.lat, punto.lng]} icon={icon}>
      <Popup>
        <strong>{punto.nombre}</strong>
        {punto.descripcion && <p>{punto.descripcion}</p>}
        <p>Tipo: {punto.tipo}</p>
      </Popup>
    </Marker>
  );
}

// Ajusta automáticamente el mapa a todos los puntos
function FitBounds({ puntos }: { puntos: Punto[] }) {
  const map = useMap();
  useEffect(() => {
    if (puntos.length === 0) return;
    const bounds = L.latLngBounds(
      puntos.map(p => [p.lat, p.lng] as [number, number])
    );
    map.fitBounds(bounds, { padding: [50, 50] });
    // ❌ NO devolvemos nada, solo efecto
  }, [map, puntos]);

  return null;
}

export default function Home() {
  const [puntos, setPuntos] = useState<Punto[]>([]);

  useEffect(() => {
    API.get('/puntos')
      .then(res => {
        const converted: Punto[] = res.data.map((p: any) => ({
          id: p.id,
          nombre: p.nombre,
          descripcion: p.descripcion,
          tipo: p.tipo,
          lat: Number(p.lat),
          lng: Number(p.lng),
        }));
        setPuntos(ajustarCercanos(converted));
      })
      .catch(err => console.error(err));
  }, []);

  const defaultCenter: [number, number] = [20.715, -103.36]; // temporal mientras cargan los puntos

  return (
    <div className="h-screen w-screen relative">
      <Balatro isRotate={false} mouseInteraction={true} pixelFilter={700} />
      <div className="absolute inset-0 bg-black/20 z-0"></div>

      <div className="absolute inset-0 z-10">
        <MapContainer center={defaultCenter} zoom={10} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {puntos.map(p => (
            <ResizableMarker key={p.id} punto={p} />
          ))}

          <FitBounds puntos={puntos} />
        </MapContainer>
      </div>
    </div>
  );
}


