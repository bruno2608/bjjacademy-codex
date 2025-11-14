/**
 * Lista centralizada de rotas da área autenticada.
 * Reutilizada entre sidebar desktop e navegação mobile.
 */
import { LayoutDashboard, Users, CalendarCheck, Medal } from 'lucide-react';

export const navigationItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/alunos', label: 'Alunos', icon: Users },
  { href: '/presencas', label: 'Presenças', icon: CalendarCheck },
  { href: '/graduacoes', label: 'Graduações', icon: Medal }
];

export default navigationItems;
