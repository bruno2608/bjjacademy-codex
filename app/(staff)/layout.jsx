import StaffAppShell from '@/components/layout/StaffAppShell';

export const metadata = {
  title: 'Área do Staff',
  description: 'Layout compartilhado para rotas do professor/instrutor.'
};

export default function StaffLayout({ children }) {
  return <StaffAppShell>{children}</StaffAppShell>;
}
