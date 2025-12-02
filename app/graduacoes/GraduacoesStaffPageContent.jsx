'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Award, Clock3, Filter, Medal, ShieldCheck } from 'lucide-react';

import { BjjBeltStrip } from '@/components/bjj/BjjBeltStrip';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import MinimalTabs from '@/components/ui/Tabs';
import GraduacoesHistoricoView from '@/components/graduacoes/GraduacoesHistoricoView';
import GraduacoesProximasView from '@/components/graduacoes/GraduacoesProximasView';
import { getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils';
import { useGraduacoesProfessorView } from '@/hooks/useGraduacoesProfessorView';
import { normalizeFaixaSlug } from '@/lib/alunoStats';
import { updateGraduacao } from '@/services/graduacoesService';
import { useAlunosStore } from '@/store/alunosStore';
import { useGraduacoesStore } from '@/store/graduacoesStore';
import { useCurrentStaff } from '@/hooks/useCurrentStaff';

const STATUS_OPTIONS = ['Planejado', 'Em progresso', 'Em avaliação', 'Pronto para avaliar', 'Concluído'];

const TIPO_OPTIONS = ['Faixa', 'Grau'];

export function GraduacoesStaffPageContent({ forcedView }) {
  const router = useRouter();
  const pathname = usePathname();
  const { staff } = useCurrentStaff();
  const graduacoesRaw = useGraduacoesStore((state) => state.graduacoes);
  const alunos = useAlunosStore((state) => state.alunos);
  const { graduacoes, alunoLookup, faixasDisponiveis } = useGraduacoesProfessorView();

  const [buscaNome, setBuscaNome] = useState('');
  const [faixaFiltro, setFaixaFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [periodoFiltro, setPeriodoFiltro] = useState(30);
  const activeView = useMemo(() => {
    if (forcedView) return forcedView;
    if (pathname?.includes('/graduacoes/historico')) return 'historico';
    if (pathname?.includes('/graduacoes/proximas')) return 'proximas';
    return 'proximas';
  }, [forcedView, pathname]);

  // Se o aluno já atingiu a meta manualmente (ex.: faixa ou grau ajustado via edição),
  // sincronizamos o status da graduação e aplicamos os efeitos colaterais centrais
  // (atualizar histórico e recomputar dados do aluno) para manter todas as telas alinhadas.
  useEffect(() => {
    const concluenciasPendentes = graduacoes.filter((item) => {
      const original = graduacoesRaw.find((g) => g.id === item.id);
      return item.status === 'Concluído' && original?.status !== 'Concluído';
    });

    if (!concluenciasPendentes.length) return;

    concluenciasPendentes.forEach((graduacao) => {
      updateGraduacao(graduacao.id, {
        status: 'Concluído',
        dataConclusao: graduacao.dataConclusao || new Date().toISOString().split('T')[0]
      });
    });
  }, [graduacoes, graduacoesRaw]);

  const graduacoesFiltradas = useMemo(() => {
    const limiteMs = periodoFiltro ? periodoFiltro * 24 * 60 * 60 * 1000 : null;
    const agora = Date.now();

    return graduacoes.filter((item) => {
      const nomeMatch = buscaNome
        ? item.alunoNome?.toLowerCase().includes(buscaNome.toLowerCase()) ||
          alunoLookup[item.alunoId]?.nomeCompleto?.toLowerCase().includes(buscaNome.toLowerCase())
        : true;
      const faixaMatch = faixaFiltro ? [item.faixaSlugAtual, item.proximaFaixaSlug].includes(faixaFiltro) : true;
      const statusMatch = statusFiltro ? item.status === statusFiltro : true;
      const tipoMatch = tipoFiltro ? item.tipo === tipoFiltro : true;
      const dataMs = item.dataPrevista ? new Date(item.dataPrevista).getTime() : NaN;
      const periodoMatch = limiteMs
        ? Number.isFinite(dataMs) && Math.abs(dataMs - agora) <= limiteMs
        : true;
      const semDataPermitido = !limiteMs && !item.dataPrevista;

      return nomeMatch && faixaMatch && statusMatch && tipoMatch && (periodoMatch || semDataPermitido);
    });
  }, [alunoLookup, buscaNome, faixaFiltro, graduacoes, statusFiltro, tipoFiltro, periodoFiltro]);

  const graduacoesPendentes = useMemo(
    () => graduacoesFiltradas.filter((item) => item.status !== 'Concluído'),
    [graduacoesFiltradas]
  );

  const historico = useMemo(() => {
    const entries = alunos.flatMap((aluno) =>
      (aluno.historicoGraduacoes || []).map((item) => ({
        ...item,
        alunoId: aluno.id,
        alunoNome: aluno.nome,
        faixaSlug: item.faixaSlug || item.faixa,
        faixa: item.faixa || item.faixaSlug || aluno.faixa,
        grau: item.grau ?? item.grauAtual ?? null
      }))
    );

    const concluidas = graduacoes
      .filter((item) => item.status === 'Concluído')
      .map((item) => ({
        id: item.id,
        alunoId: item.alunoId,
        alunoNome: item.alunoNome,
        faixaSlug: item.proximaFaixaSlug || item.faixaSlugAtual,
        faixa: item.proximaFaixa || item.faixaAtual,
        grau: item.tipo === 'Grau' ? item.grauAlvo ?? item.grauAtual ?? null : null,
        tipo: item.tipo,
        data: item.dataConclusao ?? item.previsao,
        descricao:
          item.tipo === 'Faixa'
            ? `${item.faixaAtual} → ${item.proximaFaixa}`
            : `${item.grauAlvo ?? item.grauAtual ?? ''}º grau em ${item.faixaAtual}`,
        instrutor: item.instrutor
      }));

    const dedup = new Map();
    [...entries, ...concluidas].forEach((item) => {
      const key = item.id || `${item.alunoId}-${item.tipo}-${item.faixaSlug}-${item.grau}-${item.data}`;
      dedup.set(key, item);
    });

    const limiteMs = periodoFiltro ? Date.now() - periodoFiltro * 24 * 60 * 60 * 1000 : null;

    return Array.from(dedup.values())
      .filter((item) => {
        const nomeMatch = buscaNome ? item.alunoNome?.toLowerCase().includes(buscaNome.toLowerCase()) : true;
        const faixaMatch = faixaFiltro ? normalizeFaixaSlug(item.faixaSlug) === faixaFiltro : true;
        const dataMs = item.data ? new Date(item.data).getTime() : NaN;
        const dentroDaJanela = limiteMs ? Number.isFinite(dataMs) && dataMs >= limiteMs : true;
        return nomeMatch && faixaMatch && dentroDaJanela;
      })
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [alunos, buscaNome, faixaFiltro, graduacoes, periodoFiltro]);

  const cards = useMemo(() => {
    const pendentes = graduacoes.filter((g) => g.status !== 'Concluído');
    const concluidas = graduacoes.filter((g) => g.status === 'Concluído');
    const proximas = [...pendentes].sort(
      (a, b) => new Date(a.dataPrevista || a.previsao || '').getTime() - new Date(b.dataPrevista || b.previsao || '').getTime()
    );
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
        description: proxima?.dataPrevista || proxima?.previsao
          ? new Date(proxima.dataPrevista || proxima.previsao).toLocaleDateString('pt-BR')
          : 'Sem data definida',
        belt: faixaConfig,
        grau: proxima?.tipo === 'Grau' ? proxima?.grauAtual ?? 0 : proxima?.grauAlvo ?? null,
        tipo: proximaTipo
      }
    ];
  }, [graduacoes]);

  const handleStatusChange = async (graduacao, status) => {
    const dataConclusao = status === 'Concluído' ? new Date().toISOString().split('T')[0] : graduacao.dataConclusao;
    await updateGraduacao(graduacao.id, { status, dataConclusao });
  };

  const handleViewChange = (nextView) => {
    const target = nextView === 'historico' ? '/graduacoes/historico' : '/graduacoes/proximas';
    router.push(target);
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="grid w-full gap-3 sm:grid-cols-2 lg:max-w-3xl lg:grid-cols-4">
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
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.12em] text-bjj-gray-200/70">
            Período:
            <div className="flex flex-wrap gap-2">
              {[0, 30, 60, 90].map((dias) => (
                <button
                  key={dias}
                  type="button"
                  onClick={() => setPeriodoFiltro(dias)}
                  className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                    periodoFiltro === dias
                      ? 'border-bjj-red bg-bjj-red/10 text-bjj-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)]'
                      : 'border-bjj-gray-800/70 bg-bjj-gray-900/50 text-bjj-gray-200 hover:border-bjj-gray-700'
                  }`}
                >
                  {dias === 0 ? 'Todos' : `${dias}d`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="card space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-bjj-gray-200/70">
          <ShieldCheck size={14} /> Visão de graduações
        </div>

        <MinimalTabs
          items={[
            { id: 'proximas', label: 'Próximas graduações' },
            { id: 'historico', label: 'Histórico recente' }
          ]}
          activeId={activeView}
          onChange={handleViewChange}
        />

        {activeView === 'proximas' && (
          <GraduacoesProximasView
            graduacoesPendentes={graduacoesPendentes}
            alunoLookup={alunoLookup}
            onStatusChange={handleStatusChange}
          />
        )}

        {activeView === 'historico' && <GraduacoesHistoricoView historico={historico} periodoFiltro={periodoFiltro} />}
      </section>
    </div>
  );
}
