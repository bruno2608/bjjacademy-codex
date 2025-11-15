'use client';

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

/**
 * Botão reutilizável baseado nas classes utilitárias definidas em
 * `styles/tailwind.css`. As variantes existentes (primary/secondary)
 * correspondem diretamente às classes `.btn-primary` e `.btn-secondary`.
 */
export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary'
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', type = 'button', ...props }, ref) => {
    const variantClass = VARIANT_CLASSES[variant];
    const classes = className ? `btn ${variantClass} ${className}` : `btn ${variantClass}`;
    return <button ref={ref} type={type} className={classes} {...props} />;
  }
);

Button.displayName = 'Button';

export default Button;
