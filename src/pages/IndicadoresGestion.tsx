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
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Análisis de Productos</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Ventas</th>
                  <th>% del Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(
                  ventas.reduce((acc: { [key: string]: number }, curr) => {
                    acc[curr.producto] = (acc[curr.producto] || 0) + Number(curr.unidades);
                    return acc;
                  }, {})
                ).map(([producto, ventas]) => (
                  <tr key={producto} className="hover:bg-gray-100">
                    <td>{producto}</td>
                    <td>{ventas}</td>
                    <td>{((ventas / totalVentas) * 100).toFixed(1)}%</td>
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
