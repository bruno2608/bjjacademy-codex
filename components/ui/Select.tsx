'use client';

import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';

/**
 * Dropdown padrão do projeto. Reaproveita a classe `.input-field`
 * para garantir aparência consistente entre inputs e selects.
 */
export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const baseClasses =
  'select select-bordered w-full border-bjj-gray-700 bg-bjj-gray-900/70 text-sm text-bjj-white focus:border-bjj-red focus:outline-none focus:ring-1 focus:ring-bjj-red/40';

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className = '', children, ...props }, ref) => {
  const classes = className ? `${baseClasses} ${className}` : baseClasses;
  return (
    <select ref={ref} className={classes} {...props}>
      {children}
    </select>
  );
});

Select.displayName = 'Select';

export default Select;
