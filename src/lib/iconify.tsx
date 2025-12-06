import type { ComponentType, SVGAttributes } from "react";
import {
  Box,
  CircleAlert,
  Check,
  ChevronLeft,
  ChevronRight,
  Database,
  Headphones,
  Key,
  Mail,
  Mic,
  Phone,
  Pencil,
  Play,
  Repeat,
  Search,
  Settings,
  ShieldCheck,
  Shuffle,
  TrendingUp,
  User,
  Users,
  Volume2,
} from "lucide-react";

import { cn } from "./utils";

type IconProps = SVGAttributes<SVGElement> & {
  icon: string;
};

const iconMap: Record<string, ComponentType<SVGAttributes<SVGElement>>> = {
  "mdi:chevron-left": ChevronLeft,
  "mdi:chevron-right": ChevronRight,
  "mdi:shield-check": ShieldCheck,
  "mdi:trending-up": TrendingUp,
  "mdi:magnify": Search,
  "mdi:account-outline": User,
  "mdi:key-variant": Key,
  "mdi:pencil-outline": Pencil,
  "mdi:phone-outline": Phone,
  "mdi:microphone-outline": Mic,
  "mdi:cog-outline": Settings,
  "mdi:database-outline": Database,
  "mdi:cube-outline": Box,
  "mdi:email-outline": Mail,
  "mdi:account-multiple-outline": Users,
  "mdi:alert-circle-outline": CircleAlert,
  "mdi:play": Play,
  "mdi:shuffle-variant": Shuffle,
  "mdi:repeat": Repeat,
  "mdi:headphones": Headphones,
  "mdi:volume-high": Volume2,
  "mdi:check-bold": Check,
};

export function Icon({ icon, className, ...props }: IconProps) {
  const Component = iconMap[icon];

  if (Component) {
    return <Component className={className} {...props} />;
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn("h-4 w-4 text-base-content/70", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity={0.2} />
      <path
        d="M12 7v5l3 3"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type { IconProps };
