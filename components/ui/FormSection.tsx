'use client';

import type { ReactNode } from 'react';

/**
 * Agrupador padrão de campos de formulário. Utiliza o card da UI
 * para manter espaçamento e títulos consistentes entre domínios.
 */
export interface FormSectionProps {
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
}

export default function FormSection({ title, description, className = '', children }: FormSectionProps) {
  const classes = className ? `card gap-4 p-5 ${className}` : 'card gap-4 p-5';

  return (
    <section className={classes}>
      {(title || description) && (
        <header className="space-y-1">
          {title && <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-bjj-gray-200">{title}</h3>}
          {description && <p className="text-xs text-bjj-gray-200/70">{description}</p>}
        </header>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}
