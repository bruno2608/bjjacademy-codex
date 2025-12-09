import * as React from "react";
import { cn } from "@/lib/utils";

export interface ZInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  /** Mensagem de erro; se preenchida, ativa estado de erro */
  error?: string;
  containerClassName?: string;
}

export function ZInputField(props: ZInputFieldProps) {
  const {
    label,
    helperText,
    error,
    className,
    containerClassName,
    id,
    ...inputProps
  } = props;

  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const hasError = Boolean(error);

  return (
    <div className={cn("form-control w-full gap-1", containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="py-0 label">
          <span className="text-xs font-semibold tracking-wide uppercase label-text text-base-content/70">
            {label}
          </span>
        </label>
      )}

      <input
        id={inputId}
        {...inputProps}
        className={cn(
          "input input-bordered w-full bg-base-100/70 text-base",
          hasError && "input-error border-error/80",
          className,
        )}
      />

      {helperText && !hasError && (
        <p className="mt-1 text-[11px] text-base-content/60">
          {helperText}
        </p>
      )}

      {hasError && (
        <p className="mt-1 text-[11px] font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}
