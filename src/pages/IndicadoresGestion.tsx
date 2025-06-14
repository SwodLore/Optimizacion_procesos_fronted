import { useVentas } from '../context/VentasContext';
import { TrendingUp, TrendingDown, BarChart3, Activity, PercentCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const IndicadoresGestion = () => {
  const { ventas } = useVentas();

  const ventasPorDia = ventas.reduce((acc: { [key: string]: number }, venta) => {
    const fecha = venta.fecha;
    acc[fecha] = (acc[fecha] || 0) + Number(venta.unidades);
    return acc;
  }, {});

  const datosGrafico = Object.entries(ventasPorDia).map(([dia, ventas]) => ({
    dia,
    ventas,
    tendencia: ventas * 1.1
  }));

  const totalVentas = ventas.reduce((acc, curr) => acc + Number(curr.unidades), 0);
  const diasTotales = Object.keys(ventasPorDia).length;
  const promedioDiario = diasTotales ? totalVentas / diasTotales : 0;
  const maxVentas = Math.max(...Object.values(ventasPorDia));
  const minVentas = Math.min(...Object.values(ventasPorDia));
  const variacion = ((maxVentas - minVentas) / minVentas) * 100;

  const tendenciaVentas = ventas.length > 1
    ? ((ventas[ventas.length - 1].unidades - ventas[0].unidades) / ventas[0].unidades) * 100
    : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat bg-white shadow-md rounded-2xl p-4">
          <div className="flex items-center gap-2 text-primary">
            <BarChart3 className="w-6 h-6" />
            <span className="font-bold">Ventas Totales</span>
          </div>
          <div className="text-2xl font-semibold">{totalVentas}</div>
          <p className="text-sm text-gray-500">Unidades vendidas</p>
        </div>

        <div className="stat bg-white shadow-md rounded-2xl p-4">
          <div className="flex items-center gap-2 text-secondary">
            <Activity className="w-6 h-6" />
            <span className="font-bold">Promedio Diario</span>
          </div>
          <div className="text-2xl font-semibold">{promedioDiario.toFixed(1)}</div>
          <p className="text-sm text-gray-500">Unidades por día</p>
        </div>

        <div className="stat bg-white shadow-md rounded-2xl p-4">
          <div className="flex items-center gap-2 text-accent">
            <PercentCircle className="w-6 h-6" />
            <span className="font-bold">Variación</span>
          </div>
          <div className="text-2xl font-semibold">{variacion.toFixed(1)}%</div>
          <p className="text-sm text-gray-500">Máx vs Mín</p>
        </div>

        <div className="stat bg-white shadow-md rounded-2xl p-4">
          <div className="flex items-center gap-2">
            {tendenciaVentas > 0 ? <TrendingUp className="text-green-500 w-6 h-6" /> : tendenciaVentas < 0 ? <TrendingDown className="text-red-500 w-6 h-6" /> : <Activity className="w-6 h-6" />}
            <span className="font-bold">Tendencia</span>
          </div>
          <div className="text-2xl font-semibold">{tendenciaVentas > 0 ? '↑' : tendenciaVentas < 0 ? '↓' : '→'}</div>
          <p className="text-sm text-gray-500">{Math.abs(tendenciaVentas).toFixed(1)}%</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Tendencia de Ventas</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={datosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="ventas" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.3} name="Ventas Reales" />
              <Area type="monotone" dataKey="tendencia" stroke="#FF9800" fill="#FF9800" fillOpacity={0.3} name="Tendencia" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-100 shadow-lg rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h2m1-4h.01M20 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z" />
            </svg>
            Análisis de Productos
          </h2>

          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Ventas</th>
                  <th className="px-4 py-3">% del Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(
                  ventas.reduce((acc: { [key: string]: number }, curr) => {
                    acc[curr.producto] = (acc[curr.producto] || 0) + Number(curr.unidades);
                    return acc;
                  }, {})
                ).map(([producto, ventas]) => (
                  <tr key={producto} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium">{producto}</td>
                    <td className="px-4 py-3">{ventas}</td>
                    <td className="px-4 py-3 text-blue-600 font-semibold">{((ventas / totalVentas) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Resumen de Indicadores</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Eficiencia de Ventas</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min((promedioDiario / maxVentas) * 100, 100)}%` }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{((promedioDiario / maxVentas) * 100).toFixed(1)}% de eficiencia</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Estabilidad</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${Math.min((1 - variacion / 100) * 100, 100)}%` }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{((1 - variacion / 100) * 100).toFixed(1)}% de estabilidad</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Crecimiento</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${tendenciaVentas > 0 ? 'bg-green-600' : 'bg-red-600'}`} style={{ width: `${Math.min(Math.abs(tendenciaVentas), 100)}%` }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{tendenciaVentas > 0 ? 'Crecimiento' : 'Decrecimiento'} de {Math.abs(tendenciaVentas).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicadoresGestion;
