'use client';

/**
 * Modal genérico utilizado para fluxos de criação e edição inline.
 * Renderiza um overlay com foco no conteúdo e fecha ao clicar fora ou no botão de fechar.
 */
import { X } from 'lucide-react';

export default function Modal({ isOpen, title, onClose, children }) {
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
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-bjj-black/80 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl bg-bjj-gray-900 border border-bjj-gray-800 rounded-2xl shadow-focus">
        <header className="flex items-center justify-between px-6 py-4 border-b border-bjj-gray-800">
          <h2 id="modal-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-bjj-gray-200 hover:bg-bjj-gray-800 transition"
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </header>
        <div className="px-6 py-6 overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
}
