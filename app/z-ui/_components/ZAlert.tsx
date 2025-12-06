import * as React from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

export type ZAlertVariant = "info" | "success" | "warning" | "error";

export interface ZAlertProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Tipo de feedback: info / success / warning / error */
  variant?: ZAlertVariant;
  /** Icone Iconify, ex: "mdi:alert-circle-outline" */
  icon?: string;
  /** Texto principal em destaque */
  title?: React.ReactNode;
  /** Ação à direita (ex: link “Support”) */
  action?: React.ReactNode;
}

export function ZAlert(props: ZAlertProps) {
  const {
    variant = "info",
    icon,
    title,
    action,
    children,
    className,
    ...rest
  } = props;

  return (
    <div
      role="alert"
      className={cn(
        "alert rounded-xl border border-base-300/70",
        // mapeia para as cores do DaisyUI 5
        {
          info: "alert-info",
          success: "alert-success",
          warning: "alert-warning",
          error: "alert-error",
        }[variant],
        className,
      )}
      {...rest}
    >
      {icon && (
        <span className="flex items-center justify-center w-5 h-5">
          <Icon icon={icon} className="w-5 h-5" />
        </span>
      )}

      <div className="flex flex-col gap-0.5">
        {title && (
          <span className="text-sm font-medium">
            {title}
          </span>
        )}
        {children && (
          <span className="text-xs leading-snug opacity-90">
            {children}
          </span>
        )}
      </div>

      {action && (
        <div className="ml-auto text-xs font-medium">
          {action}
        </div>
      )}
    </div>
  );
}
