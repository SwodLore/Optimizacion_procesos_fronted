import { useState } from 'react';
import { useVentas } from '../context/VentasContext';
import type { Venta } from '../types';

const RegistroVentas = () => {
  const { ventas, agregarVenta, estadisticas } = useVentas();

  const [formData, setFormData] = useState<Omit<Venta, 'id'>>({
    fecha: new Date().toISOString().split('T')[0],
    producto: '',
    unidades: 0,
    observaciones: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.producto || formData.unidades <= 0) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      agregarVenta({
        ...formData,
        unidades: Number(formData.unidades)
      });

      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        producto: '',
        unidades: 0,
        observaciones: ''
      });

      alert('Venta registrada exitosamente');
    } catch (error) {
      console.error('Error al guardar la venta:', error);
      alert('Error al guardar la venta. Intenta de nuevo.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'unidades' ? Number(value) || 0 : value
    }));
  };

  return (
    <div className="space-y-10 p-4 text-gray-800">
      {/* Resumen de ventas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Ventas', value: estadisticas.totalVentas, subtitle: 'Registros totales' },
          { label: 'Total Unidades', value: estadisticas.totalUnidades, subtitle: 'Unidades vendidas' },
          { label: 'Productos Únicos', value: estadisticas.productosUnicos, subtitle: 'Diferentes productos' },
          { label: 'Promedio por Venta', value: estadisticas.promedioPorVenta.toFixed(2), subtitle: 'Unidades por venta' },
        ].map(({ label, value, subtitle }) => (
          <div key={label} className="bg-white rounded-2xl shadow p-5 hover:shadow-md transition">
            <h3 className="text-sm text-gray-500 font-medium">{label}</h3>
            <p className="text-2xl font-semibold mt-1">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          </div>
        ))}
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-6">Registrar Nueva Venta</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Producto</label>
            <input
              type="text"
              name="producto"
              value={formData.producto}
              onChange={handleChange}
              placeholder="Nombre del producto"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Unidades</label>
            <input
              type="number"
              name="unidades"
              value={formData.unidades}
              onChange={handleChange}
              min="1"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Observaciones</label>
            <input
              type="text"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              placeholder="Opcional"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-gray-800 text-white rounded-md px-4 py-2 font-medium hover:bg-gray-700 transition duration-200"
            >
              Registrar Venta
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de ventas */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Historial de Ventas</h2>
        <div className="overflow-x-auto">
          <table className="table w-full text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left font-medium">ID</th>
                <th className="px-4 py-2 text-left font-medium">Fecha</th>
                <th className="px-4 py-2 text-left font-medium">Producto</th>
                <th className="px-4 py-2 text-left font-medium">Unidades</th>
                <th className="px-4 py-2 text-left font-medium">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id} className="border-t">
                  <td className="px-4 py-2">{venta.id}</td>
                  <td className="px-4 py-2">{new Date(venta.fecha).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{venta.producto}</td>
                  <td className="px-4 py-2">{venta.unidades}</td>
                  <td className="px-4 py-2">{venta.observaciones || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegistroVentas;
