'use client';

/**
 * Página de login alinhada ao novo visual gamificado do painel.
 */
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { ZkContainer } from '@/components/zekai-ui/ZkContainer';
import { ZkThemeDebug } from '@/components/ZkThemeDebug';
import { ZkAlert } from '@/app/z-ui/_components/ui/ZkAlert';
import { SocialLoginButtons } from './SocialLoginButtons';
import useUserStore from '../../store/userStore';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, hydrateFromStorage, hydrated } = useUserStore();
  const [form, setForm] = useState({ identifier: '', senha: '', rememberMe: false });
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ identifier: false, senha: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const identifierError = !form.identifier && touched.identifier ? 'Informe e-mail ou usuário.' : '';
  const senhaError = !form.senha && touched.senha ? 'Informe a senha.' : '';

  useEffect(() => {
    if (!hydrated) {
      hydrateFromStorage();
    }
  }, [hydrateFromStorage, hydrated]);

  useEffect(() => {
    if (!hydrated || !user) return;
    const isStaff = user.roles.some((role) => role !== 'ALUNO');
    const isAlunoOnly = user.roles.length === 1 && user.roles[0] === 'ALUNO';

    const redirectParam = searchParams.get('redirect');
    const isInternalRedirect = redirectParam?.startsWith('/') && !redirectParam.startsWith('//');

    if (isInternalRedirect) {
      router.replace(redirectParam);
      return;
    }

    if (isStaff) {
      router.replace('/dashboard');
    } else if (isAlunoOnly) {
      router.replace('/dashboard-aluno');
    }
  }, [hydrated, router, searchParams, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'rememberMe' ? event.target.checked : value;
    setForm((prev) => ({ ...prev, [name]: nextValue }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'zdark');
    try {
      localStorage.setItem('zekai-ui-theme', 'zdark');
    } catch (err) {
      // ignore storage errors (e.g., SSR or blocked storage)
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.identifier || !form.senha) {
      setError('Informe e-mail/usuário e senha.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const authUser = await login({ identifier: form.identifier, senha: form.senha, rememberMe: form.rememberMe });
      if (!authUser) throw new Error('CREDENCIAIS_INVALIDAS');

      const isStaff = authUser.roles.some((role) => role !== 'ALUNO');
      const isAlunoOnly = authUser.roles.length === 1 && authUser.roles[0] === 'ALUNO';
      const redirectParam = searchParams.get('redirect');
      const isInternalRedirect = redirectParam?.startsWith('/') && !redirectParam.startsWith('//');

      if (isInternalRedirect) {
        router.push(redirectParam);
      } else if (isStaff) {
        router.push('/dashboard');
      } else if (isAlunoOnly) {
        router.push('/dashboard-aluno');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'USUARIO_NAO_HABILITADO_PILOTO') {
          setError('E-mail/usuário ou senha inválidos.');
        } else if (err.message === 'CREDENCIAIS_INVALIDAS') {
          setError('E-mail/usuário ou senha inválidos.');
        } else if (err.message === 'USUARIO_CONVITE_PENDENTE') {
          setError('Seu convite ainda não foi ativado. Conclua o primeiro acesso.');
        } else if (err.message === 'USUARIO_INATIVO') {
          setError('Usuário inativo. Procure o administrador da academia.');
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
    <main className="flex items-center justify-center min-h-screen bg-base-100 text-base-content">
      <ZkContainer className="grid w-full items-center gap-12 py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <section className="flex flex-col gap-4 lg:pr-6">
          <span className="badge badge-outline w-fit border-base-300 text-[0.65rem] font-semibold uppercase tracking-[0.25em]">
            <span className="flex items-center gap-1.5 text-xs">
              <ShieldCheck size={14} className="text-primary" /> Portal autenticado
            </span>
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold lg:text-5xl">BJJ Academy</h1>
            <p className="text-base max-w-prose text-base-content/80 lg:text-lg">
              Acesse o painel progressivo da academia, acompanhe graduações, presenças e mantenha os cadastros sempre atualizados.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-base-content/80 lg:max-w-xl">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
              <span>Login por e-mail ou usuário (case-insensitive).</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
              <span>Perfis aluno e staff já configurados para o piloto.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
              <span>Fluxos de convite, cadastro público e reset documentados.</span>
            </li>
          </ul>
        </section>

        <section className="w-full max-w-md justify-self-center lg:justify-self-end">
          <div className="w-full shadow-2xl zk-card">
            <div className="space-y-6">
              <header className="space-y-1 text-center">
                <h2 className="text-xl font-semibold">Entrar</h2>
                <p className="text-sm text-base-content/70">Use suas credenciais para acessar o painel.</p>
              </header>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2 form-control">
                  <label className="pb-0 label">
                    <span className="label-text text-xs font-semibold uppercase tracking-[0.18em] text-base-content/80">
                      E-mail ou usuário
                    </span>
                  </label>
                  <input
                    name="identifier"
                    type="text"
                    placeholder="voce@bjj.academy ou seu usuário"
                    value={form.identifier}
                    onChange={handleChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, identifier: true }))}
                    className={`input input-bordered w-full text-sm ${identifierError ? 'input-error' : ''}`}
                    required
                  />
                  {identifierError ? (
                    <p className="text-xs text-error">{identifierError}</p>
                  ) : (
                    <p className="text-[0.68rem] text-base-content/60">Login aceita e-mail ou username (case-insensitive).</p>
                  )}
                </div>

                <div className="space-y-2 form-control">
                  <label className="pb-0 label">
                    <span className="label-text text-xs font-semibold uppercase tracking-[0.18em] text-base-content/80">
                      Senha
                    </span>
                  </label>
                  <input
                    name="senha"
                    type="password"
                    placeholder="••••••••"
                    value={form.senha}
                    onChange={handleChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, senha: true }))}
                    className={`input input-bordered w-full text-sm ${senhaError ? 'input-error' : ''}`}
                    required
                  />
                  {senhaError ? (
                    <p className="text-xs text-error">{senhaError}</p>
                  ) : (
                    <p className="text-[0.68rem] text-base-content/60">Mínimo 10 caracteres; senha piloto: BJJ@pilot2025</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-base-content/80">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={form.rememberMe}
                      onChange={handleChange}
                      className="checkbox checkbox-sm checkbox-primary"
                    />
                    Lembrar de mim nesta sessão
                  </label>
                  <a href="/esqueci-senha" className="text-xs font-semibold link link-primary">
                    Esqueci minha senha
                  </a>
                </div>

                {error && (
                  <ZkAlert variant="error" className="text-sm">
                    {error}
                  </ZkAlert>
                )}

                <button type="submit" className="justify-center w-full gap-2 btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Entrando...' : 'Acessar painel'}
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight size={15} />}
                </button>

                <div className="divider text-[0.7rem] uppercase text-base-content/60">ou continue com</div>

                <SocialLoginButtons />
              </form>
              <div className="space-y-3 text-sm text-center text-base-content/80">
                <p className="text-[0.68rem] text-base-content/60">
                  Use um e-mail ou usuário habilitado no piloto e a senha padrão para acessar.
                </p>
                <div className="flex flex-col gap-1 text-xs">
                  <p>
                    Não tem conta?{' '}
                    <a href="/cadastro" className="font-semibold link link-primary">
                      Cadastre-se
                    </a>
                  </p>
                  <p>
                    Recebeu um convite?{' '}
                    <a href="/acesso-convite" className="font-semibold link link-primary">
                      Primeiro acesso
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ZkContainer>
      <ZkThemeDebug />
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-base-100" aria-busy="true" />}>
      <LoginContent />
    </Suspense>
  );
}
