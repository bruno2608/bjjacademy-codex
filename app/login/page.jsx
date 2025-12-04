'use client';

/**
 * Página de login alinhada ao novo visual gamificado do painel.
 */
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
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
    <main className="relative min-h-screen bg-bjj-black text-bjj-white overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-bjj-gray-900 via-bjj-black to-bjj-black" aria-hidden />
      <div className="absolute right-[-18%] top-[-12%] h-[26rem] w-[26rem] rounded-full bg-bjj-red/10 blur-3xl" aria-hidden />
      <div className="absolute left-[-12%] bottom-[-18%] h-72 w-72 rounded-full bg-bjj-gray-800/40 blur-3xl" aria-hidden />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start px-4 pt-8 pb-12 sm:px-8 lg:grid lg:min-h-screen lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
        <section className="relative mb-6 space-y-4 lg:mb-0 lg:max-w-2xl">
          <div className="flex flex-col gap-3 lg:gap-4">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-bjj-gray-800/80 bg-bjj-gray-900/70 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-bjj-gray-200/70">
              <ShieldCheck size={13} className="text-bjj-red" /> Portal autenticado
            </span>
            <div className="space-y-2 lg:space-y-3.5">
              <h1 className="text-3xl font-semibold lg:text-4xl">BJJ Academy</h1>
              <p className="text-sm text-bjj-gray-200/80 lg:text-base">
                <span className="hidden lg:inline">
                  Acesse o painel progressivo da academia, acompanhe graduações, presenças e mantenha os cadastros sempre atualizados.
                </span>
                <span className="inline lg:hidden">
                  Acesse o painel da academia, acompanhe graduações e presenças em tempo real.
                </span>
              </p>
            </div>
            <ul className="hidden space-y-2 text-sm text-bjj-gray-200/70 lg:block">
              <li>• Login por e-mail ou usuário (case-insensitive)</li>
              <li>• Perfis aluno e staff já configurados para o piloto</li>
              <li>• Fluxos de convite, cadastro público e reset documentados</li>
            </ul>
          </div>
        </section>

        <section className="relative w-full max-w-md rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/80 p-6 shadow-[0_18px_35px_-18px_rgba(0,0,0,0.5)] sm:p-7 lg:ml-auto">
          <header className="mb-5 space-y-1 text-center">
            <h2 className="text-xl font-semibold">Entrar</h2>
            <p className="text-sm text-bjj-gray-200/70">Use suas credenciais para acessar o painel.</p>
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
            <div className="flex items-center justify-between text-sm text-bjj-gray-200/80">
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
              <a href="/esqueci-senha" className="text-bjj-red hover:text-bjj-red/80">
                Esqueci minha senha
              </a>
            </div>
            {error && <p className="text-sm text-bjj-red">{error}</p>}
            <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Acessar painel'} {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight size={15} />}
            </Button>

            <div className="flex items-center gap-3 text-xs text-bjj-gray-200/70">
              <span className="h-px flex-1 bg-bjj-gray-800" aria-hidden />
              <span className="text-bjj-gray-300/70">ou continue com</span>
              <span className="h-px flex-1 bg-bjj-gray-800" aria-hidden />
            </div>

            <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-start sm:gap-3">
              <div className="flex w-full flex-col items-stretch sm:max-w-[260px]">
                <button
                  type="button"
                  className="w-full h-11 rounded-full border border-neutral-700 bg-white text-neutral-900 flex items-center justify-center gap-2 text-sm font-medium hover:bg-neutral-100 transition-colors opacity-70 cursor-not-allowed"
                  aria-disabled="true"
                  // TODO: integrar OAuth Google
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[15px] font-semibold text-[#4285F4]">G</span>
                  Google
                </button>
                <p className="mt-1 text-xs text-neutral-400 text-center">Em breve</p>
              </div>
            </div>
          </form>
          <div className="mt-5 space-y-3 text-center text-sm text-bjj-gray-200/80">
            <p className="text-xs text-bjj-gray-200/60">Use um e-mail ou usuário habilitado no piloto e a senha padrão para acessar.</p>
            <div className="flex flex-col gap-1 text-xs">
              <p>
                Não tem conta?{' '}
                <a href="/cadastro" className="text-bjj-red hover:text-bjj-red/80">
                  Cadastre-se
                </a>
              </p>
              <p>
                Recebeu um convite?{' '}
                <a href="/acesso-convite" className="text-bjj-red hover:text-bjj-red/80">
                  Primeiro acesso
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bjj-black" aria-busy="true" />}> 
      <LoginContent />
    </Suspense>
  );
}
