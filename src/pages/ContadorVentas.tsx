import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, ListOrdered } from 'lucide-react';
import { obtenerVentas } from '../services/ventasService';
import Spinner from '../components/Spinner'; 
import type { Venta } from '../types';

const ContadorVentas = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const data = await obtenerVentas();
        setVentas(data);
      } catch (error) {
        console.error('Error al obtener ventas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  // Mostrar spinner mientras se cargan los datos
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Spinner />
      </div>
    );
  }

  // Procesamiento de datos
  const ventasPorDia = ventas.reduce((acc: { [key: string]: number }, venta) => {
    const fecha = venta.fecha.split('T')[0]; // 🔧 Removemos la parte de la hora
    acc[fecha] = (acc[fecha] || 0) + Number(venta.unidades);
    return acc;
  }, {});

  const datosGrafico = Object.entries(ventasPorDia).map(([dia, ventas]) => ({
    dia,
    ventas
  }));

  const totalVentas = ventas.reduce((acc, curr) => acc + Number(curr.unidades), 0);
  const promedioVentas = ventas.length ? Math.round(totalVentas / ventas.length) : 0;
  const maxVentas = Math.max(...Object.values(ventasPorDia));
  const minVentas = Math.min(...Object.values(ventasPorDia));

  const stats = [
    { label: 'Total Ventas', value: totalVentas, icon: ListOrdered, color: 'text-indigo-600' },
    { label: 'Promedio Diario', value: promedioVentas, icon: Activity, color: 'text-emerald-600' },
    { label: 'Máximo en un Día', value: maxVentas, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Mínimo en un Día', value: minVentas, icon: TrendingDown, color: 'text-red-600' },
  ];

  return (
    <div className="space-y-10">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow"
          >
            <stat.icon className={`w-10 h-10 ${stat.color}`} />
            <div>
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Gráfico de Ventas Diarias</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventas" fill="#6366f1" name="Ventas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de resumen */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Resumen por Día</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="px-4 py-2">Día</th>
                <th className="px-4 py-2">Ventas</th>
                <th className="px-4 py-2">% del Total</th>
              </tr>
            </thead>
            <tbody>
              {datosGrafico.map((dato, index) => (
                <tr
                  key={dato.dia}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-4 py-2">{dato.dia}</td>
                  <td className="px-4 py-2">{dato.ventas}</td>
                  <td className="px-4 py-2">{((dato.ventas / totalVentas) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContadorVentas;
