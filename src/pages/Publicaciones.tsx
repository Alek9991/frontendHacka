import { useEffect, useState } from 'react'
import API from '../api/axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Publicaciones {
  id: number
  titulo: string
  descripcion: string
  estado: string
  lat: number
  lng: number
  fecha: string
  media: boolean
  autor_nombre: string
  categoria_nombre: string
}

// Icono para los marcadores
const markerIcon = new L.Icon({
  iconUrl:
    'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [35, 55],
  iconAnchor: [17, 55],
  popupAnchor: [0, -55],
})

export default function Publicaciones() {
  const [publicaciones, setPublicaciones] = useState<Publicaciones[]>([])

  useEffect(() => {
    API.get('/publicaciones')
      .then(res => {
        const converted = res.data.map((p: any) => ({
          ...p,
          lat: Number(p.lat),
          lng: Number(p.lng),
        }))
        setPublicaciones(converted)
      })
      .catch(err => console.error(err))
  }, [])

  // Centro promedio del mapa según lat/lng
  const center: [number, number] =
    publicaciones.length > 0
      ? [
          publicaciones.reduce((sum, p) => sum + p.lat, 0) / publicaciones.length,
          publicaciones.reduce((sum, p) => sum + p.lng, 0) / publicaciones.length,
        ]
      : [20.715, -103.36]

  return (
    <div className="p-4 h-screen w-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-2">Publicaciones</h1>
      <p className="mb-4">Aquí se mostrarán los reportes y publicaciones de los usuarios.</p>

      {/* Mapa con las publicaciones */}
      <div className="flex-1 mb-4">
        <MapContainer center={center} zoom={10} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {publicaciones.map(pub => (
            <Marker key={pub.id} position={[pub.lat, pub.lng]} icon={markerIcon}>
              <Popup>
                <strong>{pub.titulo}</strong>
                <p>{pub.descripcion}</p>
                <p>Autor: {pub.autor_nombre}</p>
                <p>Categoria: {pub.categoria_nombre}</p>
                <p>Fecha: {new Date(pub.fecha).toLocaleString()}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Listado debajo del mapa */}
      <div className="overflow-y-auto h-1/3">
        {publicaciones.map(pub => (
          <div
            key={pub.id}
            className="border rounded p-2 mb-2 shadow hover:bg-gray-100 transition"
          >
            <h2 className="font-semibold">{pub.titulo}</h2>
            <p>{pub.descripcion}</p>
            <p className="text-sm text-gray-500">
              Autor: {pub.autor_nombre} | Categoria: {pub.categoria_nombre} | Fecha:{' '}
              {new Date(pub.fecha).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
