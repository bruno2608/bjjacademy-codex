import { LayoutDashboard, CalendarCheck, Users, ShieldCheck, Clock3, BarChart3, Settings2 } from 'lucide-react';
import type { UserRole } from './roles';
import { ROLE_KEYS, STAFF_ROLES } from './roles';

export type StaffRouteSection = 'dia-a-dia' | 'alunos' | 'graduacoes' | 'outros';

export type StaffRoute = {
  path: string;
  label: string;
  icon?: typeof LayoutDashboard;
  section: StaffRouteSection;
  roles?: UserRole[];
  visible?: boolean;
};

const ALL_STAFF_ROLES: UserRole[] = STAFF_ROLES;

export const STAFF_ROUTES: StaffRoute[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    section: 'dia-a-dia',
    roles: ALL_STAFF_ROLES
  },
  {
    path: '/presencas',
    label: 'Presenças',
    icon: CalendarCheck,
    section: 'dia-a-dia',
    roles: ALL_STAFF_ROLES
  },
  {
    path: '/checkin',
    label: 'Check-in',
    icon: CalendarCheck,
    section: 'dia-a-dia',
    roles: ALL_STAFF_ROLES
  },
  {
    path: '/treinos',
    label: 'Treinos',
    icon: Clock3,
    section: 'dia-a-dia',
    roles: ALL_STAFF_ROLES,
    visible: false
  },
  {
    path: '/alunos',
    label: 'Alunos',
    icon: Users,
    section: 'alunos',
    roles: ALL_STAFF_ROLES
  },
  {
    path: '/graduacoes',
    label: 'Graduações',
    icon: ShieldCheck,
    section: 'graduacoes',
    roles: ALL_STAFF_ROLES
  },
  {
    path: '/historico-presencas',
    label: 'Histórico de presenças',
    icon: Clock3,
    section: 'graduacoes',
    roles: ALL_STAFF_ROLES,
    visible: false
  },
  {
    path: '/relatorios',
    label: 'Relatórios',
    icon: BarChart3,
    section: 'outros',
    roles: ALL_STAFF_ROLES
  },
  {
    path: '/configuracoes',
    label: 'Configurações',
    icon: Settings2,
    section: 'outros',
    roles: ALL_STAFF_ROLES
  },
  {
    path: '/perfil',
    label: 'Meu perfil',
    icon: Users,
    section: 'outros',
    roles: [ROLE_KEYS.professor, ROLE_KEYS.instrutor, ROLE_KEYS.admin, ROLE_KEYS.ti]
  }
];

export const STAFF_ROUTE_SECTIONS: Record<StaffRouteSection, string> = {
  'dia-a-dia': 'Dia a dia',
  alunos: 'Alunos',
  graduacoes: 'Graduações',
  outros: 'Outros'
};
