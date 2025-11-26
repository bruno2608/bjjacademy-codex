'use client';

import { useMemo, useState } from 'react';
import { Award, Clock3, Filter, Medal, ShieldCheck, UserRound } from 'lucide-react';

import { BjjBeltStrip } from '@/components/bjj/BjjBeltStrip';
import GraduationList from '@/components/graduacoes/GraduationList';
import GraduationTimeline from '@/components/graduacoes/GraduationTimeline';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { normalizeFaixaSlug } from '@/lib/alunoStats';
import { getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils';
import { updateGraduacao } from '@/services/graduacoesService';
import { useAlunosStore } from '@/store/alunosStore';
import { useGraduacoesStore } from '@/store/graduacoesStore';
import { useCurrentStaff } from '@/hooks/useCurrentStaff';

const STATUS_OPTIONS = ['Planejado', 'Em progresso', 'Em avaliação', 'Pronto para avaliar', 'Concluído'];

const TIPO_OPTIONS = ['Faixa', 'Grau'];

export default function GraduacoesStaffPage() {
  const { staff } = useCurrentStaff();
  const graduacoes = useGraduacoesStore((state) => state.graduacoes);
  const alunos = useAlunosStore((state) => state.alunos);

  const [buscaNome, setBuscaNome] = useState('');
  const [faixaFiltro, setFaixaFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');

  const alunoLookup = useMemo(
    () =>
      Object.fromEntries(
        alunos.map((aluno) => [
          aluno.id,
          {
            ...aluno,
            faixaSlug: normalizeFaixaSlug(aluno.faixaSlug ?? aluno.faixa),
            nomeCompleto: aluno.nomeCompleto || aluno.nome
          }
        ])
      ),
    [alunos]
  );

  const graduacoesEnriquecidas = useMemo(
    () =>
      graduacoes.map((graduacao) => {
        const aluno = alunoLookup[graduacao.alunoId];
        const faixaSlugAtual = normalizeFaixaSlug(aluno?.faixaSlug ?? graduacao.faixaAtual);
        const proximaFaixaSlug = normalizeFaixaSlug(graduacao.proximaFaixa ?? aluno?.faixaSlug ?? faixaSlugAtual);

        return {
          ...graduacao,
          alunoNome: aluno?.nome || graduacao.alunoNome,
          faixaSlugAtual,
          proximaFaixaSlug,
          faixaAtual: aluno?.faixa || graduacao.faixaAtual,
          mesesRestantes: Number(graduacao.mesesRestantes ?? 0)
        };
      }),
    [alunoLookup, graduacoes]
  );

  const faixasDisponiveis = useMemo(() => {
    const slugs = new Set(
      graduacoesEnriquecidas.flatMap((item) => [item.faixaSlugAtual, item.proximaFaixaSlug].filter(Boolean))
    );
    return Array.from(slugs).filter(Boolean);
  }, [graduacoesEnriquecidas]);

  const graduacoesFiltradas = useMemo(() => {
    return graduacoesEnriquecidas.filter((item) => {
      const nomeMatch = buscaNome
        ? item.alunoNome?.toLowerCase().includes(buscaNome.toLowerCase()) ||
          alunoLookup[item.alunoId]?.nomeCompleto?.toLowerCase().includes(buscaNome.toLowerCase())
        : true;
      const faixaMatch = faixaFiltro ? [item.faixaSlugAtual, item.proximaFaixaSlug].includes(faixaFiltro) : true;
      const statusMatch = statusFiltro ? item.status === statusFiltro : true;
      const tipoMatch = tipoFiltro ? item.tipo === tipoFiltro : true;
      return nomeMatch && faixaMatch && statusMatch && tipoMatch;
    });
  }, [alunoLookup, buscaNome, faixaFiltro, graduacoesEnriquecidas, statusFiltro, tipoFiltro]);

  const historico = useMemo(() => {
    const entries = alunos.flatMap((aluno) =>
      (aluno.historicoGraduacoes || []).map((item) => ({
        ...item,
        alunoId: aluno.id,
        alunoNome: aluno.nome,
        faixaSlug: normalizeFaixaSlug(item.faixaSlug || item.faixa),
        faixa: item.faixa || item.faixaSlug || aluno.faixa,
        grau: item.grau ?? item.grauAtual ?? null
      }))
    );

    return entries
      .filter((item) => {
        const nomeMatch = buscaNome ? item.alunoNome?.toLowerCase().includes(buscaNome.toLowerCase()) : true;
        const faixaMatch = faixaFiltro ? normalizeFaixaSlug(item.faixaSlug) === faixaFiltro : true;
        return nomeMatch && faixaMatch;
      })
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [alunos, buscaNome, faixaFiltro]);

  const cards = useMemo(() => {
    const pendentes = graduacoesEnriquecidas.filter((g) => g.status !== 'Concluído');
    const concluidas = graduacoesEnriquecidas.filter((g) => g.status === 'Concluído');
    const proximas = [...pendentes].sort((a, b) => new Date(a.previsao).getTime() - new Date(b.previsao).getTime());
    const proxima = proximas[0];
    const faixaConfig = proxima?.proximaFaixaSlug ? getFaixaConfigBySlug(proxima.proximaFaixaSlug) : undefined;
    const proximaTipo = proxima?.tipo ? proxima.tipo.toLowerCase() : null;

    return [
      {
        label: 'Pendentes',
        value: pendentes.length,
        icon: Clock3,
        description: 'Graduações em andamento ou aguardando avaliação.'
      },
      {
        label: 'Concluídas',
        value: concluidas.length,
        icon: Medal,
        description: 'Promoções finalizadas registradas no histórico.'
      },
      {
        label: 'Próxima cerimônia',
        value: proxima?.alunoNome || '—',
        icon: Award,
        description: proxima?.previsao
          ? new Date(proxima.previsao).toLocaleDateString('pt-BR')
          : 'Sem data definida',
        belt: faixaConfig,
        grau: proxima?.grauAlvo ?? null,
        tipo: proximaTipo
      }
    ];
  }, [graduacoesEnriquecidas]);

  const handleStatusChange = async (graduacao, status) => {
    await updateGraduacao(graduacao.id, { status });
  };

  return (
    <div className="space-y-8">
      <header className="card space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-200/60">Progresso de faixas</p>
        <h1 className="text-2xl font-semibold text-bjj-white">Graduações</h1>
        <p className="max-w-3xl text-sm text-bjj-gray-200/70">
          Acompanhe promoções planejadas, ajuste status e consulte o histórico oficial de graduações. Todos os dados
          vêm das stores centralizadas de alunos e graduações — prontos para trocar mocks por API apenas alterando os services.
        </p>
        {staff?.nome && (
          <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-200/70">
            Responsável: {staff.nome} · {staff.roles?.join(', ') || 'Staff'}
          </p>
        )}
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.label}
              className="flex flex-col gap-3 rounded-2xl border border-bjj-gray-800/70 bg-gradient-to-br from-bjj-gray-900 via-bjj-black to-bjj-black p-5"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-200/70">{card.label}</p>
                  <h3 className="text-2xl font-semibold text-bjj-white">{card.value}</h3>
                  <p className="text-xs text-bjj-gray-200/70">{card.description}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-bjj-gray-900/70 text-bjj-red">
                  {Icon ? <Icon size={18} /> : null}
                </span>
              </div>
              {card.belt ? (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-3">
                  <BjjBeltStrip config={card.belt} grauAtual={card.grau} className="w-40" />
                  <div className="space-y-1 text-xs text-bjj-gray-200/80">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-bjj-gray-200/60">Próxima cerimônia</p>
                    <p className="font-semibold text-bjj-white">{card.belt.nome}</p>
                    <p>
                      {card.tipo ? `Tipo: ${card.tipo}` : null}
                      {card.grau ? ` · Grau alvo: ${card.grau}º` : ''}
                    </p>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </section>

      <section className="card space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-bjj-gray-200/70">
          <Filter size={14} /> Filtros
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            placeholder="Buscar aluno"
            value={buscaNome}
            onChange={(event) => setBuscaNome(event.target.value)}
            className="w-full"
          />
          <Select value={faixaFiltro} onChange={(event) => setFaixaFiltro(event.target.value)} className="w-full">
            <option value="">Faixa</option>
            {faixasDisponiveis.map((slug) => {
              const config = slug ? getFaixaConfigBySlug(slug) : null;
              return (
                <option key={slug} value={slug}>
                  {config?.nome || slug}
                </option>
              );
            })}
          </Select>
          <Select value={tipoFiltro} onChange={(event) => setTipoFiltro(event.target.value)} className="w-full">
            <option value="">Tipo</option>
            {TIPO_OPTIONS.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </Select>
          <Select value={statusFiltro} onChange={(event) => setStatusFiltro(event.target.value)} className="w-full">
            <option value="">Status</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_minmax(320px,1fr)]">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-bjj-gray-200/70">
            <ShieldCheck size={14} /> Próximas graduações
          </div>
          <GraduationList
            graduacoes={graduacoesFiltradas}
            onStatusChange={handleStatusChange}
            alunoLookup={alunoLookup}
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-bjj-gray-200/70">
            <UserRound size={14} /> Histórico recente
          </div>
          <GraduationTimeline itens={historico} />
        </div>
      </section>
    </div>
  );
}
