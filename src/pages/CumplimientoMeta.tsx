import { useState } from 'react';
import { useVentas } from '../context/VentasContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Gauge, CheckCircle2, CalendarCheck2, Target
} from 'lucide-react';

const CumplimientoMeta = () => {
  const { ventas } = useVentas();
  const [metaDiaria, setMetaDiaria] = useState(100);

  const ventasPorDia = ventas.reduce((acc: { [key: string]: number }, venta) => {
    const fecha = venta.fecha;
    acc[fecha] = (acc[fecha] || 0) + Number(venta.unidades);
    return acc;
  }, {});

  const datosGrafico = Object.entries(ventasPorDia).map(([dia, ventas]) => ({
    dia,
    ventas,
    meta: metaDiaria
  }));

  const totalVentas = ventas.reduce((acc, curr) => acc + Number(curr.unidades), 0);
  const diasTotales = Object.keys(ventasPorDia).length;
  const metaTotal = metaDiaria * diasTotales;
  const porcentajeCumplimiento = (totalVentas / metaTotal) * 100;
  const diasCumplidos = Object.values(ventasPorDia).filter(v => v >= metaDiaria).length;
  const porcentajeDiasCumplidos = (diasCumplidos / diasTotales) * 100;

  const stats = [
    {
      label: 'Cumplimiento Total',
      value: `${porcentajeCumplimiento.toFixed(1)}%`,
      icon: Gauge,
      desc: 'Meta vs Real',
      color: 'text-blue-600'
    },
    {
      label: 'Días Cumplidos',
      value: diasCumplidos,
      icon: CheckCircle2,
      desc: `de ${diasTotales} días`,
      color: 'text-green-600'
    },
    {
      label: '% Días Cumplidos',
      value: `${porcentajeDiasCumplidos.toFixed(1)}%`,
      icon: CalendarCheck2,
      desc: 'Cumplidos vs Total',
      color: 'text-emerald-600'
    },
    {
      label: 'Meta Total',
      value: metaTotal,
      icon: Target,
      desc: 'Unidades objetivo',
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="space-y-10">
      {/* Meta configurador */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Configuración de Meta</h2>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <label className="text-sm font-medium text-gray-600">
            Meta Diaria de Ventas:
          </label>
          <input
            type="number"
            value={metaDiaria}
            onChange={(e) => setMetaDiaria(Number(e.target.value))}
            className="input input-bordered w-full max-w-xs border-gray-300 focus:ring-2 focus:ring-indigo-500 rounded-md"
            min="1"
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, desc, color }) => (
          <div key={label} className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg">
            <Icon className={`w-10 h-10 ${color}`} />
            <div>
              <div className="text-sm text-gray-500">{label}</div>
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              <div className="text-xs text-gray-400">{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de cumplimiento */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Seguimiento de Meta</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ventas" stroke="#4CAF50" name="Ventas Reales" />
              <Line type="monotone" dataKey="meta" stroke="#FF9800" name="Meta Diaria" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detalle diario */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Detalle por Día</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="px-4 py-2">Día</th>
                <th className="px-4 py-2">Ventas</th>
                <th className="px-4 py-2">Meta</th>
                <th className="px-4 py-2">Cumplimiento</th>
              </tr>
            </thead>
            <tbody>
              {datosGrafico.map((dato, idx) => (
                <tr key={dato.dia} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2">{dato.dia}</td>
                  <td className="px-4 py-2">{dato.ventas}</td>
                  <td className="px-4 py-2">{dato.meta}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span>{((dato.ventas / dato.meta) * 100).toFixed(1)}%</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            dato.ventas >= dato.meta ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min((dato.ventas / dato.meta) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CumplimientoMeta;
