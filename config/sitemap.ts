import {
  LayoutDashboard,
  CalendarCheck,
  Clock3,
  Medal,
  History,
  UserCircle2,
  BarChart3,
  Users,
  ListChecks,
  Settings2,
  ShieldCheck
} from 'lucide-react';
import { ROLE_KEYS, type UserRole } from './roles';

export type SiteMapItem = {
  title: string;
  path: string;
  icon?: any;
  roles: UserRole[];
  showInMainNav?: boolean;
};

const ALL_STUDENTS: UserRole[] = [ROLE_KEYS.student];
const ALL_INSTRUCTORS: UserRole[] = [ROLE_KEYS.instructor, ROLE_KEYS.teacher];
const ALL_ADMINS: UserRole[] = [ROLE_KEYS.admin, ROLE_KEYS.ti];

export const roleAccess: Record<UserRole, string[]> = {
  [ROLE_KEYS.student]: [
    '/dashboard',
    '/checkin',
    '/treinos',
    '/evolucao',
    '/historico-presencas',
    '/perfil',
    '/relatorios'
  ],
  [ROLE_KEYS.instructor]: [
    '/dashboard',
    '/checkin',
    '/treinos',
    '/evolucao',
    '/historico-presencas',
    '/perfil',
    '/relatorios',
    '/presencas',
    '/alunos',
    '/regras',
    '/horarios',
    '/tipos-treino'
  ],
  [ROLE_KEYS.teacher]: [
    '/dashboard',
    '/checkin',
    '/treinos',
    '/evolucao',
    '/historico-presencas',
    '/perfil',
    '/relatorios',
    '/presencas',
    '/alunos',
    '/regras',
    '/horarios',
    '/tipos-treino'
  ],
  [ROLE_KEYS.admin]: [
    '/dashboard',
    '/checkin',
    '/treinos',
    '/evolucao',
    '/historico-presencas',
    '/perfil',
    '/relatorios',
    '/presencas',
    '/alunos',
    '/regras',
    '/horarios',
    '/tipos-treino',
    '/usuarios',
    '/academia'
  ],
  [ROLE_KEYS.ti]: [
    '/dashboard',
    '/checkin',
    '/treinos',
    '/evolucao',
    '/historico-presencas',
    '/perfil',
    '/relatorios',
    '/presencas',
    '/alunos',
    '/regras',
    '/horarios',
    '/tipos-treino',
    '/usuarios',
    '/academia',
    '/ti'
  ]
};

export const siteMap: SiteMapItem[] = [
  { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: [...ALL_STUDENTS, ...ALL_INSTRUCTORS, ...ALL_ADMINS] },
  { title: 'Check-in', path: '/checkin', icon: CalendarCheck, roles: [...ALL_STUDENTS, ...ALL_INSTRUCTORS, ...ALL_ADMINS] },
  { title: 'Treinos', path: '/treinos', icon: Clock3, roles: [...ALL_STUDENTS, ...ALL_INSTRUCTORS, ...ALL_ADMINS] },
  { title: 'Evolução', path: '/evolucao', icon: Medal, roles: [...ALL_STUDENTS, ...ALL_INSTRUCTORS, ...ALL_ADMINS] },
  { title: 'Histórico de presenças', path: '/historico-presencas', icon: History, roles: [...ALL_STUDENTS, ...ALL_INSTRUCTORS, ...ALL_ADMINS] },
  { title: 'Meu Perfil', path: '/perfil', icon: UserCircle2, roles: [...ALL_STUDENTS, ...ALL_INSTRUCTORS, ...ALL_ADMINS], showInMainNav: false },
  { title: 'Relatórios', path: '/relatorios', icon: BarChart3, roles: [...ALL_STUDENTS, ...ALL_INSTRUCTORS, ...ALL_ADMINS] },
  { title: 'Presenças', path: '/presencas', icon: CalendarCheck, roles: [...ALL_INSTRUCTORS, ...ALL_ADMINS] },
  { title: 'Alunos', path: '/alunos', icon: Users, roles: [...ALL_INSTRUCTORS, ...ALL_ADMINS] },
  { title: 'Regras', path: '/regras', icon: Medal, roles: [...ALL_INSTRUCTORS, ...ALL_ADMINS] },
  { title: 'Horários', path: '/horarios', icon: Clock3, roles: [...ALL_INSTRUCTORS, ...ALL_ADMINS] },
  { title: 'Tipos de treino', path: '/tipos-treino', icon: ListChecks, roles: [...ALL_INSTRUCTORS, ...ALL_ADMINS] },
  { title: 'Usuários', path: '/usuarios', icon: Users, roles: ALL_ADMINS },
  { title: 'Academia', path: '/academia', icon: Settings2, roles: ALL_ADMINS },
  { title: 'Área de TI', path: '/ti', icon: ShieldCheck, roles: [ROLE_KEYS.ti] }
];

export const allowedPaths = siteMap.map((item) => item.path);

export function getRoutesForRoles(roles: UserRole[]): string[] {
  const paths = new Set<string>();
  roles.forEach((role) => {
    roleAccess[role]?.forEach((route) => paths.add(route));
  });
  return Array.from(paths);
}

export function filterSiteMapByRoles(items: SiteMapItem[], roles: UserRole[]): SiteMapItem[] {
  const allowed = getRoutesForRoles(roles);
  return items.filter((item) => allowed.includes(item.path));
}

export function isRouteAllowed(pathname: string, roles: UserRole[]): boolean {
  const allowedRoutes = getRoutesForRoles(roles);
  return allowedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export default siteMap;
