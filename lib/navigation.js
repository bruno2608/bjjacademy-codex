import { LayoutDashboard, CalendarCheck, Users, BarChart3, Settings2, ShieldCheck, ClipboardList } from 'lucide-react';

import { ROLE_KEYS, normalizeRoles } from '../config/roles';

const STAFF_TOP_NAV = [
  { key: 'dashboard', title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  {
    key: 'presencas',
    title: 'Presenças',
    path: '/presencas',
    icon: CalendarCheck,
    children: [
      {
        key: 'chamada-dia',
        title: 'Chamada do dia',
        path: '/presencas',
        href: { pathname: '/presencas', query: { view: 'chamada' } },
        description: 'Visão focada na chamada diária'
      },
      {
        key: 'pendencias',
        title: 'Pendências de aprovação',
        path: '/presencas',
        href: { pathname: '/presencas', query: { view: 'pendencias' } },
        description: 'Revisar presenças pendentes'
      },
      {
        key: 'revisao',
        title: 'Revisão / últimos envios',
        path: '/presencas',
        href: { pathname: '/presencas', query: { view: 'revisao' } },
        description: 'Histórico de envios recentes'
      }
    ]
  },
  { key: 'alunos', title: 'Alunos', path: '/alunos', icon: Users },
  {
    key: 'graduacoes',
    title: 'Graduações',
    path: '/graduacoes',
    icon: ShieldCheck,
    children: [
      {
        key: 'proximas',
        title: 'Próximas graduações',
        path: '/graduacoes',
        href: { pathname: '/graduacoes', query: { view: 'proximas' } },
        description: 'Planejamento do próximo ciclo'
      },
      {
        key: 'historico',
        title: 'Histórico recente',
        path: '/graduacoes',
        href: { pathname: '/graduacoes', query: { view: 'historico' } },
        description: 'Registros recentes de graduação'
      }
    ]
  },
  { key: 'relatorios', title: 'Relatórios', path: '/relatorios', icon: BarChart3 },
  {
    key: 'configuracoes',
    title: 'Configurações',
    path: '/configuracoes',
    icon: Settings2,
    children: [
      {
        key: 'config-graduacao',
        title: 'Config. de graduação',
        path: '/configuracoes/graduacao',
        href: '/configuracoes/graduacao',
        description: 'Regras e requisitos de graduação'
      },
      {
        key: 'config-treinos',
        title: 'Config. de treinos/turmas',
        path: '/configuracoes/treinos',
        href: '/configuracoes/treinos',
        description: 'Horários e turmas'
      },
      {
        key: 'config-tipos-treino',
        title: 'Config. de tipos de treino',
        path: '/configuracoes/tipos-treino',
        href: '/configuracoes/tipos-treino',
        description: 'Classificações de treino'
      }
    ]
  }
];

const STAFF_DRAWER = [
  { key: 'dashboard', title: 'Dashboard', path: '/dashboard' },
  {
    key: 'presencas',
    title: 'Presenças',
    path: '/presencas',
    children: [
      { key: 'chamada-dia', title: 'Chamada do dia', path: '/presencas', href: { pathname: '/presencas', query: { view: 'chamada' } } },
      {
        key: 'pendencias',
        title: 'Pendências de aprovação',
        path: '/presencas',
        href: { pathname: '/presencas', query: { view: 'pendencias' } }
      },
      {
        key: 'revisao',
        title: 'Revisão / últimos envios',
        path: '/presencas',
        href: { pathname: '/presencas', query: { view: 'revisao' } }
      }
    ]
  },
  { key: 'alunos', title: 'Alunos', path: '/alunos' },
  {
    key: 'graduacoes',
    title: 'Graduações',
    path: '/graduacoes',
    children: [
      { key: 'proximas', title: 'Próximas graduações', path: '/graduacoes', href: { pathname: '/graduacoes', query: { view: 'proximas' } } },
      { key: 'historico', title: 'Histórico recente', path: '/graduacoes', href: { pathname: '/graduacoes', query: { view: 'historico' } } }
    ]
  },
  { key: 'relatorios', title: 'Relatórios', path: '/relatorios' },
  {
    key: 'configuracoes',
    title: 'Configurações',
    path: '/configuracoes',
    children: [
      { key: 'config-graduacao', title: 'Config. de graduação', path: '/configuracoes/graduacao', href: '/configuracoes/graduacao' },
      { key: 'config-treinos', title: 'Config. de treinos/turmas', path: '/configuracoes/treinos', href: '/configuracoes/treinos' },
      {
        key: 'config-tipos-treino',
        title: 'Config. de tipos de treino',
        path: '/configuracoes/tipos-treino',
        href: '/configuracoes/tipos-treino'
      }
    ]
  }
];

const STAFF_AVATAR_MENU = [
  { key: 'perfil', title: 'Meu perfil', href: '/perfil', icon: Users },
  { key: 'historico', title: 'Histórico de presenças', href: '/historico-presencas', icon: ClipboardList },
  { key: 'logout', title: 'Sair', action: 'logout', icon: undefined }
];

const STUDENT_TOP_NAV = [
  { key: 'dashboard-aluno', title: 'Dashboard do aluno', path: '/dashboard' },
  { key: 'checkin-aluno', title: 'Check-in do aluno', path: '/checkin' },
  { key: 'treinos-aluno', title: 'Treinos do aluno', path: '/treinos' },
  { key: 'evolucao', title: 'Evolução', path: '/evolucao' }
];

const STUDENT_DRAWER = [
  { title: 'Dashboard do aluno', path: '/dashboard' },
  { title: 'Check-in do aluno', path: '/checkin' },
  { title: 'Treinos do aluno', path: '/treinos' },
  { title: 'Evolução', path: '/evolucao' },
  { title: 'Histórico de presenças', path: '/historico-presencas', section: 'Mais' },
  { title: 'Solicitações de presença', path: '/solicitacoes-presenca', section: 'Mais' }
];

const STUDENT_AVATAR_MENU = [
  { key: 'perfil', title: 'Meu perfil', href: '/perfil', icon: Users },
  { key: 'historico', title: 'Histórico de presenças', href: '/historico-presencas', icon: ClipboardList },
  {
    key: 'solicitacoes',
    title: 'Solicitações de presença',
    href: '/solicitacoes-presenca',
    icon: CalendarCheck,
    note: 'TODO: criar tela de solicitações'
  },
  { key: 'logout', title: 'Sair', action: 'logout', icon: undefined }
];

const buildNavigationConfig = (roles = []) => {
  const normalized = normalizeRoles(Array.isArray(roles) ? roles : []);
  const isStaff = normalized.some((role) => role !== ROLE_KEYS.aluno);

  if (isStaff) {
    return {
      variant: 'staff',
      topNav: STAFF_TOP_NAV,
      drawerNav: STAFF_DRAWER,
      avatarMenu: STAFF_AVATAR_MENU
    };
  }

  return {
    variant: 'student',
    topNav: STUDENT_TOP_NAV,
    drawerNav: STUDENT_DRAWER,
    avatarMenu: STUDENT_AVATAR_MENU
  };
};

export const getNavigationConfigForRoles = (roles = []) => buildNavigationConfig(roles);

// Compat: funções originais retornam uma lista plana para componentes antigos.
export function getNavigationItemsForRoles(roles = [], { includeHidden = true } = {}) {
  const { topNav } = buildNavigationConfig(roles);
  if (includeHidden) return topNav;
  return topNav;
}

export function getTopNavigationItemsForRoles(roles = []) {
  const { topNav } = buildNavigationConfig(roles);
  return topNav;
}

export function flattenNavigation(items = []) {
  return items.flatMap((item) => (item.children?.length ? [item, ...flattenNavigation(item.children)] : item));
}

export default buildNavigationConfig;
