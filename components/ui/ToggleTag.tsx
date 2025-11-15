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
    'btn btn-sm btn-outline border-bjj-gray-700 bg-transparent text-xs font-semibold uppercase tracking-wide text-bjj-gray-200';
  const stateClasses = active
    ? 'btn-primary text-bjj-white border-transparent shadow-[0_8px_24px_-12px_rgba(225,6,0,0.45)]'
    : 'hover:border-bjj-red/50 hover:text-bjj-white';
  const classes = `${baseClasses} ${stateClasses}${className ? ` ${className}` : ''}`;

  return (
    <button type="button" className={classes} {...props}>
      {leftIcon}
      {children}
    </button>
  );
};

export default ToggleTag;
