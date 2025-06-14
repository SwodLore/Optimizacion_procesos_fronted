import { useState, useEffect } from 'react';
import {
  inicializarDatos,
  hacerBackup,
  restaurarBackup,
  limpiarDatos,
  exportarDatos,
  importarDatos,
  obtenerEstadisticasAlmacenamiento,
  STORAGE_KEYS
} from '../utils/persistencia';

const GestionDatos = () => {
  const [estadisticas, setEstadisticas] = useState(obtenerEstadisticasAlmacenamiento());
  const [archivoBackup, setArchivoBackup] = useState<File | null>(null);

  useEffect(() => {
    // Actualizar estadísticas cada minuto
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
        alert('Backup restaurado exitosamente');
        setEstadisticas(obtenerEstadisticasAlmacenamiento());
      } else {
        alert('Error al restaurar el backup');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Ventas</div>
          <div className="stat-value text-primary">{estadisticas.ventas.cantidad}</div>
          <div className="stat-desc">
            Última actualización: {estadisticas.ventas.ultimaActualizacion ? new Date(estadisticas.ventas.ultimaActualizacion).toLocaleString() : 'N/A'}
          </div>
        </div>
        
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Encuestas</div>
          <div className="stat-value text-secondary">{estadisticas.encuestas.cantidad}</div>
          <div className="stat-desc">
            Última actualización: {estadisticas.encuestas.ultimaActualizacion ? new Date(estadisticas.encuestas.ultimaActualizacion).toLocaleString() : 'N/A'}
          </div>
        </div>
        
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Metas</div>
          <div className="stat-value text-accent">{estadisticas.metas.cantidad}</div>
          <div className="stat-desc">
            Última actualización: {estadisticas.metas.ultimaActualizacion ? new Date(estadisticas.metas.ultimaActualizacion).toLocaleString() : 'N/A'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold mb-4">Backup y Restauración</h2>
            <div className="space-y-4">
              <button
                onClick={hacerBackup}
                className="btn btn-primary w-full"
              >
                Crear Backup
              </button>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Restaurar desde Backup</span>
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full"
                />
                <button
                  onClick={handleRestaurarBackup}
                  disabled={!archivoBackup}
                  className="btn btn-secondary w-full mt-2"
                >
                  Restaurar Backup
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold mb-4">Gestión de Datos</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => exportarDatos('VENTAS')}
                  className="btn btn-outline"
                >
                  Exportar Ventas
                </button>
                <button
                  onClick={() => exportarDatos('ENCUESTAS')}
                  className="btn btn-outline"
                >
                  Exportar Encuestas
                </button>
                <button
                  onClick={() => exportarDatos('METAS')}
                  className="btn btn-outline"
                >
                  Exportar Metas
                </button>
                <button
                  onClick={() => exportarDatos('CONFIGURACION')}
                  className="btn btn-outline"
                >
                  Exportar Configuración
                </button>
              </div>

              <div className="divider">Opciones de Limpieza</div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    if (confirm('¿Estás seguro de que deseas limpiar los datos de ventas?')) {
                      limpiarDatos('VENTAS');
                      setEstadisticas(obtenerEstadisticasAlmacenamiento());
                    }
                  }}
                  className="btn btn-error btn-outline"
                >
                  Limpiar Ventas
                </button>
                <button
                  onClick={() => {
                    if (confirm('¿Estás seguro de que deseas limpiar los datos de encuestas?')) {
                      limpiarDatos('ENCUESTAS');
                      setEstadisticas(obtenerEstadisticasAlmacenamiento());
                    }
                  }}
                  className="btn btn-error btn-outline"
                >
                  Limpiar Encuestas
                </button>
              </div>

              <button
                onClick={() => {
                  if (confirm('¿Estás seguro de que deseas inicializar los datos con valores de ejemplo?')) {
                    inicializarDatos();
                    setEstadisticas(obtenerEstadisticasAlmacenamiento());
                  }
                }}
                className="btn btn-warning w-full"
              >
                Inicializar con Datos de Ejemplo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionDatos; 