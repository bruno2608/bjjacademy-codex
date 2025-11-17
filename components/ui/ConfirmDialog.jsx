'use client';

import Modal from './Modal';

export default function ConfirmDialog({
  isOpen,
  title = 'Confirmar ação',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  confirmTone = 'error',
  onConfirm,
  onCancel
}) {
  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel}>
      <div className="space-y-4">
        {message && <p className="text-sm text-bjj-gray-100">{message}</p>}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="btn btn-outline btn-sm border-bjj-gray-700 text-bjj-gray-100">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`btn btn-sm text-white ${confirmTone === 'warning' ? 'btn-warning' : 'btn-error'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
