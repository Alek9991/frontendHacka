// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import API from '../api/axios';

interface Punto {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  fecha: string;
  lat: number;
  lng: number;
  media: boolean;
  usuario_id: number;
  autor_nombre: string;
  usuario_estado: string;
  categoria_nombre: string;
  categoria: string;
  autor: string;
  tipo?: string; // Si deseas usar "tipo", viene en algunos modelos anteriores
}


// Colores según categoría
const colores: Record<string, string> = {
  'contaminación': 'red',
  'proyectos': 'orange',
  'recursos hídricos': 'green',
  'voluntariado': 'blue',
  'default': 'grey'
};

// Evita solapamiento
const ajustarCercanos = (puntos: Punto[]): Punto[] => {
  const mapa: Record<string, number> = {};
  return puntos.map(p => {
    const key = `${p.lat}-${p.lng}`;
    const count = mapa[key] || 0;
    mapa[key] = count + 1;

    const offset = 0.00005 * count;

    return {
      ...p,
      lat: p.lat + offset,
      lng: p.lng + offset,
    };
  });
};

// Marker que cambia de tamaño según zoom
function ResizableMarker({ punto }: { punto: Punto }) {
  const map = useMap();
  const [icon, setIcon] = useState<L.Icon>(
    new L.Icon({
      iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-${
        colores[punto.categoria] || colores['default']
      }.png`,
      shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
      iconSize: [30, 60],
      iconAnchor: [15, 60],
      popupAnchor: [0, -60],
    })
  );

  useEffect(() => {
    const updateSize = () => {
      const zoom = map.getZoom();
      const scale = Math.min(Math.max(zoom / 5, 1), 3);

      const size: [number, number] = [20 * scale, 30 * scale];

      setIcon(
        new L.Icon({
          iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-${
            colores[punto.categoria] || colores['default']
          }.png`,
          shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
          iconSize: size,
          iconAnchor: [size[0] / 2, size[1]],
          popupAnchor: [0, -size[1]],
        })
      );
    };

    map.on('zoomend', updateSize);
    updateSize();

    return () => {
      map.off('zoomend', updateSize);
    };
  }, [map, punto.categoria]);

  return (
    <Marker position={[punto.lat, punto.lng]} icon={icon}>
      <Popup>
  <p><b>Título:</b> {punto.titulo}</p>
  <p><b>Descripción:</b> {punto.descripcion}</p>
  <p><b>Categoría:</b> {punto.categoria}</p>
  <p><b>Autor:</b> {punto.autor_nombre}</p>
  <p><b>Estado:</b> {punto.estado}</p>
  <p><b>Fecha:</b> {new Date(punto.fecha).toLocaleString()}</p>
  <p><b>Estado del usuario:</b> {punto.usuario_estado || "Desconocido"}</p>
  <p><b>Media:</b> {punto.media ? "Sí" : "No"}</p>
</Popup>

    </Marker>
  );
}

// Ajuste del mapa al contenido
function FitBounds({ puntos }: { puntos: Punto[] }) {
  const map = useMap();
  useEffect(() => {
    if (puntos.length === 0) return;

    const bounds = L.latLngBounds(
      puntos.map(p => [p.lat, p.lng] as [number, number])
    );

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, puntos]);

  return null;
}

export default function Home() {
  const [puntos, setPuntos] = useState<Punto[]>([]);

  useEffect(() => {
    API.get('/publicaciones')
  .then(res => {
    const converted: Punto[] = res.data.map((p: any) => ({
      id: p.id,
      titulo: p.titulo,
      descripcion: p.descripcion,
      estado: p.estado,
      fecha: p.fecha,
      lat: Number(p.lat),
      lng: Number(p.lng),
      media: p.media,
      usuario_id: p.usuario_id,
      autor_nombre: p.autor_nombre,
      usuario_estado: p.usuario_estado,
      categoria_nombre: p.categoria_nombre,
      categoria: p.categoria_nombre,
      autor: p.autor_nombre,

      // Si quieres después usar el campo "tipo"
      tipo: p.tipo || "N/A",
    }));

    setPuntos(ajustarCercanos(converted));
  })
  .catch(err => console.error(err));

  }, []);

  const defaultCenter: [number, number] = [20.70, -103.35];

  return (
    <div className="flex-1 w-full h-full">
      <MapContainer center={defaultCenter} zoom={10} className="flex-1 w-full h-full">
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
  );
}
