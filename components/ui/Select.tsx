'use client';

import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';

/**
 * Dropdown padrão do projeto. Reaproveita a classe `.input-field`
 * para garantir aparência consistente entre inputs e selects.
 */
export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className = '', children, ...props }, ref) => {
  const classes = className ? `input-field ${className}` : 'input-field';
  return (
    <select ref={ref} className={classes} {...props}>
      {children}
    </select>
  );
});

Select.displayName = 'Select';

export default Select;
