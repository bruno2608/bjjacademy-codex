'use client';

/**
 * Página de login alinhada ao novo visual gamificado do painel.
 */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import useUserStore from '../../store/userStore';
import ValidatedField from '../../components/ui/ValidatedField';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, hydrateFromStorage, hydrated } = useUserStore();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ email: false, senha: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      hydrateFromStorage();
    }
  }, [hydrateFromStorage, hydrated]);

  useEffect(() => {
    if (!hydrated || !user) return;
    const isStaff = user.roles.some((role) => role !== 'ALUNO');
    const isAlunoOnly = user.roles.length === 1 && user.roles[0] === 'ALUNO';

    if (isStaff) {
      router.replace('/dashboard');
    } else if (isAlunoOnly) {
      router.replace('/dashboard-aluno');
    }
  }, [hydrated, router, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.senha) {
      setError('Informe e-mail e senha.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const authUser = await login({ email: form.email, senha: form.senha });
      if (!authUser) throw new Error('CREDENCIAIS_INVALIDAS');

      const isStaff = authUser.roles.some((role) => role !== 'ALUNO');
      const isAlunoOnly = authUser.roles.length === 1 && authUser.roles[0] === 'ALUNO';

      if (isStaff) {
        router.push('/dashboard');
      } else if (isAlunoOnly) {
        router.push('/dashboard-aluno');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'USUARIO_NAO_HABILITADO_PILOTO') {
          setError('Este usuário ainda não está habilitado para o piloto. Fale com o professor/administrador.');
        } else if (err.message === 'CREDENCIAIS_INVALIDAS') {
          setError('E-mail ou senha inválidos.');
        } else {
          setError('Não foi possível realizar o login. Tente novamente.');
        }
      } else {
        setError('Não foi possível realizar o login. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bjj-black text-bjj-white">
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-12 sm:px-12 lg:flex-row lg:items-center lg:gap-16">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-bjj-gray-900 via-bjj-black to-bjj-black" aria-hidden />
        <div className="absolute right-[-20%] top-[-10%] h-96 w-96 rounded-full bg-bjj-red/10 blur-3xl" aria-hidden />
        <div className="absolute left-[-10%] bottom-[-20%] h-72 w-72 rounded-full bg-bjj-gray-800/40 blur-3xl" aria-hidden />

        <section className="relative max-w-xl space-y-5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-bjj-gray-800/80 bg-bjj-gray-900/70 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-bjj-gray-200/70">
            <ShieldCheck className={`${iconSizes.xs} ${iconColors.default}`} /> Portal do instrutor
          </span>
          <div className="space-y-3.5">
            <h1 className="text-3xl font-semibold">BJJ Academy</h1>
            <p className="text-sm text-bjj-gray-200/80">
              Acesse o painel progressivo da academia, acompanhe graduações, presenças e mantenha os cadastros sempre atualizados.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-bjj-gray-200/70">
            <li>• Experiência PWA pronta para instalação</li>
            <li>• Dashboard gamificado com métricas em tempo real</li>
            <li>• Gestão completa de alunos, presenças e graduações</li>
          </ul>
        </section>

        <section className="relative mt-10 w-full max-w-md rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/80 p-6 shadow-[0_18px_35px_-18px_rgba(0,0,0,0.5)] lg:mt-0">
          <header className="mb-5 space-y-1 text-center">
            <h2 className="text-xl font-semibold">Entrar</h2>
            <p className="text-sm text-bjj-gray-200/70">Use suas credenciais para acessar o painel.</p>
          </header>
          <form className="space-y-3.5" onSubmit={handleSubmit}>
            <ValidatedField
              name="email"
              type="email"
              label="E-mail"
              placeholder="voce@bjj.academy"
              value={form.email}
              onChange={handleChange}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              helper="Use seu e-mail institucional"
              error={!form.email && touched.email ? 'E-mail é obrigatório' : ''}
              success={form.email && !error ? 'Formato válido' : ''}
              required
            />
            <ValidatedField
              name="senha"
              type="password"
              label="Senha"
              placeholder="••••••••"
              value={form.senha}
              onChange={handleChange}
              onBlur={() => setTouched((prev) => ({ ...prev, senha: true }))}
              helper="Use a senha compartilhada com a equipe"
              error={!form.senha && touched.senha ? 'Informe a senha' : ''}
              success={form.senha && !error ? 'Ok' : ''}
              required
            />
            {error && <p className="text-sm text-bjj-red">{error}</p>}
            <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Acessar painel'} <ArrowRight size={15} />
            </Button>
          </form>
          <p className="mt-5 text-center text-xs text-bjj-gray-200/60">
            Use um e-mail habilitado no piloto e a senha padrão para acessar.
          </p>
        </section>
      </div>
    </div>
  );
}
