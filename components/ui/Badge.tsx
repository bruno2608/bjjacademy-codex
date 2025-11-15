'use client';

import type { HTMLAttributes } from 'react';

/**
 * Badge padrão para exibir status ou rótulos rápidos.
 * Utiliza o mesmo espaçamento e tipografia definidos no guia de UI.
 */
export type BadgeVariant = 'accent' | 'muted' | 'warning' | 'danger' | 'success' | 'neutral';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  accent: 'badge badge-sm badge-primary text-bjj-white',
  muted: 'badge badge-sm bg-bjj-gray-700/45 text-bjj-gray-100',
  neutral: 'badge badge-sm bg-bjj-gray-600/40 text-bjj-gray-100',
  warning: 'badge badge-sm badge-warning text-bjj-black',
  danger: 'badge badge-sm badge-error text-bjj-white',
  success: 'badge badge-sm badge-success text-bjj-white'
};

const Badge = ({ className = '', variant = 'muted', children, ...props }: BadgeProps) => {
  const variantClasses = VARIANT_CLASSES[variant] || VARIANT_CLASSES.muted;
  const classes = className ? `${variantClasses} ${className}` : variantClasses;

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;
