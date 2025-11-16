'use client';

/**
 * Modal genérico utilizado para fluxos de criação e edição inline.
 * Em telas menores ele assume o formato de bottom sheet para facilitar
 * o uso no mobile e manter a coerência com o app nativo.
 */
import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, title, onClose, children }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="modal z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleBackdropClick}
    >
      <div className="modal-box w-full max-w-2xl border border-bjj-gray-800/70 bg-bjj-gray-900 text-bjj-white shadow-[0_18px_35px_-18px_rgba(0,0,0,0.6)]">
        <header className="mb-4 flex items-center justify-between border-b border-bjj-gray-800 pb-3">
          <h2 id="modal-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm text-bjj-gray-200"
            aria-label="Fechar modal"
          >
            <X size={16} />
          </button>
        </header>
        <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1 lg:max-h-[75vh]">{children}</div>
      </div>
    </div>
  );
}
