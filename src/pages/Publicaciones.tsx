import { useEffect, useState } from 'react'
import API from '../api/axios'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function FitBounds({ puntos }: { puntos: Publicaciones[] }) {
  const map = useMap();

  useEffect(() => {
    if (puntos.length > 0) {
      const bounds = L.latLngBounds(
        puntos.map(p => [p.lat, p.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [puntos, map]);

  return null;
}

interface Publicaciones {
  id: number
  titulo: string
  descripcion: string
  estado: string
  lat: number
  lng: number
  fecha: string
  media: string
  autor_nombre: string
  categoria_nombre: string
}

const colores: Record<string, string> = {
  'contaminación': 'red',
  'proyectos': 'orange',
  'recursos hídricos': 'green',
  'voluntariado': 'blue',
  'default': 'grey'
};

const getColorIcon = (categoria: string) =>
  new L.Icon({
    iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-${
      colores[categoria] || colores['default']
    }.png`,
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    iconSize: [35, 55],
    iconAnchor: [17, 55],
    popupAnchor: [0, -55],
  });

export default function Publicaciones() {
  const [publicaciones, setPublicaciones] = useState<Publicaciones[]>([])
  const [showModal, setShowModal] = useState(false)

  // FORMULARIO LIMPIO Y CORRECTO
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    estado: "",
    lat: "",
    lng: "",
    id_categoria: "1",
    tipo: "",
    media: ""
  })

  useEffect(() => {
    cargarPublicaciones()
  }, [])

  const cargarPublicaciones = () => {
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
  }

  // POST CORREGIDO – SOLO ENVÍA LO QUE TU API ACEPTA
  const handleSubmit = async () => {
    try {
      await API.post('/publicaciones', {
        id_categoria: Number(form.id_categoria),
        tipo: form.tipo,
        titulo: form.titulo,
        descripcion: form.descripcion,
        estado: form.estado,
        lat: Number(form.lat),
        lng: Number(form.lng),
        media: form.media || "default.jpg"   // ← ← ← SOLUCIÓN
        // usuario_id YA NO SE ENVÍA (token lo agrega)
      })

      setShowModal(false)
      cargarPublicaciones()
    } catch (err) {
      console.error(err)
    }
  }

  const center: [number, number] =
    publicaciones.length > 0
      ? [
          publicaciones.reduce((sum, p) => sum + p.lat, 0) / publicaciones.length,
          publicaciones.reduce((sum, p) => sum + p.lng, 0) / publicaciones.length,
        ]
      : [20.715, -103.36]

  return (
  <div className="p-4 h-screen w-full flex flex-col overflow-hidden">

    {/* BARRA SUPERIOR */}
    <div className="flex-shrink-0 flex justify-between items-center mb-4">
      <h1 className="text-3xl font-bold text-black">Publicaciones</h1>

      <button
        onClick={() => {
          setForm({
            titulo: "",
            descripcion: "",
            estado: "",
            lat: "",
            lng: "",
            id_categoria: "1",
            tipo: "",
            media: ""
          })
          setShowModal(true)
        }}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow "
      >
        + Nueva publicación
      </button>
    </div>

    {/* CONTENEDOR HORIZONTAL */}
    <div className="flex flex-row gap-4 flex-1 overflow-hidden">

      {/* MAPA (70%) */}
      <div className="w-2/3 h-full">
        <MapContainer center={center} zoom={10} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <FitBounds puntos={publicaciones} />

          {publicaciones.map(pub => (
            <Marker
              key={pub.id}
              position={[pub.lat, pub.lng]}
              icon={getColorIcon(pub.categoria_nombre)}
            >
              <Popup>
                <strong>{pub.titulo}</strong>
                <p>{pub.descripcion}</p>
                <p>Autor: {pub.autor_nombre}</p>
                <p>Categoría: {pub.categoria_nombre}</p>
                <p>Fecha: {new Date(pub.fecha).toLocaleString()}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* LISTADO (30%) */}
      <div className="w-1/3 h-full overflow-y-auto pr-1 text-black">
        {publicaciones.map(pub => (
          <div
            key={pub.id}
            className="border rounded p-2 mb-2 shadow hover:bg-gray-100 transition"
          >
            <h2 className="font-semibold">{pub.titulo}</h2>
            <p>{pub.descripcion}</p>
            <p className="text-sm text-gray-500">
              Autor: {pub.autor_nombre} | Categoría: {pub.categoria_nombre} | 
              Fecha: {new Date(pub.fecha).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

    </div>

    {/* MODAL */}
    {showModal && (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[999999] pointer-events-auto">
        <div className="bg-white p-4 rounded shadow w-96 relative z-[1000000]">
          <h2 className="text-xl text-black font-bold mb-3">Nueva publicación</h2>

          <input
            className="w-full border p-2 mb-2"
            placeholder="Título"
            value={form.titulo}
            onChange={e => setForm({ ...form, titulo: e.target.value })}
          />

          <textarea
            className="w-full border p-2 mb-2"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={e => setForm({ ...form, descripcion: e.target.value })}
          />

          <input
            className="w-full border p-2 mb-2"
            placeholder="Estado"
            value={form.estado}
            onChange={e => setForm({ ...form, estado: e.target.value })}
          />

          <input
            className="w-full border p-2 mb-2"
            placeholder="Latitud"
            value={form.lat}
            onChange={e => setForm({ ...form, lat: e.target.value })}
          />

          <input
            className="w-full border p-2 mb-2"
            placeholder="Longitud"
            value={form.lng}
            onChange={e => setForm({ ...form, lng: e.target.value })}
          />

          <input
            className="w-full border p-2 mb-2"
            placeholder="Tipo (ej: voluntariado)"
            value={form.tipo}
            onChange={e => setForm({ ...form, tipo: e.target.value })}
          />

          <input
            className="w-full border p-2 mb-2"
            placeholder="Media (ej: imagen.jpg)"
            value={form.media}
            onChange={e => setForm({ ...form, media: e.target.value })}
          />

          <select
            className="w-full border p-2 mb-2"
            value={form.id_categoria}
            onChange={e => setForm({ ...form, id_categoria: e.target.value })}
          >
            <option value="1">Contaminación</option>
            <option value="2">Proyectos</option>
            <option value="3">Recursos hídricos</option>
            <option value="4">Voluntariado</option>
          </select>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-2"
            onClick={handleSubmit}
          >
            Guardar
          </button>

          <button
            className="mt-2 text-red-600 w-full"
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </button>

        </div>
      </div>
    )}

  </div>
)

}
