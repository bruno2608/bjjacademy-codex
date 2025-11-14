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
      className="fixed inset-0 z-50 flex items-end justify-center bg-bjj-black/80 px-4 pb-6 pt-10 backdrop-blur-sm lg:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-t-3xl border border-bjj-gray-800/80 bg-bjj-gray-900 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] transition-transform lg:max-w-2xl lg:rounded-3xl">
        <header className="flex items-center justify-between border-b border-bjj-gray-800 px-6 py-4">
          <h2 id="modal-title" className="text-lg font-semibold text-bjj-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-bjj-gray-200 transition hover:bg-bjj-gray-800"
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </header>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-6 lg:max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
}
