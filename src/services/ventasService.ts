import api from '../api/axios';
import type { Venta } from '../types';

export const obtenerVentas = async (): Promise<Venta[]> => {
  const response = await api.get('/ventas');
  return response.data;
};

export const crearVenta = async (venta: Omit<Venta, 'id'>): Promise<Venta> => {
  const response = await api.post('/ventas', venta);
  return response.data;
};

export const actualizarVenta = async (
  id: number,
  venta: Omit<Venta, 'id'>
): Promise<Venta> => {
  const response = await api.put(`/ventas/${id}`, venta);
  return response.data;
};

export const eliminarVenta = async (id: number): Promise<void> => {
  await api.delete(`/ventas/${id}`);
};
