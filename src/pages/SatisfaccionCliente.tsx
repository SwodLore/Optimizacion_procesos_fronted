import { useEffect, useState } from 'react';
import { useVentas } from '../context/VentasContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getEncuestas, setEncuestas } from '../utils/localStorage';
import type { Encuesta } from '../types';

const SatisfaccionCliente = () => {
  const { ventas } = useVentas();
  const [encuestas, setEncuestasState] = useState<Encuesta[]>([]);
  const [nuevaEncuesta, setNuevaEncuesta] = useState({
    producto: '',
    calificacion: 5,
    comentario: ''
  });

  useEffect(() => {
    const datos = getEncuestas();
    setEncuestasState(datos);
  }, []);

  // Guardar encuestas en localStorage cada vez que cambian
  useEffect(() => {
    if (encuestas.length > 0) {
      setEncuestas(encuestas);
    }
  }, [encuestas]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nueva = {
      id: Date.now(),
      fecha: new Date().toISOString().split('T')[0],
      ...nuevaEncuesta
    };
    const nuevasEncuestas = [...encuestas, nueva];
    setEncuestasState(nuevasEncuestas);
    setNuevaEncuesta({ producto: '', calificacion: 5, comentario: '' });
  };

  // Estadísticas
  const totalEncuestas = encuestas.length;
  const promedioCalificacion = totalEncuestas
    ? encuestas.reduce((acc, curr) => acc + curr.calificacion, 0) / totalEncuestas
    : 0;
  const calificacionesPorNivel = encuestas.reduce((acc: { [key: number]: number }, curr) => {
    acc[curr.calificacion] = (acc[curr.calificacion] || 0) + 1;
    return acc;
  }, {});

  const datosGrafico = Object.entries(calificacionesPorNivel).map(([calificacion, cantidad]) => ({
    name: `${calificacion} estrellas`,
    value: cantidad
  }));

  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

  return (
    <div className="space-y-10 p-4 text-gray-800">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-5 hover:shadow-md transition">
          <h3 className="text-sm text-gray-500 font-medium">Total Encuestas</h3>
          <p className="text-2xl font-semibold mt-1">{totalEncuestas}</p>
          <p className="text-xs text-gray-400 mt-1">Encuestas recibidas</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-5 hover:shadow-md transition">
          <h3 className="text-sm text-gray-500 font-medium">Calificación Promedio</h3>
          <p className="text-2xl font-semibold mt-1">{promedioCalificacion.toFixed(1)}</p>
          <p className="text-xs text-gray-400 mt-1">de 5 estrellas</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-5 hover:shadow-md transition">
          <h3 className="text-sm text-gray-500 font-medium">Nivel de Satisfacción</h3>
          <p className="text-2xl font-semibold mt-1">
            {promedioCalificacion >= 4 ? 'Alta' : promedioCalificacion >= 3 ? 'Media' : 'Baja'}
          </p>
          <p className="text-xs text-gray-400 mt-1">Valoración general</p>
        </div>
      </div>

      {/* Formulario y gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-6">Nueva Encuesta</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
              <select
                value={nuevaEncuesta.producto}
                onChange={(e) => setNuevaEncuesta({ ...nuevaEncuesta, producto: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              >
                <option value="">Seleccione un producto</option>
                {Array.from(new Set(ventas.map(v => v.producto))).map(producto => (
                  <option key={producto} value={producto}>{producto}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calificación</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((estrella) => (
                  <button
                    key={estrella}
                    type="button"
                    className={`text-2xl transition ${nuevaEncuesta.calificacion >= estrella ? 'text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setNuevaEncuesta({ ...nuevaEncuesta, calificacion: estrella })}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comentario</label>
              <textarea
                value={nuevaEncuesta.comentario}
                onChange={(e) => setNuevaEncuesta({ ...nuevaEncuesta, comentario: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Escriba su comentario aquí..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 text-white rounded-md px-4 py-2 font-medium hover:bg-gray-700 transition"
            >
              Enviar Encuesta
            </button>
          </form>
        </div>

        {/* Gráfico */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Distribución de Calificaciones</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datosGrafico}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  labelLine={false}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {datosGrafico.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Historial de encuestas */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Historial de Encuestas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 font-medium">Fecha</th>
                <th className="px-4 py-2 font-medium">Producto</th>
                <th className="px-4 py-2 font-medium">Calificación</th>
                <th className="px-4 py-2 font-medium">Comentario</th>
              </tr>
            </thead>
            <tbody>
              {encuestas.map((encuesta) => (
                <tr key={encuesta.id} className="border-t">
                  <td className="px-4 py-2">{encuesta.fecha}</td>
                  <td className="px-4 py-2">{encuesta.producto}</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-1 text-yellow-400">
                      {[...Array(encuesta.calificacion)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2">{encuesta.comentario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SatisfaccionCliente;
