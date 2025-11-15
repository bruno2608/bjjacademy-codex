'use client';

import type { HTMLAttributes } from 'react';

/**
 * Badge padrão para exibir status ou rótulos rápidos.
 * Utiliza o mesmo espaçamento e tipografia definidos no guia de UI.
 */
export type BadgeVariant = 'accent' | 'muted' | 'warning' | 'danger' | 'success';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  accent: 'bg-bjj-red/20 text-bjj-red',
  muted: 'bg-bjj-gray-800/80 text-bjj-gray-200',
  warning: 'bg-bjj-gray-800/80 text-bjj-red/80',
  danger: 'bg-bjj-red/10 text-bjj-red',
  success: 'bg-emerald-500/15 text-emerald-300'
};

const Badge = ({ className = '', variant = 'muted', children, ...props }: BadgeProps) => {
  const baseClasses = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold';
  const variantClasses = VARIANT_CLASSES[variant] || VARIANT_CLASSES.muted;
  const classes = `${baseClasses} ${variantClasses}${className ? ` ${className}` : ''}`;

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;
