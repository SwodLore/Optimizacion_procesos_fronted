import { useEffect, useState } from 'react';
import type { Venta } from '../types';
import { mostrarToast, confirmarAccion } from '../utils/notificaciones';
import {
  obtenerVentas,
  crearVenta,
  actualizarVenta,
  eliminarVenta
} from '../services/ventasService';


const RegistroVentas = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    totalUnidades: 0,
    productosUnicos: 0,
    promedioPorVenta: 0
  });
  
  const initialState: Omit<Venta, 'id'> = {
    fecha: new Date().toISOString().split('T')[0],
    producto: '',
    unidades: 0,
    observaciones: ''
  };

  const [formData, setFormData] = useState<Omit<Venta, 'id'>>(initialState);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const cargarVentas = async () => {
      try {
        const datos = await obtenerVentas();
        setVentas(datos);
        calcularEstadisticas(datos);
      } catch (error) {
        console.error('Error cargando ventas:', error);
        mostrarToast('Error al cargar las ventas.', 'error');
      }
    };
    cargarVentas();
  }, []);

  const calcularEstadisticas = (ventas: Venta[]) => {
    const totalVentas = ventas.length;
    const totalUnidades = ventas.reduce((sum, v) => sum + v.unidades, 0);
    const productosUnicos = new Set(ventas.map(v => v.producto)).size;
    const promedioPorVenta = totalVentas ? totalUnidades / totalVentas : 0;

    setEstadisticas({ totalVentas, totalUnidades, productosUnicos, promedioPorVenta });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.producto || formData.unidades <= 0) {
      mostrarToast('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    try {
      if (editingId !== null) {
        const ventaActualizada = await actualizarVenta(editingId, formData);
        setVentas(prev => prev.map(v => v.id === editingId ? ventaActualizada : v));
        mostrarToast('Venta actualizada exitosamente');
      } else {
        const nuevaVenta = await crearVenta(formData);
        setVentas(prev => [...prev, nuevaVenta]);
        mostrarToast('Venta registrada exitosamente');
      }

      setFormData(initialState);
      setEditingId(null);
      calcularEstadisticas([...ventas, formData as Venta]);

    } catch (error) {
      console.error('Error al guardar venta:', error);
      mostrarToast('Error al guardar la venta.', 'error');
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'unidades' ? Number(value) || 0 : value
    }));
  };
  
  // Manejador para iniciar la edición
  const handleEdit = (venta: Venta) => {
    setEditingId(venta.id);
    const fechaFormateada = venta.fecha.includes('T') ? venta.fecha.split('T')[0] : venta.fecha;
    setFormData({ ...venta, fecha: fechaFormateada });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manejador para cancelar la edición
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialState);
  };
  
  // Manejador para eliminar
  const handleDelete = async (id: number) => {
    const confirmar = await confirmarAccion('¿Eliminar esta venta?', 'No podrás recuperarla');
    if (!confirmar) return;

    try {
      await eliminarVenta(id);
      const nuevasVentas = ventas.filter(v => v.id !== id);
      setVentas(nuevasVentas);
      calcularEstadisticas(nuevasVentas);
      mostrarToast('Venta eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar venta:', error);
      mostrarToast('Error al eliminar la venta.', 'error');
    }
  };

  return (
    <div className="space-y-12 px-6 py-8 text-gray-800 max-w-7xl mx-auto">
      {/* Resumen de ventas (sin cambios) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Ventas', value: estadisticas.totalVentas, subtitle: 'Registros totales' },
          { label: 'Total Unidades', value: estadisticas.totalUnidades, subtitle: 'Unidades vendidas' },
          { label: 'Productos Únicos', value: estadisticas.productosUnicos, subtitle: 'Diferentes productos' },
          { label: 'Promedio por Venta', value: estadisticas.promedioPorVenta.toFixed(2), subtitle: 'Unidades por venta' },
        ].map(({ label, value, subtitle }) => (
          <div key={label} className="bg-gradient-to-br from-gray-100 to-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <h3 className="text-sm text-gray-500 font-medium">{label}</h3>
            <p className="text-3xl font-bold mt-1 text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          </div>
        ))}
      </section>

      {/* Formulario (con lógica de edición) */}
      <section className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {editingId ? 'Editar Venta' : 'Registrar Nueva Venta'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Fecha', name: 'fecha', type: 'date', value: formData.fecha },
            { label: 'Producto', name: 'producto', type: 'text', value: formData.producto, placeholder: 'Nombre del producto' },
            { label: 'Unidades', name: 'unidades', type: 'number', value: formData.unidades },
            { label: 'Observaciones', name: 'observaciones', type: 'text', value: formData.observaciones, placeholder: 'Opcional' },
          ].map(({ label, name, type, value, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={String(value)} // Aseguramos que value sea string para el input
                onChange={handleChange}
                placeholder={placeholder}
                min={name === 'unidades' ? 1 : undefined}
                required={name !== 'observaciones'}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>
          ))}

          <div className="md:col-span-2 flex items-center gap-4">
            <button
              type="submit"
              className="flex-grow bg-gray-900 text-white rounded-lg px-6 py-3 font-semibold hover:bg-gray-700 transition duration-200"
            >
              {editingId ? 'Actualizar Venta' : 'Registrar Venta'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-200 text-gray-800 rounded-lg px-6 py-3 font-semibold hover:bg-gray-300 transition duration-200"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Tabla de ventas (con botones de acción) */}
      <section className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Historial de Ventas</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-left">
              <tr>
                {['ID', 'Fecha', 'Producto', 'Unidades', 'Observaciones', 'Acciones'].map((col) => (
                  <th key={col} className="px-5 py-3 font-semibold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id} className="border-t hover:bg-gray-50">
                  <td className="px-5 py-3">{venta.id}</td>
                  <td className="px-5 py-3">{new Date(venta.fecha).toLocaleDateString()}</td>
                  <td className="px-5 py-3">{venta.producto}</td>
                  <td className="px-5 py-3">{venta.unidades}</td>
                  <td className="px-5 py-3">{venta.observaciones || '-'}</td>
                  
                  <td className="px-5 py-3">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleEdit(venta)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                        aria-label={`Editar venta ${venta.id}`}
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(venta.id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                        aria-label={`Eliminar venta ${venta.id}`}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default RegistroVentas;