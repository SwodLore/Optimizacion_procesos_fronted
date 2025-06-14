export interface Venta {
  id: number;
  fecha: string;
  producto: string;
  unidades: number;
  observaciones?: string;
}

export interface Encuesta {
  id: number;
  fecha: string;
  producto: string;
  calificacion: number;
  comentario?: string;
}

export interface Meta {
  id: number;
  fecha: string;
  metaDiaria: number;
  metaMensual: number;
}

export interface Configuracion {
  metaDiaria: number;
  metaMensual: number;
  metaAnual: number;
} 