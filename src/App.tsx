import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import RegistroVentas from './pages/RegistroVentas';
import ContadorVentas from './pages/ContadorVentas';
import CumplimientoMeta from './pages/CumplimientoMeta';
import SatisfaccionCliente from './pages/SatisfaccionCliente';
import IndicadoresGestion from './pages/IndicadoresGestion';
import { VentasProvider } from './context/VentasContext';
import './index.css';

function App() {
  return (
    <VentasProvider>
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<RegistroVentas />} />
            <Route path="/ventas" element={<RegistroVentas />} />
            <Route path="/contador" element={<ContadorVentas />} />
            <Route path="/meta" element={<CumplimientoMeta />} />
            <Route path="/satisfaccion" element={<SatisfaccionCliente />} />
            <Route path="/indicadores" element={<IndicadoresGestion />} />
          </Routes>
        </main>
      </div>
    </VentasProvider>
  );
}

export default App;
