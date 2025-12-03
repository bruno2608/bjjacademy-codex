import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Configurações da Academia · BJJ Academy'
};

export default function ConfiguracoesPage() {
  redirect('/configuracoes/graduacao');
}
