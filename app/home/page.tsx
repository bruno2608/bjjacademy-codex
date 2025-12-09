'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { Icon } from '@iconify/react';

import { HeroAlunoDashboard } from '@/app/dashboard/_components/HeroAlunoDashboard';
import { ZCard } from '@/app/z-ui/_components/ZCard';
import { useHeroAlunoDashboard } from '@/hooks/useHeroAlunoDashboard';

type Role = 'aluno' | 'professor' | 'admin';

export default function HomePage() {
  const heroData = useHeroAlunoDashboard();
  const role: Role = 'aluno';

  return (
    <main className="px-4 py-6 space-y-6 md:px-6">
      {heroData && <HeroAlunoDashboard data={heroData} />}
      <SecaoCardsPrincipais role={role} />
      <SecaoAcessoRapido role={role} />
    </main>
  );
}

type SecaoCardsPrincipaisProps = {
  role: Role;
};

export function SecaoCardsPrincipais({ role }: SecaoCardsPrincipaisProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-base-content/60">Cards principais</p>
          <h2 className="text-lg font-semibold">Painel resumido</h2>
          <p className="text-sm text-base-content/70">Os cards e metricas variam conforme o papel do usuario.</p>
        </div>
        <span className="badge badge-outline text-[11px] uppercase tracking-[0.2em]">{role}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ZCard padded className="h-full">
          <p className="text-sm text-base-content/70">Placeholder de card principal 1.</p>
        </ZCard>
        <ZCard padded className="h-full">
          <p className="text-sm text-base-content/70">Placeholder de card principal 2.</p>
        </ZCard>
      </div>
    </section>
  );
}

type SecaoAcessoRapidoProps = {
  role: Role;
};

type QuickAction = {
  id: string;
  label: string;
  href: string;
  icon: string;
  iconColorClass: string;
};

function QuickActionsGrid({ actions }: { actions: QuickAction[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {actions.map((action) => (
        <ZCard
          key={action.id}
          className="transition cursor-pointer hover:shadow-md hover:border-primary/60"
        >
          <Link
            href={action.href}
            className="flex flex-col items-center justify-center gap-2 py-4"
          >
            <Icon
              icon={action.icon}
              className={clsx('text-2xl', action.iconColorClass)}
            />
            <span className="text-xs font-medium text-center text-base-content/80">
              {action.label}
            </span>
          </Link>
        </ZCard>
      ))}
    </div>
  );
}

export function SecaoAcessoRapido({ role }: SecaoAcessoRapidoProps) {
  const staffActions: QuickAction[] = [
    { id: 'checkin', label: 'Marcar presencas', href: '/checkin', icon: 'mdi:qrcode-scan', iconColorClass: 'text-success' },
    { id: 'alunos', label: 'Gestao de alunos', href: '/alunos', icon: 'mdi:account-group-outline', iconColorClass: 'text-primary' },
    { id: 'graduacoes', label: 'Graduacoes', href: '/graduacoes', icon: 'mdi:medal-outline', iconColorClass: 'text-warning' },
    { id: 'historico', label: 'Historico', href: '/historico-presencas', icon: 'mdi:history', iconColorClass: 'text-purple-400' },
    { id: 'revisao', label: 'Revisao', href: '/presencas', icon: 'mdi:clipboard-text-clock-outline', iconColorClass: 'text-orange-400' },
    { id: 'horarios', label: 'Horarios', href: '#', icon: 'mdi:calendar-clock', iconColorClass: 'text-info' },
    { id: 'avisos', label: 'Avisos', href: '#', icon: 'mdi:bell-outline', iconColorClass: 'text-pink-400' },
    { id: 'totem', label: 'Modo Totem', href: '#', icon: 'mdi:monitor-dashboard', iconColorClass: 'text-primary' } // TODO: apontar rota do totem/check-in TV
  ];

  const alunoActions: QuickAction[] = [
    { id: 'checkin', label: 'Check-in', href: '/checkin', icon: 'mdi:qrcode-scan', iconColorClass: 'text-success' },
    { id: 'aulas', label: 'Aulas', href: '/treinos', icon: 'mdi:calendar-clock', iconColorClass: 'text-info' },
    { id: 'evolucao', label: 'Evolucao', href: '/evolucao', icon: 'mdi:medal-outline', iconColorClass: 'text-warning' },
    { id: 'avisos', label: 'Avisos', href: '#', icon: 'mdi:bell-outline', iconColorClass: 'text-pink-400' }
  ];

  const actions = role === 'aluno' ? alunoActions : staffActions;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-base-content/80">Acesso rapido</h2>
      <QuickActionsGrid actions={actions} />
    </section>
  );
}
