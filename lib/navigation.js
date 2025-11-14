/**
 * Lista centralizada de rotas da área autenticada.
 * Reutilizada entre sidebar desktop e navegação mobile.
 */
import { LayoutDashboard, Users, CalendarCheck, Medal } from 'lucide-react';

export const navigationItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Resumo geral e recomendações'
  },
  {
    href: '/alunos',
    label: 'Alunos',
    icon: Users,
    description: 'Cadastros, perfis e evolução'
  },
  {
    href: '/presencas',
    label: 'Presenças',
    icon: CalendarCheck,
    description: 'Controle diário das turmas'
  },
  {
    href: '/graduacoes',
    label: 'Graduações',
    icon: Medal,
    description: 'Planejamento de faixas e graus'
  }
];

export default navigationItems;
