import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-800">
              🧾 VentasApp
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
            <Link to="/ventas" className="hover:text-indigo-600 transition">Registro</Link>
            <Link to="/contador" className="hover:text-indigo-600 transition">Contador</Link>
            <Link to="/meta" className="hover:text-indigo-600 transition">Meta</Link>
            <Link to="/satisfaccion" className="hover:text-indigo-600 transition">Satisfacción</Link>
            <Link to="/indicadores" className="hover:text-indigo-600 transition">Indicadores</Link>
          </div>

          <div className="flex items-center space-x-4 md:hidden">
            <button onClick={() => setMenuAbierto(!menuAbierto)} className="p-2 rounded-md hover:bg-gray-100">
              <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuAbierto ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {menuAbierto && (
          <div className="md:hidden mt-2 bg-white shadow rounded-md px-4 py-2 space-y-2 z-50">
            <Link to="/ventas" className="block hover:text-indigo-600">Registro</Link>
            <Link to="/contador" className="block hover:text-indigo-600">Contador</Link>
            <Link to="/meta" className="block hover:text-indigo-600">Meta</Link>
            <Link to="/satisfaccion" className="block hover:text-indigo-600">Satisfacción</Link>
            <Link to="/indicadores" className="block hover:text-indigo-600">Indicadores</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
