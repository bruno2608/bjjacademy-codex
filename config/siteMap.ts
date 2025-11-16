import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Medal,
  BarChart3,
  Settings2,
  Clock3,
  ListChecks,
  UserCircle2
} from 'lucide-react';
import type { UserRole } from './userRoles';
import { ALL_ROLES, STAFF_ROLES } from './userRoles';

export type SiteMapItem = {
  title: string;
  path: string;
  icon?: LucideIcon;
  roles: UserRole[];
  children?: SiteMapItem[];
  /**
   * Define se o item deve aparecer na navegação principal.
   * Permanece acessível via menu do usuário mesmo quando oculto.
   */
  showInMainNav?: boolean;
};

/**
 * Mapa central de rotas do painel autenticado.
 * É utilizado para montar navegações, verificar permissões e proteger rotas via middleware.
 */
export const siteMap: SiteMapItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: ALL_ROLES
  },
  {
    title: 'Alunos',
    path: '/alunos',
    icon: Users,
    roles: STAFF_ROLES
  },
  {
    title: 'Presenças',
    path: '/presencas',
    icon: CalendarCheck,
    roles: STAFF_ROLES
  },
  {
    title: 'Graduações',
    path: '/graduacoes',
    icon: Medal,
    roles: STAFF_ROLES
  },
  {
    title: 'Relatórios',
    path: '/relatorios',
    icon: BarChart3,
    roles: STAFF_ROLES,
    showInMainNav: false
  },
  {
    title: 'Meu Perfil',
    path: '/perfil',
    icon: UserCircle2,
    roles: ALL_ROLES,
    showInMainNav: false
  },
  {
    title: 'Configurações da Academia',
    path: '/configuracoes',
    icon: Settings2,
    roles: ['TI', 'ADMIN', 'PROFESSOR'],
    showInMainNav: false,
    children: [
      {
        title: 'Regras de Graduação',
        path: '/configuracoes/graduacao',
        icon: Medal,
        roles: ['TI', 'ADMIN', 'PROFESSOR']
      },
      {
        title: 'Horários de Treino',
        path: '/configuracoes/treinos',
        icon: Clock3,
        roles: ['TI', 'ADMIN', 'PROFESSOR']
      },
      {
        title: 'Tipos de Treino',
        path: '/configuracoes/tipos-treino',
        icon: ListChecks,
        roles: ['TI', 'ADMIN', 'PROFESSOR']
      }
    ]
  }
];

/**
 * Percorre o mapa e retorna um novo array somente com itens permitidos para os papéis informados.
 */
export function filterSiteMapByRoles(items: SiteMapItem[], roles: UserRole[]): SiteMapItem[] {
  const normalizedRoles = roles?.length ? roles : [];

  return items
    .filter((item) => item.roles.some((role) => normalizedRoles.includes(role)))
    .map((item) => {
      if (!item.children?.length) {
        return item;
      }

      const filteredChildren = filterSiteMapByRoles(item.children, normalizedRoles);
      return { ...item, children: filteredChildren };
    });
}

/**
 * Cria uma lista plana com todas as rotas conhecidas, usada pelo middleware para verificações rápidas.
 */
export function flattenSiteMap(items: SiteMapItem[]): SiteMapItem[] {
  return items.flatMap((item) => {
    if (!item.children?.length) {
      return item;
    }
    return [item, ...flattenSiteMap(item.children)];
  });
}

export default siteMap;
