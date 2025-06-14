import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getMetas, setMetas, type Meta } from '../utils/localStorage';

interface MetasContextType {
  metas: Meta[];
  agregarMeta: (meta: Omit<Meta, 'id'>) => void;
  eliminarMeta: (id: number) => void;
  actualizarMeta: (id: number, meta: Partial<Meta>) => void;
  estadisticas: {
    metaDiariaActual: number;
    metaMensualActual: number;
    cumplimientoDiario: number;
    cumplimientoMensual: number;
  };
}

const MetasContext = createContext<MetasContextType | undefined>(undefined);

export const useMetas = () => {
  const context = useContext(MetasContext);
  if (!context) {
    throw new Error('useMetas debe ser usado dentro de un MetasProvider');
  }
  return context;
};

export const MetasProvider = ({ children }: { children: ReactNode }) => {
  const [metas, setMetasState] = useState<Meta[]>([]);

  // Cargar metas del localStorage al iniciar
  useEffect(() => {
    const metasGuardadas = getMetas();
    setMetasState(metasGuardadas);
  }, []);

  // Guardar metas en localStorage cuando cambien
  useEffect(() => {
    setMetas(metas);
  }, [metas]);

  const agregarMeta = (meta: Omit<Meta, 'id'>) => {
    const nuevaMeta: Meta = {
      ...meta,
      id: Date.now(),
    };
    setMetasState([...metas, nuevaMeta]);
  };

  const eliminarMeta = (id: number) => {
    setMetasState(metas.filter(meta => meta.id !== id));
  };

  const actualizarMeta = (id: number, metaActualizada: Partial<Meta>) => {
    setMetasState(
      metas.map(meta =>
        meta.id === id ? { ...meta, ...metaActualizada } : meta
      )
    );
  };

  // Obtener la meta más reciente
  const metaActual = metas.length > 0
    ? metas.reduce((latest, current) => 
        new Date(current.fecha) > new Date(latest.fecha) ? current : latest
      )
    : { metaDiaria: 100, metaMensual: 3000 };

  const estadisticas = {
    metaDiariaActual: metaActual.metaDiaria,
    metaMensualActual: metaActual.metaMensual,
    cumplimientoDiario: 0, 
    cumplimientoMensual: 0, 
  };

  return (
    <MetasContext.Provider
      value={{
        metas,
        agregarMeta,
        eliminarMeta,
        actualizarMeta,
        estadisticas,
      }}
    >
      {children}
    </MetasContext.Provider>
  );
}; 