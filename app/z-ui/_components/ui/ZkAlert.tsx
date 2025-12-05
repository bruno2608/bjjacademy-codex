import { Icon } from "@iconify/react";

import { cn } from "@/lib/utils";

type ZkAlertVariant = "info" | "success" | "warning" | "error";

type ZkAlertProps = {
  variant: ZkAlertVariant;
  title?: string;
  children: React.ReactNode;
  hasIcon?: boolean;
  className?: string;
};

export function ZkAlert({ variant, title, children, hasIcon = true, className }: ZkAlertProps) {
  const iconMap: Record<ZkAlertVariant, string> = {
    info: "mdi:email-outline",
    success: "mdi:check-decagram-outline",
    warning: "mdi:shield-alert-outline",
    error: "mdi:alert-circle-outline",
  };

  return (
    <div className={cn("alert", `alert-${variant}`, "rounded-[var(--radius-box)]", className)}>
      {hasIcon && (
        <Icon icon={iconMap[variant]} className="w-5 h-5 shrink-0" aria-hidden="true" />
      )}
      <div className="flex flex-col">
        {title && <div className="font-medium">{title}</div>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}
