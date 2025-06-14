import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getEncuestas, setEncuestas, type Encuesta } from '../utils/localStorage';

interface EncuestasContextType {
  encuestas: Encuesta[];
  agregarEncuesta: (encuesta: Omit<Encuesta, 'id'>) => void;
  eliminarEncuesta: (id: number) => void;
  actualizarEncuesta: (id: number, encuesta: Partial<Encuesta>) => void;
  estadisticas: {
    totalEncuestas: number;
    promedioCalificacion: number;
    nivelSatisfaccion: 'Alta' | 'Media' | 'Baja';
    distribucionCalificaciones: { [key: number]: number };
  };
}

const EncuestasContext = createContext<EncuestasContextType | undefined>(undefined);

export const useEncuestas = () => {
  const context = useContext(EncuestasContext);
  if (!context) {
    throw new Error('useEncuestas debe ser usado dentro de un EncuestasProvider');
  }
  return context;
};

export const EncuestasProvider = ({ children }: { children: ReactNode }) => {
  const [encuestas, setEncuestasState] = useState<Encuesta[]>([]);

  // Cargar encuestas del localStorage al iniciar
  useEffect(() => {
    const encuestasGuardadas = getEncuestas();
    setEncuestasState(encuestasGuardadas);
  }, []);

  // Guardar encuestas en localStorage cuando cambien
  useEffect(() => {
    setEncuestas(encuestas);
  }, [encuestas]);

  const agregarEncuesta = (encuesta: Omit<Encuesta, 'id'>) => {
    const nuevaEncuesta: Encuesta = {
      ...encuesta,
      id: Date.now(),
    };
    setEncuestasState([...encuestas, nuevaEncuesta]);
  };

  const eliminarEncuesta = (id: number) => {
    setEncuestasState(encuestas.filter(encuesta => encuesta.id !== id));
  };

  const actualizarEncuesta = (id: number, encuestaActualizada: Partial<Encuesta>) => {
    setEncuestasState(
      encuestas.map(encuesta =>
        encuesta.id === id ? { ...encuesta, ...encuestaActualizada } : encuesta
      )
    );
  };

  const estadisticas = {
    totalEncuestas: encuestas.length,
    promedioCalificacion: encuestas.length
      ? encuestas.reduce((acc, curr) => acc + curr.calificacion, 0) / encuestas.length
      : 0,
    nivelSatisfaccion: (() => {
      const promedio = encuestas.length
        ? encuestas.reduce((acc, curr) => acc + curr.calificacion, 0) / encuestas.length
        : 0;
      if (promedio >= 4) return 'Alta' as const;
      if (promedio >= 3) return 'Media' as const;
      return 'Baja' as const;
    })(),
    distribucionCalificaciones: encuestas.reduce((acc, curr) => {
      acc[curr.calificacion] = (acc[curr.calificacion] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number }),
  };

  return (
    <EncuestasContext.Provider
      value={{
        encuestas,
        agregarEncuesta,
        eliminarEncuesta,
        actualizarEncuesta,
        estadisticas,
      }}
    >
      {children}
    </EncuestasContext.Provider>
  );
}; 