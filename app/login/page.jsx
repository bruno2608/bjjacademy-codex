'use client';

/**
 * Página de login alinhada ao novo visual gamificado do painel.
 */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import useUserStore from '../../store/userStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, token } = useUserStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('bjj_token');
    if (savedToken && !token) {
      login({ email: 'instrutor@bjj.academy' });
      router.replace('/dashboard');
    }
  }, [login, router, token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      setError('Informe e-mail e senha.');
      return;
    }
    setError('');
    login({ email: form.email });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-bjj-black text-bjj-white">
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-12 sm:px-12 lg:flex-row lg:items-center lg:gap-16">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-bjj-gray-900 via-bjj-black to-bjj-black" aria-hidden />
        <div className="absolute right-[-20%] top-[-10%] h-96 w-96 rounded-full bg-bjj-red/10 blur-3xl" aria-hidden />
        <div className="absolute left-[-10%] bottom-[-20%] h-72 w-72 rounded-full bg-bjj-gray-800/40 blur-3xl" aria-hidden />

        <section className="relative max-w-xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-bjj-gray-800/80 bg-bjj-gray-900/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-bjj-gray-200/70">
            <ShieldCheck size={14} className="text-bjj-red" /> Portal do instrutor
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold">BJJ Academy</h1>
            <p className="text-base text-bjj-gray-200/80">
              Acesse o painel progressivo da academia, acompanhe graduações, presenças e mantenha os cadastros sempre atualizados.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-bjj-gray-200/70">
            <li>• Experiência PWA pronta para instalação</li>
            <li>• Dashboard gamificado com métricas em tempo real</li>
            <li>• Gestão completa de alunos, presenças e graduações</li>
          </ul>
        </section>

        <section className="relative mt-10 w-full max-w-md rounded-3xl border border-bjj-gray-800/70 bg-bjj-gray-900/80 p-8 shadow-[0_25px_50px_-20px_rgba(0,0,0,0.45)] lg:mt-0">
          <header className="mb-6 space-y-1 text-center">
            <h2 className="text-2xl font-semibold">Entrar</h2>
            <p className="text-sm text-bjj-gray-200/70">Use suas credenciais para acessar o painel.</p>
          </header>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-200/60">E-mail</label>
              <input
                name="email"
                type="email"
                placeholder="voce@bjj.academy"
                value={form.email}
                onChange={handleChange}
                className="input-field mt-2"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-200/60">Senha</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="input-field mt-2"
                required
              />
            </div>
            {error && <p className="text-sm text-bjj-red">{error}</p>}
            <button type="submit" className="btn-primary w-full justify-center">
              Acessar painel <ArrowRight size={16} />
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-bjj-gray-200/60">
            Este ambiente usa autenticação mock para fins de prototipagem.
          </p>
        </section>
      </div>
    </div>
  );
}
