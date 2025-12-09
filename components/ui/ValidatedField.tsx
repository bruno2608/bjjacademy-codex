'use client';

import { forwardRef, useMemo, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

export type ValidatedFieldProps = {
  label: string;
  helper?: string;
  error?: string;
  success?: string;
  showPasswordToggle?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

const ValidatedField = forwardRef<HTMLInputElement, ValidatedFieldProps>(
  ({ label, helper, error, success, showPasswordToggle, className = '', type = 'text', ...props }, ref) => {
    const message = useMemo(() => {
      if (error) return { tone: 'text-error', content: error };
      if (success) return { tone: 'text-success', content: success };
      if (helper) return { tone: 'text-bjj-gray-300', content: helper };
      return null;
    }, [error, helper, success]);

    const [showPassword, setShowPassword] = useState(false);
    const shouldTogglePassword = (showPasswordToggle ?? type === 'password') && type === 'password';
    const resolvedType = shouldTogglePassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <label className="form-control w-full">
        <div className="label pb-1">
          <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-200/80">{label}</span>
          {success && <span className="label-text-alt text-[11px] text-success">Ok</span>}
        </div>
        <div className="relative">
          <input
            ref={ref}
            type={resolvedType}
            className={`input input-bordered w-full border-bjj-gray-800 bg-bjj-gray-900 text-sm text-bjj-gray-100 focus:border-bjj-red focus:outline-none ${shouldTogglePassword ? 'pr-12' : ''} ${className}`}
            {...props}
          />
          {shouldTogglePassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-3 my-auto inline-flex h-9 w-9 items-center justify-center rounded-lg text-bjj-gray-200 transition hover:bg-bjj-gray-800 focus:outline-none focus:ring-2 focus:ring-bjj-red/60"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
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
