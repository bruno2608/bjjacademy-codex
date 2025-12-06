import * as React from "react";
import { cn } from "@/lib/utils";

export type ZCardVariant = "default" | "subtle" | "ghost";

export interface ZCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Variação visual do card */
  variant?: ZCardVariant;
  /** Se aplica padding padrão da demo ou deixa “cru” */
  padded?: boolean;
}

const variantClasses: Record<ZCardVariant, string> = {
  default: "bg-base-200/80 border-base-300/70 shadow-sm",
  subtle: "bg-base-100/80 border-base-300/50 shadow-sm",
  ghost: "bg-transparent border-base-300/40",
};

export function ZCard(props: ZCardProps) {
  const {
    variant = "default",
    padded = true,
    className,
    children,
    ...rest
  } = props;

  return (
    <div
      className={cn(
        "card rounded-2xl border",
        variantClasses[variant],
        padded && "card-body gap-3 p-4 text-sm",
        !padded && "text-sm",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
