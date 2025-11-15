'use client';

import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

/**
 * Campo de texto padrão utilizando a classe utilitária `.input-field`.
 * Centraliza a aparência dos inputs e permite sobrescrever estilos via className.
 */
export type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => {
  const classes = className ? `input-field ${className}` : 'input-field';
  return <input ref={ref} className={classes} {...props} />;
});

Input.displayName = 'Input';

export default Input;
