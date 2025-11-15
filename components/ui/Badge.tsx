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
  accent: 'badge badge-sm badge-primary text-bjj-white',
  muted: 'badge badge-sm badge-outline border-bjj-gray-700 text-bjj-gray-200',
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
