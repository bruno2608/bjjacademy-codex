import {
  LayoutDashboard,
  CalendarCheck,
  Clock3,
  Medal,
  Users,
  BarChart3,
  Settings2,
  ListChecks,
  ShieldCheck
} from 'lucide-react';

import { siteMap } from '../config/siteMap';
import { ROLE_KEYS, normalizeRoles } from '../config/roles';

const ALL_ROLES = Object.values(ROLE_KEYS);

const allowedRolesForPath = (path) => {
  return ALL_ROLES.filter((role) => {
    const entry = siteMap[role];
    if (entry === 'acesso total') return true;
    return Array.isArray(entry) && entry.includes(path);
  });
};

export const navigationItems = [
  { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, showInTopNav: true },
  { title: 'Alunos', path: '/alunos', icon: Users, showInTopNav: true },
  { title: 'Presenças', path: '/presencas', icon: CalendarCheck, showInTopNav: true },
  { title: 'Graduações', path: '/configuracoes/graduacao', icon: ShieldCheck, showInTopNav: true },
  { title: 'Check-in', path: '/checkin', icon: CalendarCheck, showInTopNav: false },
  { title: 'Evolução', path: '/evolucao', icon: Medal, showInTopNav: false },
  { title: 'Treinos', path: '/treinos', icon: Clock3, showInTopNav: false },
  { title: 'Relatórios', path: '/relatorios', icon: BarChart3, showInTopNav: false },
  {
    title: 'Configurações',
    path: '/configuracoes',
    icon: Settings2,
    showInTopNav: true,
    children: [
      { title: 'Regras de graduação', path: '/configuracoes/graduacao', icon: Medal },
      { title: 'Horários de treino', path: '/configuracoes/treinos', icon: Clock3 },
      { title: 'Tipos de treino', path: '/configuracoes/tipos-treino', icon: ListChecks }
    ]
  },
  { title: 'Meu perfil', path: '/perfil', icon: Users, showInMainNav: false }
].map((item) => ({
  ...item,
  roles: allowedRolesForPath(item.path),
  children: item.children?.map((child) => ({
    ...child,
    roles: allowedRolesForPath(child.path)
  }))
}));

export function getNavigationItemsForRoles(roles = [], { includeHidden = false } = {}) {
  const safeRoles = normalizeRoles(Array.isArray(roles) ? roles : []);
  // Quando ainda não há papéis carregados (ex.: hidratação do store),
  // considere todos para garantir que a navegação apareça imediatamente.
  const effectiveRoles = safeRoles.length ? safeRoles : ALL_ROLES;

  const filterItems = (items) =>
    items
      .filter((item) => item.roles.some((role) => effectiveRoles.includes(role) || item.roles.length === ALL_ROLES.length))
      .map((item) =>
        item.children?.length
          ? { ...item, children: filterItems(item.children) }
          : item
      );

  const filtered = filterItems(navigationItems);
  if (includeHidden) return filtered;

  const hideByFlag = (items) =>
    items
      .filter((item) => item.showInMainNav !== false)
      .map((item) => (item.children?.length ? { ...item, children: hideByFlag(item.children) } : item));

  return hideByFlag(filtered);
}

export function getTopNavigationItemsForRoles(roles = []) {
  return getNavigationItemsForRoles(roles).filter((item) => item.showInTopNav !== false);
}

export function flattenNavigation(items = navigationItems) {
  return items.flatMap((item) => {
    if (!item.children?.length) return item;
    return [item, ...flattenNavigation(item.children)];
  });
}

export default navigationItems;
