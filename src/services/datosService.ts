import axios from 'axios';

const API_URL = '/api';

export const obtenerEstadisticas = async () => {
  const response = await axios.get(`${API_URL}/estadisticas`);
  return response.data;
};

export const crearBackup = async () => {
  const response = await axios.post(`${API_URL}/backup`, null, {
    responseType: 'json',
  });
  return response.data;
};

export const restaurarBackup = async (contenido: any) => {
  try {
    const response = await axios.post(`${API_URL}/restore`, contenido);
    return response.data;
  } catch (error) {
    throw new Error('Error al restaurar backup');
  }
};

export const limpiarDatos = async (tipo: 'ventas' | 'encuestas' | 'metas' | 'configuracion') => {
  const response = await axios.delete(`${API_URL}/${tipo}`);
  return response.data;
};

export const inicializarDatos = async () => {
  const response = await axios.post(`${API_URL}/inicializar`);
  return response.data;
};

export const exportarDatosJSON = async (tipo: 'ventas' | 'encuestas' | 'metas' | 'configuracion') => {
  const response = await axios.get(`${API_URL}/exportar/${tipo}`);
  return response.data;
};

export const exportarDatosExcel = async (tipo: 'ventas' | 'encuestas' | 'metas' | 'configuracion') => {
  const response = await axios.get(`${API_URL}/exportar-excel/${tipo}`, {
    responseType: 'blob',
  });
  return response.data;
};
