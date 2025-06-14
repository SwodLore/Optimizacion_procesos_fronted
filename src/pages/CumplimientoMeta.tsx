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
  const [metaMensual, setMetaMensual] = useState(3000);
  const [vista, setVista] = useState<'diaria' | 'mensual'>('diaria');

  // Agrupación de ventas por día o mes
  const ventasAgrupadas = ventas.reduce((acc: { [key: string]: number }, venta) => {
    const fecha = new Date(venta.fecha);
    const clave = vista === 'diaria'
      ? fecha.toISOString().split('T')[0]
      : `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    acc[clave] = (acc[clave] || 0) + Number(venta.unidades);
    return acc;
  }, {});

  const metaActual = vista === 'diaria' ? metaDiaria : metaMensual;

  const datosGrafico = Object.entries(ventasAgrupadas).map(([periodo, ventas]) => ({
    periodo,
    ventas,
    meta: metaActual
  }));

  const totalVentas = Object.values(ventasAgrupadas).reduce((a, b) => a + b, 0);
  const totalPeriodos = Object.keys(ventasAgrupadas).length;
  const metaTotal = metaActual * totalPeriodos;
  const porcentajeCumplimiento = (totalVentas / metaTotal) * 100;
  const periodosCumplidos = Object.values(ventasAgrupadas).filter(v => v >= metaActual).length;
  const porcentajeCumplidos = (periodosCumplidos / totalPeriodos) * 100;

  const stats = [
    {
      label: 'Cumplimiento Total',
      value: `${porcentajeCumplimiento.toFixed(1)}%`,
      icon: Gauge,
      desc: 'Meta vs Real',
      color: 'text-blue-600'
    },
    {
      label: vista === 'diaria' ? 'Días Cumplidos' : 'Meses Cumplidos',
      value: periodosCumplidos,
      icon: CheckCircle2,
      desc: `de ${totalPeriodos} ${vista === 'diaria' ? 'días' : 'meses'}`,
      color: 'text-green-600'
    },
    {
      label: `% ${vista === 'diaria' ? 'Días' : 'Meses'} Cumplidos`,
      value: `${porcentajeCumplidos.toFixed(1)}%`,
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
      {/* Configuración de metas */}
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z" />
          </svg>
          Configuración de Metas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="text-sm font-medium text-gray-700 w-48">
              Meta Diaria de Ventas:
            </label>
            <input
              type="number"
              value={metaDiaria}
              onChange={(e) => setMetaDiaria(Number(e.target.value))}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              min="1"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="text-sm font-medium text-gray-700 w-48">
              Meta Mensual de Ventas:
            </label>
            <input
              type="number"
              value={metaMensual}
              onChange={(e) => setMetaMensual(Number(e.target.value))}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              min="1"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:col-span-2">
            <label className="text-sm font-medium text-gray-700 w-48">
              Tipo de Vista:
            </label>
            <select
              value={vista}
              onChange={(e) => setVista(e.target.value as 'diaria' | 'mensual')}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="diaria">Diaria</option>
              <option value="mensual">Mensual</option>
            </select>
          </div>
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

      {/* Gráfico */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Seguimiento de Meta ({vista})</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ventas" stroke="#4CAF50" name="Ventas Reales" />
              <Line type="monotone" dataKey="meta" stroke="#FF9800" name={`Meta ${vista}`} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Detalle por {vista === 'diaria' ? 'Día' : 'Mes'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="px-4 py-2">{vista === 'diaria' ? 'Día' : 'Mes'}</th>
                <th className="px-4 py-2">Ventas</th>
                <th className="px-4 py-2">Meta</th>
                <th className="px-4 py-2">Cumplimiento</th>
              </tr>
            </thead>
            <tbody>
              {datosGrafico.map((dato, idx) => (
                <tr key={dato.periodo} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2">{dato.periodo}</td>
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
