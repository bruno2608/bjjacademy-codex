'use client';

import { forwardRef, useMemo } from 'react';
import type { InputHTMLAttributes } from 'react';

export type ValidatedFieldProps = {
  label: string;
  helper?: string;
  error?: string;
  success?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const ValidatedField = forwardRef<HTMLInputElement, ValidatedFieldProps>(
  ({ label, helper, error, success, className = '', ...props }, ref) => {
    const message = useMemo(() => {
      if (error) return { tone: 'text-error', content: error };
      if (success) return { tone: 'text-success', content: success };
      if (helper) return { tone: 'text-bjj-gray-300', content: helper };
      return null;
    }, [error, helper, success]);

    return (
      <label className="form-control w-full">
        <div className="label pb-1">
          <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-200/80">{label}</span>
          {success && <span className="label-text-alt text-[11px] text-success">Ok</span>}
        </div>
        <input
          ref={ref}
          className={`input input-bordered w-full border-bjj-gray-800 bg-bjj-gray-900 text-sm text-bjj-gray-100 focus:border-bjj-red focus:outline-none ${className}`}
          {...props}
        />
        {message && (
          <div className="label pt-1">
            <span className={`label-text-alt text-[11px] ${message.tone}`}>{message.content}</span>
          </div>
        )}
      </label>
    );
  }
);

ValidatedField.displayName = 'ValidatedField';

export default ValidatedField;
