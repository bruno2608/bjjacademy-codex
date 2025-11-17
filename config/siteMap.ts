import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Medal,
  BarChart3,
  FileText,
  Settings2,
  Clock3,
  ListChecks,
  UserCircle2
} from 'lucide-react';
import type { UserRole } from './roles';
import { ROLE_KEYS, STAFF_ROLES, ADMIN_ROLES, STUDENT_ROLES } from './roles';

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
    title: 'Dashboard do Aluno',
    path: '/dashboard-aluno',
    icon: LayoutDashboard,
    roles: STUDENT_ROLES
  },
  {
    title: 'Check-in',
    path: '/checkin',
    icon: CalendarCheck,
    roles: STUDENT_ROLES
  },
  {
    title: 'Treinos do Aluno',
    path: '/treinos',
    icon: Clock3,
    roles: STUDENT_ROLES
  },
  {
    title: 'Evolução',
    path: '/evolucao',
    icon: Medal,
    roles: STUDENT_ROLES,
    showInMainNav: true
  },
  {
    title: 'Histórico de presenças',
    path: '/presencas/historico',
    icon: CalendarCheck,
    roles: [...STAFF_ROLES, ROLE_KEYS.student],
    showInMainNav: true
  },
  {
    title: 'Relatórios',
    path: '/relatorios',
    icon: BarChart3,
    roles: [...STAFF_ROLES, ROLE_KEYS.student],
    showInMainNav: true
  },
  {
    title: 'Meu Perfil',
    path: '/perfil',
    icon: UserCircle2,
    roles: [...STAFF_ROLES, ROLE_KEYS.student],
    showInMainNav: false
  },
  {
    title: 'Dashboard Instrutor',
    path: '/dashboard-instrutor',
    icon: LayoutDashboard,
    roles: STAFF_ROLES
  },
  {
    title: 'Dashboard Admin',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: ADMIN_ROLES,
    showInMainNav: false
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
    title: 'Regras de Graduação',
    path: '/regras-graduacao',
    icon: Medal,
    roles: STAFF_ROLES
  },
  {
    title: 'Horários de Treino',
    path: '/horarios',
    icon: Clock3,
    roles: STAFF_ROLES
  },
  {
    title: 'Tipos de Treino',
    path: '/tipos-treino',
    icon: ListChecks,
    roles: STAFF_ROLES
  },
  {
    title: 'Alunos',
    path: '/alunos',
    icon: Users,
    roles: STAFF_ROLES
  },
  {
    title: 'Configurações da Academia',
    path: '/configuracoes',
    icon: Settings2,
    roles: ADMIN_ROLES,
    showInMainNav: false,
    children: [
      {
        title: 'Regras de Graduação',
        path: '/configuracoes/graduacao',
        icon: Medal,
        roles: ADMIN_ROLES
      },
      {
        title: 'Horários de Treino',
        path: '/configuracoes/treinos',
        icon: Clock3,
        roles: ADMIN_ROLES
      },
      {
        title: 'Tipos de Treino',
        path: '/configuracoes/tipos-treino',
        icon: ListChecks,
        roles: ADMIN_ROLES
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
