'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Botão estilo "tag" utilizado nos filtros do projeto.
 * Mantém a aparência padronizada com borda arredondada e estados ativos.
 */
export interface ToggleTagProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  leftIcon?: ReactNode;
}

const ToggleTag = ({ active = false, className = '', leftIcon, children, ...props }: ToggleTagProps) => {
  const baseClasses =
    'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition';
  const stateClasses = active
    ? 'border-bjj-red bg-bjj-red text-bjj-white shadow-[0_8px_24px_-12px_rgba(225,6,0,0.45)]'
    : 'border-bjj-gray-800/80 bg-bjj-gray-900/60 text-bjj-gray-200 hover:border-bjj-red/50';
  const classes = `${baseClasses} ${stateClasses}${className ? ` ${className}` : ''}`;

  return (
    <button type="button" className={classes} {...props}>
      {leftIcon}
      {children}
    </button>
  );
};

export default ToggleTag;
