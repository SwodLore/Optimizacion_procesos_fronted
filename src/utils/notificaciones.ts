// src/utils/notificaciones.ts
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'react-toastify';

const MySwal = withReactContent(Swal);

export const mostrarToast = (mensaje: string, tipo: 'success' | 'error' | 'info' = 'success') => {
  toast[mensaje.includes('error') || tipo === 'error' ? 'error' : tipo](mensaje, {
    position: 'top-right',
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: 'light',
  });
};

export const confirmarAccion = async (titulo = '¿Estás seguro?', texto = 'Esta acción no se puede deshacer.') => {
  const result = await MySwal.fire({
    title: titulo,
    text: texto,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#1f2937', // gris oscuro (Tailwind gray-900)
    cancelButtonColor: '#d33',
  });

  return result.isConfirmed;
};
