import { LayoutDashboard, CalendarCheck, Users, BarChart3, Settings2, ShieldCheck, ClipboardList, QrCode } from 'lucide-react';

import { ROLE_KEYS, normalizeRoles } from '../config/roles';

const STAFF_CONFIG_GROUP = {
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
};

const STAFF_TOP_NAV = [
  { key: 'dashboard', title: 'Home', path: '/dashboard', icon: LayoutDashboard },
  {
    key: 'presencas',
    title: 'Presenças',
    path: '/presencas',
    icon: CalendarCheck,
    children: [
      {
        key: 'chamada-dia',
        title: 'Check-in de Alunos',
        path: '/presencas/check-in',
        href: '/presencas/check-in',
        description: 'Registrar presenças do dia'
      },
      {
        key: 'pendencias',
        title: 'Pendências de aprovação',
        path: '/presencas/pendencias',
        href: '/presencas/pendencias',
        description: 'Revisar presenças pendentes'
      },
      {
        key: 'revisao',
        title: 'Revisão de Presenças',
        path: '/presencas/revisao',
        href: '/presencas/revisao',
        description: 'Histórico agrupado (últimos 30 dias)'
      }
    ]
  },
  { key: 'alunos', title: 'Alunos', path: '/alunos', icon: Users },
  {
    key: 'graduacoes',
    title: 'Graduações',
    path: '/graduacoes/proximas',
    icon: ShieldCheck,
    children: [
      {
        key: 'proximas',
        title: 'Próximas graduações',
        path: '/graduacoes/proximas',
        href: '/graduacoes/proximas',
        description: 'Planejamento do próximo ciclo'
      },
      {
        key: 'historico',
        title: 'Histórico de graduações',
        path: '/graduacoes/historico',
        href: '/graduacoes/historico',
        description: 'Progresso, pendentes e cerimônias concluídas'
      }
    ]
  },
  { key: 'relatorios', title: 'Relatórios', path: '/relatorios', icon: BarChart3 }
];

const QR_CODE_GROUP = {
  key: 'qrcode',
  title: 'QR Code Check-in',
  path: '/qrcode',
  icon: QrCode,
  children: [
    { key: 'qr-academia', title: 'QR Code da Academia', path: '/qrcode', href: '/qrcode' },
    { key: 'qr-validar', title: 'Validar QR Code', path: '/qrcode/validar', href: '/qrcode/validar' },
    { key: 'qr-historico', title: 'Histórico de Validações', path: '/qrcode/historico', href: '/qrcode/historico' }
  ]
};

const STAFF_DRAWER = [
  { key: 'dashboard', title: 'Dashboard', path: '/dashboard' },
  {
    key: 'presencas',
    title: 'Presenças',
    path: '/presencas',
    children: [
      { key: 'chamada-dia', title: 'Check-in de Alunos', path: '/presencas/check-in', href: '/presencas/check-in' },
      { key: 'pendencias', title: 'Pendências de aprovação', path: '/presencas/pendencias', href: '/presencas/pendencias' },
      { key: 'revisao', title: 'Revisão de Presenças', path: '/presencas/revisao', href: '/presencas/revisao' }
    ]
  },
  { key: 'alunos', title: 'Alunos', path: '/alunos' },
  {
    key: 'graduacoes',
    title: 'Graduações',
    path: '/graduacoes/proximas',
    children: [
      { key: 'proximas', title: 'Próximas graduações', path: '/graduacoes/proximas', href: '/graduacoes/proximas' },
      { key: 'historico', title: 'Histórico de graduações', path: '/graduacoes/historico', href: '/graduacoes/historico' }
    ]
  },
  { key: 'relatorios', title: 'Relatórios', path: '/relatorios' },
];

const STAFF_AVATAR_MENU = [
  { key: 'perfil', title: 'Meu perfil', href: '/perfil', icon: Users },
  { key: 'historico', title: 'Histórico de presenças', href: '/historico-presencas', icon: ClipboardList },
  {
    ...STAFF_CONFIG_GROUP,
    type: 'group'
  },
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
  const allowQr = normalized.some((role) =>
    [ROLE_KEYS.professor, ROLE_KEYS.admin, ROLE_KEYS.ti].includes(role)
  );

  const buildWithQr = (items = []) => {
    if (!allowQr) return items;
    const cloned = items.map((item) => ({ ...item, children: item.children ? [...item.children] : undefined }));
    const qrGroup = { ...QR_CODE_GROUP, children: [...QR_CODE_GROUP.children] };
    const insertIndex = cloned.findIndex((entry) => entry.key === 'presencas');
    if (insertIndex >= 0) {
      cloned.splice(insertIndex + 1, 0, qrGroup);
    } else {
      cloned.push(qrGroup);
    }
    return cloned;
  };

  if (isStaff) {
    const topNav = buildWithQr(STAFF_TOP_NAV);
    const drawerNav = buildWithQr(STAFF_DRAWER);
    return {
      variant: 'staff',
      topNav,
      drawerNav,
      avatarMenu: STAFF_AVATAR_MENU,
      configNav: null
    };
  }

  return {
    variant: 'student',
    topNav: STUDENT_TOP_NAV,
    drawerNav: STUDENT_DRAWER,
    avatarMenu: STUDENT_AVATAR_MENU,
    configNav: null
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
