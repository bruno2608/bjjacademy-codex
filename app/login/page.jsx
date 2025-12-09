'use client';

/**
 * Página de login alinhada ao novo visual gamificado do painel.
 */
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { ZkContainer } from '@/components/zekai-ui/ZkContainer';
import { ZkThemeDebug } from '@/components/ZkThemeDebug';
import { ZAlert } from '@/app/z-ui/_components/ZAlert';
import { SocialLoginButtons } from './SocialLoginButtons';
import useUserStore from '../../store/userStore';

const DEFAULT_AFTER_LOGIN_PATH = '/home';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, hydrateFromStorage, hydrated } = useUserStore();
  const [form, setForm] = useState({ identifier: '', senha: '', rememberMe: false });
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ identifier: false, senha: false });
  const [isSubmitting, setIsSubmitting] = useState(false); // simple loading flag to reuse in other async flows
  const hasGlobalError = Boolean(error);

  const identifierError = !form.identifier && touched.identifier ? 'Informe e-mail ou usuário.' : '';
  const senhaError = !form.senha && touched.senha ? 'Informe a senha.' : '';
  const identifierHasError = Boolean(identifierError || hasGlobalError);
  const senhaHasError = Boolean(senhaError || hasGlobalError);

  useEffect(() => {
    if (!hydrated) {
      hydrateFromStorage();
    }
  }, [hydrateFromStorage, hydrated]);

  useEffect(() => {
    if (!hydrated || !user) return;

    const redirectParam = searchParams.get('redirect');
    const isInternalRedirect = redirectParam?.startsWith('/') && !redirectParam.startsWith('//');

    if (isInternalRedirect) {
      router.replace(redirectParam);
      return;
    }

    router.replace(DEFAULT_AFTER_LOGIN_PATH);
  }, [hydrated, router, searchParams, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'rememberMe' ? event.target.checked : value;
    setForm((prev) => ({ ...prev, [name]: nextValue }));
    setError('');
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

  // Reusable async submit pattern: validate, set loading, handle feedback, reset in finally.
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.identifier || !form.senha) {
      setError('Informe e-mail/usuário e senha.');
      setTouched({ identifier: true, senha: true });
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const authUser = await login({ identifier: form.identifier, senha: form.senha, rememberMe: form.rememberMe });
      if (!authUser) throw new Error('CREDENCIAIS_INVALIDAS');

      const redirectParam = searchParams.get('redirect');
      const isInternalRedirect = redirectParam?.startsWith('/') && !redirectParam.startsWith('//');

      if (isInternalRedirect) {
        router.push(redirectParam);
      } else {
        router.push(DEFAULT_AFTER_LOGIN_PATH);
      }
    } catch (err) {
      setTouched({ identifier: true, senha: true });
      if (err instanceof Error) {
        if (err.message === 'USUARIO_NAO_HABILITADO_PILOTO') {
          setError('Procure o administrador da academia.');
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
        <section className="flex flex-col gap-4 lg:pr-6 center">
          <span className="badge badge-outline w-fit border-base-200 text-[0.65rem] font-semibold uppercase tracking-[0.25em]">
            <span className="flex items-center gap-1.5 text-xs">
              <ShieldCheck size={14} className="text-center text-primary" /> Portal autenticado
            </span>
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold lg:text-5xl">BJJ Academy</h1>
          </div>
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
                    aria-invalid={identifierHasError}
                    disabled={isSubmitting}
                    className={`input input-bordered w-full text-sm transition-colors ${identifierHasError ? 'input-error' : ''}`}
                    required
                  />
                  {identifierError && (
                    <p className="text-xs text-error">{identifierError}</p>
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
                    placeholder="********"
                    value={form.senha}
                    onChange={handleChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, senha: true }))}
                    aria-invalid={senhaHasError}
                    disabled={isSubmitting}
                    className={`input input-bordered w-full text-sm transition-colors ${senhaHasError ? 'input-error' : ''}`}
                    required
                  />
                  {senhaError && (
                    <p className="text-xs text-error">{senhaError}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-base-content/80">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={form.rememberMe}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="checkbox checkbox-sm checkbox-primary"
                    />
                    Lembrar de mim
                  </label>
                  <a href="/esqueci-senha" className="text-xs font-semibold link link-primary">
                    Esqueci minha senha
                  </a>
                </div>

                {error && (
                  <ZAlert
                    variant="error"
                    tone="inline"
                    icon="mdi:lock-outline"
                    title={error || 'E-mail/usuário ou senha inválidos.'}
                    className="!rounded-2xl !border-error/30 !bg-error !text-error-content !shadow-lg"
                  >
                    Verifique seus dados e tente novamente.
                  </ZAlert>
                )}

                <button type="submit" className="w-full btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <span className="loading loading-spinner loading-sm" aria-hidden="true" />
                      Acessando painel...
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center gap-2">
                      Acessar painel
                      <ArrowRight size={15} />
                    </span>
                  )}
                </button>

                <div className="divider text-[0.7rem] uppercase text-base-content/60">ou</div>

                <SocialLoginButtons />
              </form>
              <div className="space-y-3 text-sm text-center text-base-content/80">
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
                <ZAlert
                  variant="warning"
                  tone="banner"
                  title="Ambiente de piloto"
                  className="text-left"
                >
                  Use as credenciais de teste fornecidas para acessar o painel.
                  Não utilize dados reais de alunos.
                </ZAlert>
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
