import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Venta } from '../types';
import { STORAGE_KEYS } from '../utils/persistencia';

interface VentasContextType {
  ventas: Venta[];
  agregarVenta: (venta: Omit<Venta, 'id'>) => void;
  eliminarVenta: (id: number) => void;
  actualizarVenta: (id: number, venta: Partial<Venta>) => void;
  estadisticas: {
    totalVentas: number;
    totalUnidades: number;
    productosUnicos: number;
    promedioPorVenta: number;
  };
}

const VentasContext = createContext<VentasContextType | undefined>(undefined);

export const useVentas = () => {
  const context = useContext(VentasContext);
  if (!context) {
    throw new Error('useVentas debe ser usado dentro de un VentasProvider');
  }
  return context;
};

export const VentasProvider = ({ children }: { children: ReactNode }) => {
  const [ventas, setVentas] = useState<Venta[]>(() => {
    // Inicializar desde localStorage
    const ventasGuardadas = localStorage.getItem(STORAGE_KEYS.VENTAS);
    return ventasGuardadas ? JSON.parse(ventasGuardadas) : [];
  });

  // Guardar en localStorage cuando cambien las ventas
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VENTAS, JSON.stringify(ventas));
  }, [ventas]);

  const agregarVenta = (venta: Omit<Venta, 'id'>) => {
    const nuevaVenta: Venta = {
      ...venta,
      id: ventas.length > 0 ? Math.max(...ventas.map(v => v.id)) + 1 : 1,
      unidades: Number(venta.unidades)
    };

    setVentas(prevVentas => {
      const nuevasVentas = [...prevVentas, nuevaVenta];
      // Guardar inmediatamente en localStorage
      localStorage.setItem(STORAGE_KEYS.VENTAS, JSON.stringify(nuevasVentas));
      return nuevasVentas;
    });
  };

  const eliminarVenta = (id: number) => {
    setVentas(prevVentas => {
      const nuevasVentas = prevVentas.filter(venta => venta.id !== id);
      // Guardar inmediatamente en localStorage
      localStorage.setItem(STORAGE_KEYS.VENTAS, JSON.stringify(nuevasVentas));
      return nuevasVentas;
    });
  };

  const actualizarVenta = (id: number, ventaActualizada: Partial<Venta>) => {
    setVentas(prevVentas => {
      const nuevasVentas = prevVentas.map(venta =>
        venta.id === id ? { ...venta, ...ventaActualizada } : venta
      );
      // Guardar inmediatamente en localStorage
      localStorage.setItem(STORAGE_KEYS.VENTAS, JSON.stringify(nuevasVentas));
      return nuevasVentas;
    });
  };

  const estadisticas = {
    totalVentas: ventas.length,
    totalUnidades: ventas.reduce((sum, venta) => sum + venta.unidades, 0),
    productosUnicos: new Set(ventas.map(venta => venta.producto)).size,
    promedioPorVenta: ventas.length > 0
      ? ventas.reduce((sum, venta) => sum + venta.unidades, 0) / ventas.length
      : 0
  };

  return (
    <VentasContext.Provider
      value={{
        ventas,
        agregarVenta,
        eliminarVenta,
        actualizarVenta,
        estadisticas
      }}
    >
      {children}
    </VentasContext.Provider>
  );
}; 