// Claves para el localStorage
import type { Venta, Meta } from '../types';

const ENCUESTAS_KEY = 'encuestas';

export const STORAGE_KEYS = {
  VENTAS: 'ventas',
  ENCUESTAS: 'encuestas',
  METAS: 'metas',
  CONFIGURACION: 'configuracion'
} as const;


export interface Configuracion {
  tema: 'claro' | 'oscuro';
  notificaciones: boolean;
  moneda: string;
}

// Funciones de utilidad para el localStorage
export const getItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error al obtener ${key} del localStorage:`, error);
    return null;
  }
};

export const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error al guardar ${key} en el localStorage:`, error);
  }
};

export const removeItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error al eliminar ${key} del localStorage:`, error);
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error al limpiar el localStorage:', error);
  }
};

// Funciones específicas para cada tipo de dato
export const getVentas = (): Venta[] => {
  return getItem<Venta[]>(STORAGE_KEYS.VENTAS) || [];
};

export const setVentas = (ventas: Venta[]): void => {
  setItem(STORAGE_KEYS.VENTAS, ventas);
};

export const getEncuestas = () => {
  const data = localStorage.getItem(ENCUESTAS_KEY);
  return data ? JSON.parse(data) : [];
};

export const setEncuestas = (encuestas: any[]) => {
  localStorage.setItem(ENCUESTAS_KEY, JSON.stringify(encuestas));
};

export const getMetas = (): Meta[] => {
  return getItem<Meta[]>(STORAGE_KEYS.METAS) || [];
};

export const setMetas = (metas: Meta[]): void => {
  setItem(STORAGE_KEYS.METAS, metas);
};

export const getConfiguracion = (): Configuracion => {
  return getItem<Configuracion>(STORAGE_KEYS.CONFIGURACION) || {
    tema: 'claro',
    notificaciones: true,
    moneda: 'USD'
  };
};

export const setConfiguracion = (configuracion: Configuracion): void => {
  setItem(STORAGE_KEYS.CONFIGURACION, configuracion);
}; 