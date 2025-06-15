import api from '../api/axios';
import type { Encuesta } from '../types';

// Obtener todas las encuestas
export const obtenerEncuestas = async () => {
  const response = await api.get('/encuestas');
  return response.data;
};

// Obtener una encuesta por ID
export const obtenerEncuestaPorId = async (id: number) => {
  const response = await api.get(`/encuestas/${id}`);
  return response.data;
};

// Crear una nueva encuesta
export const crearEncuesta = async (encuesta: Omit<Encuesta, 'id'>) => {
  const response = await api.post('/encuestas', encuesta);
  return response.data;
};

// Actualizar una encuesta existente
export const actualizarEncuesta = async (id: number, encuesta: Omit<Encuesta, 'id'>) => {
  const response = await api.put(`/encuestas/${id}`, encuesta);
  return response.data;
};

// Eliminar una encuesta por ID
export const eliminarEncuesta = async (id: number) => {
  const response = await api.delete(`/encuestas/${id}`);
  return response.data;
};
