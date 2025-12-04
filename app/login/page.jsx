'use client';

/**
 * Página de login alinhada ao novo visual gamificado do painel.
 */
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, ArrowRight, Apple, Loader2, Mail } from 'lucide-react';
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
    <div className="min-h-screen bg-bjj-black text-bjj-white">
      <div className="relative flex min-h-screen flex-col justify-start overflow-hidden px-6 py-12 sm:px-12 lg:flex-row lg:items-center lg:gap-16">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-bjj-gray-900 via-bjj-black to-bjj-black" aria-hidden />
        <div className="absolute right-[-20%] top-[-10%] h-96 w-96 rounded-full bg-bjj-red/10 blur-3xl" aria-hidden />
        <div className="absolute left-[-10%] bottom-[-20%] h-72 w-72 rounded-full bg-bjj-gray-800/40 blur-3xl" aria-hidden />

        <section className="relative max-w-xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-bjj-gray-800/80 bg-bjj-gray-900/70 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-bjj-gray-200/70">
            <ShieldCheck size={13} className="text-bjj-red" /> Portal autenticado
          </span>
          <div className="space-y-3.5">
            <h1 className="text-3xl font-semibold">BJJ Academy</h1>
            <p className="text-sm text-bjj-gray-200/80">
              Acesse o painel progressivo da academia, acompanhe graduações, presenças e mantenha os cadastros sempre atualizados.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-bjj-gray-200/70">
            <li>• Login por e-mail ou usuário (case-insensitive)</li>
            <li>• Perfis aluno e staff já configurados para o piloto</li>
            <li>• Fluxos de convite, cadastro público e reset documentados</li>
          </ul>
        </section>

        <section className="relative mt-8 w-full max-w-md rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/80 p-6 shadow-[0_18px_35px_-18px_rgba(0,0,0,0.5)] lg:mt-0">
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
            <div className="flex items-center gap-2 text-xs text-bjj-gray-200/70">
              <span className="h-px flex-1 bg-bjj-gray-800" aria-hidden />
              <span>ou continue com</span>
              <span className="h-px flex-1 bg-bjj-gray-800" aria-hidden />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button
                type="button"
                className="btn btn-outline btn-primary flex items-center justify-center gap-2 border-bjj-gray-700 bg-bjj-gray-900/60 text-bjj-gray-100"
                aria-disabled
              >
                <Mail size={16} /> Google
                <span className="text-[11px] text-bjj-gray-300/70">Em breve</span>
              </button>
              <button
                type="button"
                className="btn btn-outline flex items-center justify-center gap-2 border-bjj-gray-700 bg-bjj-gray-900/60 text-bjj-gray-100"
                aria-disabled
              >
                <Apple size={16} /> Apple
                <span className="text-[11px] text-bjj-gray-300/70">Em breve</span>
              </button>
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
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bjj-black" aria-busy="true" />}> 
      <LoginContent />
    </Suspense>
  );
}
