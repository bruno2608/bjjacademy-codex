'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { Icon } from '@iconify/react';

import { ZAlert } from '@/app/z-ui/_components/ZAlert';
import { ZCard } from '@/app/z-ui/_components/ZCard';
import { BjjBeltStrip } from '@/components/bjj/BjjBeltStrip';
import { getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils';

type Role = 'aluno' | 'professor' | 'admin';

export default function HomePage() {
  // TODO: puxar do store de auth depois
  const role: Role = 'aluno';
  const perfilCompleto = false;

  return (
    <main className="px-4 md:px-6 py-6 space-y-6">
      <HeroResumoUsuario role={role} perfilCompleto={perfilCompleto} />
      <SecaoCardsPrincipais role={role} />
      <SecaoAcessoRapido role={role} />
    </main>
  );
}

type HeroResumoUsuarioProps = {
  role: Role;
  perfilCompleto: boolean;
};

export function HeroResumoUsuario({ role, perfilCompleto }: HeroResumoUsuarioProps) {
  const nomeUsuario = 'Rafael Mendes'; // TODO: puxar da store
  const nomeAcademia = 'USGO Maceio';
  const faixaAtual = 'Roxa'; // TODO: plugar componente de faixa
  const treinosConcluidos = 18; // TODO: puxar de stats reais
  const faixaSlug = 'roxa'; // TODO: substituir pelo slug real da faixa do usuario (ex.: usuario.faixaAtualSlug)
  const faixaConfig = getFaixaConfigBySlug(faixaSlug);
  const grauAtual = 2; // TODO: substituir pelo grau atual do usuario
  const initials =
    nomeUsuario
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'US';

  const roleLabel = role === 'aluno' ? 'Aluno' : role === 'professor' ? 'Professor' : 'Administrador';

  const infoAluno = [
    { label: 'Academia', value: nomeAcademia },
    { label: 'Faixa atual', value: faixaAtual },
    { label: 'Treinos', value: `${treinosConcluidos} treinos` }
  ];

  const infoStaff = [
    { label: 'Academia', value: nomeAcademia },
    { label: 'Papel', value: roleLabel }
  ];

  return (
    <section className="space-y-4">
      <ZCard padded={false} className="p-4 md:p-6 space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-base-300 text-lg font-semibold text-base-content shadow-sm md:h-20 md:w-20">
              {initials}
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-base-content/60">Resumo do usuario</p>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold leading-tight text-base-content">{nomeUsuario}</h1>
                <p className="text-sm text-base-content/70">{nomeAcademia}</p>
              </div>

              {!perfilCompleto && (
                <ZAlert
                  variant="warning"
                  tone="banner"
                  title="Complete seu perfil para desbloquear sua evolucao"
                  className="text-sm"
                >
                  Falta preencher alguns dados importantes, como informacoes da sua faixa e perfil.
                  <button
                    type="button"
                    className="btn btn-xs btn-ghost ml-2"
                    onClick={() => console.log('TODO: redirecionar para /completar-perfil')}
                  >
                    Atualizar agora
                  </button>
                </ZAlert>
              )}
            </div>
          </div>

          {faixaConfig && (
            <div className="w-full md:w-[360px] lg:w-[420px]">
              <BjjBeltStrip config={faixaConfig} grauAtual={grauAtual} className="w-full" />
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {(role === 'aluno' ? infoAluno : infoStaff).map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-base-300/60 bg-base-100/80 p-3 shadow-sm"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-base-content/60">{item.label}</p>
              <p className="text-sm font-semibold text-base-content">{item.value}</p>
            </div>
          ))}
        </div>
      </ZCard>
    </section>
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
    <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
      {actions.map((action) => (
        <ZCard
          key={action.id}
          className="cursor-pointer transition hover:shadow-md hover:border-primary/60"
        >
          <Link
            href={action.href}
            className="flex flex-col items-center justify-center gap-2 py-4"
          >
            <Icon
              icon={action.icon}
              className={clsx('text-2xl', action.iconColorClass)}
            />
            <span className="text-xs font-medium text-base-content/80 text-center">
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

