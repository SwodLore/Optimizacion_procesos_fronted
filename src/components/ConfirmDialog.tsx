import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps) => {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="relative bg-white rounded-xl shadow-xl max-w-sm mx-auto p-6 z-50">
        <div className="flex items-center gap-3 mb-4">
          <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
          <Dialog.Title className="text-lg font-bold text-gray-800">{title}</Dialog.Title>
        </div>
        <Dialog.Description className="text-gray-600 mb-6">
          {message}
        </Dialog.Description>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Confirmar
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
