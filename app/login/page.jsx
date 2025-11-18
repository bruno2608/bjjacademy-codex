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

  return (
    <div className="min-h-screen bg-bjj-black text-bjj-white">
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-12 sm:px-12 lg:flex-row lg:items-center lg:gap-16">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-bjj-gray-900 via-bjj-black to-bjj-black" aria-hidden />
        <div className="absolute right-[-20%] top-[-10%] h-96 w-96 rounded-full bg-bjj-red/10 blur-3xl" aria-hidden />
        <div className="absolute left-[-10%] bottom-[-20%] h-72 w-72 rounded-full bg-bjj-gray-800/40 blur-3xl" aria-hidden />

        <section className="relative max-w-xl space-y-5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-bjj-gray-800/80 bg-bjj-gray-900/70 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-bjj-gray-200/70">
            <ShieldCheck size={13} className="text-bjj-red" /> Portal do instrutor
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
            <fieldset className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3 text-xs text-bjj-gray-200/70">
              <legend className="px-2 text-[11px] uppercase tracking-[0.2em] text-bjj-gray-200/60">
                Perfis de acesso (mock)
              </legend>
              <p className="mb-2 text-[11px] text-bjj-gray-200/60">
                Marque ao menos um papel para simular as permissões do usuário.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_ROLES.map((role) => {
                  const checked = selectedRoles.includes(role);
                  return (
                    <label
                      key={role}
                      className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-[11px] transition ${
                        checked
                          ? 'border-bjj-red/70 bg-bjj-red/20 text-bjj-white'
                          : 'border-bjj-gray-800 bg-bjj-gray-900/60 hover:border-bjj-gray-700 hover:text-bjj-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-3 w-3 accent-bjj-red"
                        checked={checked}
                        onChange={() => toggleRole(role)}
                      />
                      {ROLE_LABELS[role] || role.toUpperCase()}
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <Button type="submit" className="w-full justify-center">
              Acessar painel <ArrowRight size={15} />
            </Button>
          </form>
          <p className="mt-5 text-center text-xs text-bjj-gray-200/60">
            Este ambiente usa autenticação mock para fins de prototipagem.
          </p>
        </section>
      </div>
    </div>
  );
}
