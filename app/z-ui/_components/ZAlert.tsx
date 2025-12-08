import * as React from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

export type ZAlertVariant = "info" | "success" | "warning" | "error";
export type ZAlertTone = "inline" | "banner";

export type ZAlertProps = {
  variant?: ZAlertVariant;
  tone?: ZAlertTone;
  title?: string;
  children?: React.ReactNode;
  icon?: string;
  actions?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function ZAlert({
  variant = "info",
  tone = "inline",
  title,
  children,
  icon,
  actions,
  dismissible,
  onDismiss,
  className,
  ...rest
}: ZAlertProps) {
  const baseVariantClass =
    variant === "info"
      ? "alert-info"
      : variant === "success"
      ? "alert-success"
      : variant === "warning"
      ? "alert-warning"
      : "alert-error";

  const toneClass =
    tone === "banner"
      ? "rounded-2xl border-2 border-base-300/80 bg-base-200/80 shadow-lg px-4 py-3"
      : "rounded-xl border border-base-300/60 bg-base-100/90 shadow-sm";

  return (
    <div
      role="alert"
      className={cn("alert items-start gap-3", baseVariantClass, toneClass, className)}
      {...rest}
    >
      {icon && (
        <div className="mt-0.5">
          <Icon icon={icon} className="text-lg" />
        </div>
      )}

      <div className="flex-1">
        {title && (
          <h4 className="text-sm font-semibold mb-0.5">
            {title}
          </h4>
        )}
        {children && (
          <p className="text-xs leading-snug text-base-content/80">
            {children}
          </p>
        )}
        {actions && (
          <div className="mt-2 flex flex-wrap gap-2">
            {actions}
          </div>
        )}
      </div>

      {dismissible && (
        <button
          type="button"
          className="btn btn-ghost btn-xs"
          onClick={onDismiss}
          aria-label="Dismiss alert"
        >
          &times;
        </button>
      )}
    </div>
  );
}
