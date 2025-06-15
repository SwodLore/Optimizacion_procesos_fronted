import { createContext, useContext, useEffect, useState } from 'react';
import { obtenerVentas } from '../services/ventasService'; // Asegúrate que la ruta es correcta
import type { Venta } from '../types';

const VentasContext = createContext<{ ventas: Venta[] }>({ ventas: [] });

export const useVentas = () => useContext(VentasContext);

export const VentasProvider = ({ children }: { children: React.ReactNode }) => {
  const [ventas, setVentas] = useState<Venta[]>([]);

  useEffect(() => {
    const cargarVentas = async () => {
      try {
        const data = await obtenerVentas();
        setVentas(data);
      } catch (error) {
        console.error('Error al obtener ventas:', error);
      }
    };

    cargarVentas();
  }, []);

  return (
    <VentasContext.Provider value={{ ventas }}>
      {children}
    </VentasContext.Provider>
  );
};
