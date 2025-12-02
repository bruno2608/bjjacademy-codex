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
import { ROLE_KEYS, normalizeRoles } from '../../config/roles';

const AVAILABLE_ROLES = [
  ROLE_KEYS.ti,
  ROLE_KEYS.admin,
  ROLE_KEYS.professor,
  ROLE_KEYS.instrutor,
  ROLE_KEYS.aluno
];
const ROLE_LABELS = {
  [ROLE_KEYS.ti]: 'TI',
  [ROLE_KEYS.admin]: 'ADMIN',
  [ROLE_KEYS.professor]: 'PROFESSOR',
  [ROLE_KEYS.instrutor]: 'INSTRUTOR',
  [ROLE_KEYS.aluno]: 'ALUNO'
};

export default function LoginPage() {
  const router = useRouter();
  const { login, token } = useUserStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [selectedRoles, setSelectedRoles] = useState([ROLE_KEYS.professor, ROLE_KEYS.instrutor]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let rolesParaLogin = selectedRoles;
    try {
      const storedRoles = window.localStorage.getItem('bjj_roles');
      if (storedRoles) {
        const parsed = normalizeRoles(JSON.parse(storedRoles));
        if (Array.isArray(parsed) && parsed.length) {
          rolesParaLogin = parsed;
          setSelectedRoles((prev) => {
            const sameLength = prev.length === parsed.length;
            const sameValues = sameLength && prev.every((role) => parsed.includes(role));
            return sameValues ? prev : parsed;
          });
        }
      }
    } catch (error) {
      console.warn('Não foi possível carregar os papéis salvos.', error);
    }

    const savedToken = window.localStorage.getItem('bjj_token');
    if (savedToken && !token) {
      login({ email: 'instrutor@bjj.academy', roles: rolesParaLogin });
      router.replace('/dashboard');
    }
  }, [login, router, selectedRoles, token]);

  const toggleRole = (role) => {
    setSelectedRoles((current) => {
      if (current.includes(role)) {
        const filtered = current.filter((item) => item !== role);
        return filtered.length ? filtered : current;
      }
      return [...current, role];
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      setError('Informe e-mail e senha.');
      return;
    }
    setError('');
    login({ email: form.email, roles: selectedRoles });
    router.push('/dashboard');
  };

  const handleDemoAccess = () => {
    login({ email: 'instrutor@bjj.academy', roles: selectedRoles });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bjj-black via-bjj-gray-950 to-bjj-red/30 text-bjj-white">
      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(225,6,0,0.12),transparent_40%),radial-gradient(circle_at_80%_0,rgba(255,255,255,0.04),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.03),transparent_30%)]" />
        </div>

        <div className="relative w-full max-w-6xl">
          <div className="overflow-hidden rounded-3xl border border-bjj-gray-900/70 bg-bjj-black/80 shadow-[0_25px_70px_-35px_rgba(0,0,0,0.7)] backdrop-blur-lg">
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
              <section className="flex flex-col justify-between gap-8 border-b border-bjj-gray-900/60 bg-gradient-to-b from-bjj-gray-950/80 via-bjj-black/70 to-bjj-gray-900/60 p-8 sm:p-10 lg:border-b-0 lg:border-r">
                <div className="space-y-6">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-bjj-gray-800/80 bg-bjj-gray-900/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-bjj-gray-200/70">
                    <ShieldCheck size={14} className="text-bjj-red" /> Portal do instrutor
                  </span>
                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-[0.24em] text-bjj-gray-300/60">Bem-vindo ao painel</p>
                    <h1 className="text-3xl font-semibold sm:text-4xl">BJJ Academy</h1>
                    <p className="text-sm text-bjj-gray-200/80 sm:text-base">
                      Acesse o painel progressivo da academia, acompanhe graduações, presenças e mantenha os cadastros sempre atualizados.
                    </p>
                  </div>
                  <ul className="space-y-2 rounded-2xl border border-bjj-gray-900/60 bg-bjj-gray-950/60 p-4 text-sm text-bjj-gray-200/80">
                    <li className="flex items-start gap-2">
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-bjj-red" />
                      <span>Experiência PWA pronta para instalação e uso mobile.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-bjj-red" />
                      <span>Dashboard gamificado com métricas em tempo real.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-bjj-red" />
                      <span>Gestão completa de alunos, presenças e graduações.</span>
                    </li>
                  </ul>
                </div>
                <div className="hidden text-xs text-bjj-gray-300/70 lg:block">
                  <p className="font-semibold text-bjj-gray-200">Acesso seguro e focado em performance.</p>
                  <p className="text-bjj-gray-300/70">Painel otimizado para professores, instrutores e times administrativos.</p>
                </div>
              </section>

              <section className="space-y-6 p-8 sm:p-10 lg:p-12">
                <header className="space-y-2 text-center lg:text-left">
                  <h2 className="text-2xl font-semibold sm:text-3xl">Entrar</h2>
                  <p className="text-sm text-bjj-gray-200/70">Use suas credenciais para acessar o painel.</p>
                </header>

                <form className="space-y-4" onSubmit={handleSubmit}>
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
                    name="password"
                    type="password"
                    label="Senha"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                    helper="Mínimo 6 caracteres"
                    error={!form.password && touched.password ? 'Informe a senha' : ''}
                    success={form.password && !error ? 'Ok' : ''}
                    required
                  />

                  {error && <p className="text-sm text-bjj-red">{error}</p>}

                  <fieldset className="rounded-2xl border border-bjj-gray-900/70 bg-bjj-gray-950/70 p-4 text-xs text-bjj-gray-200/70">
                    <legend className="px-2 text-[11px] uppercase tracking-[0.2em] text-bjj-gray-200/60">
                      Perfis de acesso (mock)
                    </legend>
                    <p className="mb-3 text-[11px] text-bjj-gray-200/60">
                      Marque ao menos um papel para simular as permissões do usuário.
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {AVAILABLE_ROLES.map((role) => {
                        const checked = selectedRoles.includes(role);
                        return (
                          <label
                            key={role}
                            className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[11px] transition ${
                              checked
                                ? 'border-bjj-red/70 bg-bjj-red/15 text-bjj-white'
                                : 'border-bjj-gray-800 bg-bjj-gray-900/60 hover:border-bjj-gray-700 hover:text-bjj-white'
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="h-3.5 w-3.5 accent-bjj-red"
                              checked={checked}
                              onChange={() => toggleRole(role)}
                            />
                            {ROLE_LABELS[role] || role.toUpperCase()}
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <Button type="submit" className="w-full justify-center text-sm sm:text-base">
                    Acessar painel <ArrowRight size={15} />
                  </Button>
                </form>

                <p className="text-center text-xs text-bjj-gray-200/60 lg:text-left">
                  Este ambiente usa autenticação mock para fins de prototipagem.
                </p>

                <div className="space-y-3 rounded-2xl border border-bjj-gray-900/70 bg-bjj-gray-950/70 p-5">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-bjj-white">Ainda não testou o painel?</h3>
                    <p className="text-sm text-bjj-gray-200/80">
                      Explore a experiência completa do instrutor em um ambiente de demonstração seguro e preparado para aulas.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full justify-center border border-bjj-red/50 bg-transparent text-sm text-bjj-white hover:border-bjj-red hover:bg-bjj-red/10"
                    onClick={handleDemoAccess}
                  >
                    Explorar painel do instrutor
                  </Button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
