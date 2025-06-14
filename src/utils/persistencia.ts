import type { Venta, Encuesta, Meta, Configuracion } from '../types';

export const STORAGE_KEYS = {
  VENTAS: 'ventas',
  ENCUESTAS: 'encuestas',
  METAS: 'metas',
  CONFIGURACION: 'configuracion'
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;

export interface EstadisticasAlmacenamiento {
  ventas: {
    cantidad: number;
    ultimaActualizacion: number | null;
  };
  encuestas: {
    cantidad: number;
    ultimaActualizacion: number | null;
  };
  metas: {
    cantidad: number;
    ultimaActualizacion: number | null;
  };
}

// Datos iniciales
const datosIniciales = {
  ventas: [] as Venta[],
  encuestas: [] as Encuesta[],
  metas: [] as Meta[],
  configuracion: {
    metaDiaria: 100,
    metaMensual: 3000,
    metaAnual: 36000
  } as Configuracion
};

// Inicializar datos si no existen
export const inicializarDatos = () => {
  Object.entries(STORAGE_KEYS).forEach(([key, value]) => {
    if (!localStorage.getItem(value)) {
      localStorage.setItem(value, JSON.stringify(datosIniciales[key.toLowerCase() as keyof typeof datosIniciales]));
    }
  });
};

// Hacer backup de todos los datos
export const hacerBackup = () => {
  const backup = {
    ventas: JSON.parse(localStorage.getItem(STORAGE_KEYS.VENTAS) || '[]'),
    encuestas: JSON.parse(localStorage.getItem(STORAGE_KEYS.ENCUESTAS) || '[]'),
    metas: JSON.parse(localStorage.getItem(STORAGE_KEYS.METAS) || '[]'),
    configuracion: JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIGURACION) || '{}')
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Restaurar backup
export const restaurarBackup = (texto: string): boolean => {
  try {
    const backup = JSON.parse(texto);
    Object.entries(STORAGE_KEYS).forEach(([key, value]) => {
      if (backup[key.toLowerCase()]) {
        localStorage.setItem(value, JSON.stringify(backup[key.toLowerCase()]));
      }
    });
    return true;
  } catch (error) {
    console.error('Error al restaurar backup:', error);
    return false;
  }
};

// Limpiar datos específicos
export const limpiarDatos = (tipo: StorageKey) => {
  localStorage.removeItem(STORAGE_KEYS[tipo]);
};

// Exportar datos específicos
export const exportarDatos = (tipo: StorageKey) => {
  const datos = localStorage.getItem(STORAGE_KEYS[tipo]);
  if (datos) {
    const blob = new Blob([datos], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tipo.toLowerCase()}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

// Importar datos específicos
export const importarDatos = (tipo: StorageKey, texto: string): boolean => {
  try {
    const datos = JSON.parse(texto);
    localStorage.setItem(STORAGE_KEYS[tipo], JSON.stringify(datos));
    return true;
  } catch (error) {
    console.error('Error al importar datos:', error);
    return false;
  }
};

// Obtener estadísticas de almacenamiento
export const obtenerEstadisticasAlmacenamiento = (): EstadisticasAlmacenamiento => {
  const ventas = JSON.parse(localStorage.getItem(STORAGE_KEYS.VENTAS) || '[]');
  const encuestas = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENCUESTAS) || '[]');
  const metas = JSON.parse(localStorage.getItem(STORAGE_KEYS.METAS) || '[]');

  return {
    ventas: {
      cantidad: ventas.length,
      ultimaActualizacion: ventas.length > 0 ? new Date(ventas[ventas.length - 1].fecha).getTime() : null
    },
    encuestas: {
      cantidad: encuestas.length,
      ultimaActualizacion: encuestas.length > 0 ? new Date(encuestas[encuestas.length - 1].fecha).getTime() : null
    },
    metas: {
      cantidad: metas.length,
      ultimaActualizacion: metas.length > 0 ? new Date(metas[metas.length - 1].fecha).getTime() : null
    }
  };
}; 