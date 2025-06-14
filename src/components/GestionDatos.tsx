import { useState, useEffect } from 'react';
import {
  inicializarDatos,
  hacerBackup,
  restaurarBackup,
  limpiarDatos,
  exportarDatos,
  obtenerEstadisticasAlmacenamiento,
  STORAGE_KEYS
} from '../utils/persistencia';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GestionDatos = () => {
  const [estadisticas, setEstadisticas] = useState(obtenerEstadisticasAlmacenamiento());
  const [archivoBackup, setArchivoBackup] = useState<File | null>(null);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setEstadisticas(obtenerEstadisticasAlmacenamiento());
    }, 60000);

    return () => clearInterval(intervalo);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setArchivoBackup(file);
    }
  };

  const handleRestaurarBackup = async () => {
    if (archivoBackup) {
      const texto = await archivoBackup.text();
      if (restaurarBackup(texto)) {
        toast.success('Backup restaurado exitosamente');
        setEstadisticas(obtenerEstadisticasAlmacenamiento());
      } else {
        toast.error('Error al restaurar el backup');
      }
    }
  };

  const confirmarYLimpiar = (tipo: keyof typeof STORAGE_KEYS, nombre: string) => {
    if (confirm(`¿Estás seguro de que deseas limpiar los datos de ${nombre}?`)) {
      limpiarDatos(tipo);
      setEstadisticas(obtenerEstadisticasAlmacenamiento());
      toast.info(`Datos de ${nombre} eliminados`);
    }
  };

  const confirmarInicializar = () => {
    if (confirm('¿Estás seguro de que deseas inicializar los datos con valores de ejemplo?')) {
      inicializarDatos();
      setEstadisticas(obtenerEstadisticasAlmacenamiento());
      toast.success('Datos inicializados con valores de ejemplo');
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['ventas', 'encuestas', 'metas'].map((tipo) => (
          <div key={tipo} className="bg-white rounded-2xl shadow p-6 border-t-4 border-blue-500">
            <h3 className="text-lg font-semibold capitalize text-gray-700">{tipo}</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {estadisticas[tipo as keyof typeof estadisticas].cantidad}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Última actualización:{' '}
              {estadisticas[tipo as keyof typeof estadisticas].ultimaActualizacion
                ? new Date(estadisticas[tipo as keyof typeof estadisticas].ultimaActualizacion!).toLocaleString()
                : 'N/A'}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup y Restauración */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Backup y Restauración</h2>

          <button
            onClick={hacerBackup}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium shadow transition"
          >
            📦 Crear Backup
          </button>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar archivo .json</label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-purple-50 file:text-purple-700
                hover:file:bg-purple-100 transition"
            />
            <button
              onClick={handleRestaurarBackup}
              disabled={!archivoBackup}
              className={`w-full mt-3 flex items-center justify-center gap-2 ${
                archivoBackup
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-purple-300 text-white cursor-not-allowed'
              } py-2 px-4 rounded-lg font-medium shadow transition`}
            >
              ♻️ Restaurar Backup
            </button>
          </div>
        </div>

        {/* Gestión de Datos */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Gestión de Datos</h2>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => exportarDatos('VENTAS')} className="bg-indigo-100 text-indigo-700 font-medium py-2 px-4 rounded-lg hover:bg-indigo-200 transition">
              📤 Exportar Ventas
            </button>
            <button onClick={() => exportarDatos('ENCUESTAS')} className="bg-indigo-100 text-indigo-700 font-medium py-2 px-4 rounded-lg hover:bg-indigo-200 transition">
              📤 Exportar Encuestas
            </button>
            <button onClick={() => exportarDatos('METAS')} className="bg-indigo-100 text-indigo-700 font-medium py-2 px-4 rounded-lg hover:bg-indigo-200 transition">
              📤 Exportar Metas
            </button>
            <button onClick={() => exportarDatos('CONFIGURACION')} className="bg-indigo-100 text-indigo-700 font-medium py-2 px-4 rounded-lg hover:bg-indigo-200 transition">
              ⚙️ Exportar Configuración
            </button>
          </div>

          <div className="border-t pt-4 space-y-4">
            <h3 className="text-md font-semibold text-gray-700">🧹 Opciones de Limpieza</h3>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => confirmarYLimpiar('VENTAS', 'ventas')} className="bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg hover:bg-red-200 transition">
                🗑 Limpiar Ventas
              </button>
              <button onClick={() => confirmarYLimpiar('ENCUESTAS', 'encuestas')} className="bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg hover:bg-red-200 transition">
                🗑 Limpiar Encuestas
              </button>
            </div>

            <button
              onClick={confirmarInicializar}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-semibold shadow transition"
            >
              🔄 Inicializar con Datos de Ejemplo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionDatos;
