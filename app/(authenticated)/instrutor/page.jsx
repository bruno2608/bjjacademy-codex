import Link from 'next/link';
import { BarChart3, CalendarCheck, FileText, ChevronRight } from 'lucide-react';

const cards = [
  {
    title: 'Histórico de presenças',
    description: 'Acompanhe check-ins, pendências e aprovações do dia.',
    href: '/instrutor/historico-presencas',
    icon: CalendarCheck
  },
  {
    title: 'Documentos do aluno',
    description: 'Compartilhe termos e registros acadêmicos com os alunos.',
    href: '/instrutor/documentos',
    icon: FileText
  },
  {
    title: 'Relatórios',
    description: 'Visão consolidada de métricas e exportações futuras.',
    href: '/relatorios',
    icon: BarChart3
  }
];

export const metadata = {
  title: 'Área do Instrutor'
};

export default function InstrutorIndex() {
  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/70 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-300/70">Área do instrutor</p>
        <h1 className="mt-2 text-2xl font-semibold text-bjj-white">Acesso rápido</h1>
        <p className="mt-1 text-sm text-bjj-gray-200/80">
          Centralizamos os atalhos de histórico, documentos e relatórios para facilitar o fluxo diário do
          instrutor.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-5 transition hover:-translate-y-0.5 hover:border-bjj-red/70 hover:bg-bjj-gray-900"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-bjj-gray-800/80 bg-bjj-gray-900 text-bjj-gray-100 shadow-inner group-hover:border-bjj-red/60 group-hover:text-bjj-white">
                  <Icon size={20} />
                </span>
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold text-bjj-white">{card.title}</h2>
                  <p className="mt-1 text-sm text-bjj-gray-300/80">{card.description}</p>
                </div>
                <ChevronRight className="ml-auto mt-1 text-bjj-gray-500 transition group-hover:translate-x-1 group-hover:text-bjj-white" size={18} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
