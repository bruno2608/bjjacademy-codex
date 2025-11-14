/**
 * Landing page redireciona usuários para a tela de login.
 * Mantém o foco em autenticação antes de acessar áreas protegidas.
 */
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/login');
}
