import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { VentasProvider } from './context/VentasContext';
import MainLayout from './components/layout/MainLayout';
import './index.css';

// Carga diferida de páginas
const RegistroVentas = lazy(() => import('./pages/RegistroVentas'));
const ContadorVentas = lazy(() => import('./pages/ContadorVentas'));
const CumplimientoMeta = lazy(() => import('./pages/CumplimientoMeta'));
const SatisfaccionCliente = lazy(() => import('./pages/SatisfaccionCliente'));
const IndicadoresGestion = lazy(() => import('./pages/IndicadoresGestion'));
const GestionDatos = lazy(() => import('./pages/GestionDatos'));
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <VentasProvider>
      <MainLayout>
        <Suspense fallback={<div className="p-4">Cargando...</div>}>
          <Routes>
            <Route path="/" element={<RegistroVentas />} />
            <Route path="/ventas" element={<RegistroVentas />} />
            <Route path="/contador" element={<ContadorVentas />} />
            <Route path="/meta" element={<CumplimientoMeta />} />
            <Route path="/satisfaccion" element={<SatisfaccionCliente />} />
            <Route path="/indicadores" element={<IndicadoresGestion />} />
            <Route path="/gestion-datos" element={<GestionDatos />} />
            <Route path="*" element={<div className="p-4">Página no encontrada</div>} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </Suspense>
      </MainLayout>
    </VentasProvider>
  );
}

export default App;
