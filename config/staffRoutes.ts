import type { ComponentType } from 'react';

import { CalendarCheck, LayoutDashboard, ShieldCheck, Users } from 'lucide-react';

export type StaffRouteSection = 'dia-a-dia' | 'alunos' | 'graduacoes' | 'outros';

export type StaffRoute = {
  path: string;
  label: string;
  icon?: ComponentType<any>;
  section: StaffRouteSection;
  visible?: boolean;
  showInTopNav?: boolean;
};

export const STAFF_ROUTE_SECTIONS: Record<StaffRouteSection, string> = {
  'dia-a-dia': 'Dia a dia',
  alunos: 'Alunos',
  graduacoes: 'Graduações',
  outros: 'Outros'
};

export const STAFF_ROUTES: StaffRoute[] = [
  { path: '/dashboard', label: 'Dashboard', section: 'dia-a-dia', icon: LayoutDashboard },
  { path: '/presencas', label: 'Presenças', section: 'dia-a-dia', icon: CalendarCheck },
  { path: '/checkin', label: 'Check-in', section: 'dia-a-dia', icon: CalendarCheck, visible: false, showInTopNav: false },
  { path: '/alunos', label: 'Alunos', section: 'alunos', icon: Users },
  { path: '/graduacoes', label: 'Graduações', section: 'graduacoes', icon: ShieldCheck }
];

export function getStaffRouteByPath(pathname: string) {
  const visibleRoutes = STAFF_ROUTES.filter((route) => route.visible !== false);

  return visibleRoutes.reduce((bestMatch, route) => {
    if (pathname === route.path || pathname.startsWith(`${route.path}/`)) {
      if (!bestMatch || route.path.length > bestMatch.path.length) {
        return route;
      }
    }
    return bestMatch;
  }, null as StaffRoute | null);
}
