'use client';

/**
 * Página de login alinhada ao novo visual gamificado do painel.
 */
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { ZkContainer } from '@/components/zekai-ui/ZkContainer';
import { ZkPage } from '@/components/zekai-ui/ZkPage';
import useUserStore from '../../store/userStore';
import ValidatedField from '../../components/ui/ValidatedField';
import Button from '../../components/ui/Button';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, hydrateFromStorage, hydrated } = useUserStore();
  const [form, setForm] = useState({ identifier: '', senha: '', rememberMe: false });
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ identifier: false, senha: false });
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
    <ZkPage>
      <ZkContainer className="flex min-h-dvh flex-col items-center justify-center py-10 lg:py-16">
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
          <section className="flex-1 space-y-4 text-base-content">
            <div className="flex flex-col gap-3 lg:gap-4">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-base-300/60 bg-base-200/60 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-base-content/70">
                <ShieldCheck size={13} className="text-primary" /> Portal autenticado
              </span>
              <div className="space-y-3">
                <h1 className="text-[clamp(1.6rem,2.3vw,2.4rem)] font-semibold text-base-content">BJJ Academy</h1>
                <p className="max-w-prose text-sm text-base-content/70 md:text-base">
                  Acesse o painel progressivo da academia, acompanhe graduações, presenças e mantenha os cadastros sempre atualizados.
                </p>
              </div>
              <ul className="hidden space-y-2 text-sm text-base-content/70 lg:block">
                <li>• Login por e-mail ou usuário (case-insensitive)</li>
                <li>• Perfis aluno e staff já configurados para o piloto</li>
                <li>• Fluxos de convite, cadastro público e reset documentados</li>
              </ul>
            </div>
          </section>

          <section className="w-full max-w-md">
            <div className="card w-full border border-base-300/60 bg-base-200/60 shadow-xl backdrop-blur">
              <div className="card-body space-y-4">
                <header className="space-y-1 text-center">
                  <h2 className="text-lg font-semibold text-base-content">Entrar</h2>
                  <p className="text-sm text-base-content/70">Use suas credenciais para acessar o painel.</p>
                </header>
                <form className="space-y-3.5" onSubmit={handleSubmit}>
                  <ValidatedField
                    name="identifier"
                    type="text"
                    label="E-mail ou usuário"
                    placeholder="voce@bjj.academy ou seu usuário"
                    value={form.identifier}
                    onChange={handleChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, identifier: true }))}
                    helper="Login aceita e-mail ou username (case-insensitive)"
                    error={!form.identifier && touched.identifier ? 'Informe e-mail ou usuário' : ''}
                    success={form.identifier && !error ? 'Formato válido' : ''}
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
                    helper="Mínimo 10 caracteres; senha piloto: BJJ@pilot2025"
                    error={!form.senha && touched.senha ? 'Informe a senha' : ''}
                    success={form.senha && !error ? 'Ok' : ''}
                    required
                  />
                  <div className="flex items-center justify-between text-sm text-base-content/80">
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
                    <a href="/esqueci-senha" className="text-primary hover:text-primary/80">
                      Esqueci minha senha
                    </a>
                  </div>
                  {error && <p className="text-sm text-error">{error}</p>}
                  <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
                    {isSubmitting ? 'Entrando...' : 'Acessar painel'} {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight size={15} />}
                  </Button>

                  <div className="flex items-center gap-3 text-xs text-base-content/70">
                    <span className="h-px flex-1 bg-base-300" aria-hidden />
                    <span className="text-base-content/70">ou continue com</span>
                    <span className="h-px flex-1 bg-base-300" aria-hidden />
                  </div>

                  <div className="flex flex-col items-center gap-3 text-sm sm:flex-row sm:items-center sm:justify-center sm:gap-3">
                    <div className="flex w-full flex-col items-stretch sm:max-w-[260px]">
                      <button
                        type="button"
                        className="btn btn-outline w-full flex items-center justify-center gap-2"
                        aria-disabled="true"
                        disabled
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[15px] font-semibold text-[#4285F4]">G</span>
                        Google
                      </button>
                      <p className="mt-1 text-center text-xs text-base-content/60">Em breve</p>
                    </div>
                  </div>
                </form>
                <div className="space-y-3 text-center text-sm text-base-content/80">
                  <p className="text-xs text-base-content/60">Use um e-mail ou usuário habilitado no piloto e a senha padrão para acessar.</p>
                  <div className="flex flex-col gap-1 text-xs">
                    <p>
                      Não tem conta?{' '}
                      <a href="/cadastro" className="text-primary hover:text-primary/80">
                        Cadastre-se
                      </a>
                    </p>
                    <p>
                      Recebeu um convite?{' '}
                      <a href="/acesso-convite" className="text-primary hover:text-primary/80">
                        Primeiro acesso
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </ZkContainer>
    </ZkPage>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-gradient-to-br from-black via-black to-[#1a0000]" aria-busy="true" />}>
      <LoginContent />
    </Suspense>
  );
}
