import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Medal,
  History,
  Settings2,
  Clock3,
  ListChecks,
  UserCircle2
} from 'lucide-react';

export type UserRole = 'TI' | 'ADMIN' | 'PROFESSOR' | 'INSTRUTOR' | 'ALUNO';

export type SiteMapItem = {
  title: string;
  path: string;
  icon?: LucideIcon;
  roles: UserRole[];
  children?: SiteMapItem[];
};

const ALL_STAFF_ROLES: UserRole[] = ['TI', 'ADMIN', 'PROFESSOR', 'INSTRUTOR'];
const ALL_ROLES: UserRole[] = ['TI', 'ADMIN', 'PROFESSOR', 'INSTRUTOR', 'ALUNO'];

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
    roles: ALL_STAFF_ROLES
  },
  {
    title: 'Presenças',
    path: '/presencas',
    icon: CalendarCheck,
    roles: ALL_STAFF_ROLES
  },
  {
    title: 'Graduações',
    path: '/graduacoes',
    icon: Medal,
    roles: ALL_STAFF_ROLES
  },
  {
    title: 'Histórico',
    path: '/historico',
    icon: History,
    roles: ALL_STAFF_ROLES
  },
  {
    title: 'Meu Perfil',
    path: '/perfil',
    icon: UserCircle2,
    roles: ALL_ROLES
  },
  {
    title: 'Configurações da Academia',
    path: '/configuracoes',
    icon: Settings2,
    roles: ['TI', 'ADMIN', 'PROFESSOR'],
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
