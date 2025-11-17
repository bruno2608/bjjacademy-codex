import Link from 'next/link';
import { navigationItems } from '../../lib/navigation';

/**
 * Página hub das configurações administrativas com links para as subseções.
 */

const configNode = navigationItems.find((item) => item.path === '/configuracoes');
const sections = configNode?.children ?? [];

export const metadata = {
  title: 'Configurações da Academia · BJJ Academy'
};

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-200/60">Painel administrativo</p>
        <h1 className="mt-2 text-xl font-semibold text-bjj-white">Configurações da Academia</h1>
        <p className="mt-2 max-w-2xl text-sm text-bjj-gray-200/70">
          Ajuste regras de graduação, organize a grade de treinos e mantenha os tipos de sessão sempre alinhados à rotina da equipe.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.path}
              href={section.path}
              className="group rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-5 transition hover:border-bjj-red/60 hover:bg-bjj-red/10"
            >
              <div className="flex items-center gap-3 text-bjj-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/70 text-bjj-gray-200/80 group-hover:border-bjj-red/50 group-hover:text-bjj-white">
                  {Icon ? <Icon size={18} /> : null}
                </span>
                <div>
                  <h2 className="text-base font-semibold">{section.title}</h2>
                  <p className="text-xs text-bjj-gray-200/70">Gerencie parâmetros essenciais deste módulo.</p>
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
