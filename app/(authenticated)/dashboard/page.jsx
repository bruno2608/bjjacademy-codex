'use client';

/**
 * Dashboard exibe métricas principais com alternância entre visões
 * gerais, de presenças e de graduações. Assim o operador consegue
 * focar em cada módulo antes de acessar as telas específicas.
 */
import { useEffect, useMemo, useState } from 'react';
import {
  Users,
  Award,
  CalendarCheck,
  Medal,
  Activity,
  Flame,
  Clock3,
  CalendarPlus
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import PageHero from '../../../components/ui/PageHero';
import LoadingState from '../../../components/ui/LoadingState';
import { getAlunos } from '../../../services/alunosService';
import { getPresencas } from '../../../services/presencasService';
import { getGraduacoes } from '../../../services/graduacoesService';
import { calculateNextStep } from '../../../lib/graduationRules';

const VIEW_OPTIONS = [
  { id: 'geral', label: 'Visão geral', helper: 'Panorama da academia' },
  { id: 'presencas', label: 'Presenças', helper: 'Engajamento diário' },
  { id: 'graduacoes', label: 'Graduações', helper: 'Planejamento e evolução' }
];

const formatDate = (value) => {
  if (!value) return 'Sem data';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

const calcularMediaEntreGraduacoes = (historico = []) => {
  if (!historico || historico.length < 2) return null;
  const ordenadas = [...historico].sort((a, b) => new Date(a.data) - new Date(b.data));
  let acumulado = 0;
  let contagem = 0;
  for (let i = 1; i < ordenadas.length; i += 1) {
    const anterior = new Date(ordenadas[i - 1].data);
    const atual = new Date(ordenadas[i].data);
    if (Number.isNaN(anterior.getTime()) || Number.isNaN(atual.getTime())) continue;
    const diff = Math.abs((atual.getFullYear() - anterior.getFullYear()) * 12 + (atual.getMonth() - anterior.getMonth()));
    acumulado += diff;
    contagem += 1;
  }
  if (contagem === 0) return null;
  return acumulado / contagem;
};

export default function DashboardPage() {
  const [activeView, setActiveView] = useState('geral');
  const [alunos, setAlunos] = useState([]);
  const [presencas, setPresencas] = useState([]);
  const [graduacoes, setGraduacoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function carregarDados() {
      try {
        const [listaAlunos, listaPresencas, listaGraduacoes] = await Promise.all([
          getAlunos(),
          getPresencas(),
          getGraduacoes()
        ]);
        if (!active) {
          return;
        }
        setAlunos(listaAlunos);
        setPresencas(listaPresencas);
        setGraduacoes(listaGraduacoes);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    carregarDados();
    return () => {
      active = false;
    };
  }, []);

  const hoje = useMemo(() => new Date().toISOString().split('T')[0], []);

  const totalAlunos = alunos.length || 1;
  const ativos = alunos.filter((aluno) => aluno.status === 'Ativo').length;
  const inativos = alunos.filter((aluno) => aluno.status !== 'Ativo').length;
  const taxaAtivos = Math.round((ativos / totalAlunos) * 100);

  const avaliacoes = Math.round(alunos.length * 0.5 + 5);
  const presencasSemana = presencas.filter((item) => {
    const data = new Date(item.data);
    const hojeData = new Date();
    const diff = Math.abs(data - hojeData) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;
  const graduacoesPlanejadas = graduacoes.filter((item) => item.status !== 'Concluído').length;

  const alunosAtivos = useMemo(() => alunos.filter((aluno) => aluno.status === 'Ativo'), [alunos]);

  const registrosDoDia = useMemo(() => {
    const mapa = new Map();
    presencas
      .filter((item) => item.data === hoje)
      .forEach((item) => {
        mapa.set(item.alunoId, item);
      });

    return alunosAtivos.map((aluno) => {
      const existente = mapa.get(aluno.id);
      if (existente) {
        return existente;
      }
      return {
        id: null,
        alunoId: aluno.id,
        alunoNome: aluno.nome,
        faixa: aluno.faixa,
        graus: aluno.graus,
        data: hoje,
        status: 'Ausente',
        hora: null
      };
    });
  }, [alunosAtivos, hoje, presencas]);

  const presentesDia = registrosDoDia.filter((item) => item.status === 'Presente').length;
  const ausentesDia = registrosDoDia.length - presentesDia;
  const atrasosDia = registrosDoDia.filter(
    (item) => item.status === 'Presente' && item.hora && item.hora > '10:00'
  ).length;
  const taxaDia = Math.round((presentesDia / (registrosDoDia.length || 1)) * 100);

  const diasAtivos = useMemo(() => {
    const conjunto = new Set(presencas.map((item) => item.data));
    return conjunto.size;
  }, [presencas]);

  const rankingPresenca = useMemo(() => {
    const mapa = new Map();
    presencas.forEach((registro) => {
      const atual = mapa.get(registro.alunoId) || {
        id: registro.alunoId,
        nome: registro.alunoNome,
        faixa: registro.faixa,
        graus: registro.graus,
        presencas: 0,
        faltas: 0
      };

      if (registro.status === 'Presente') {
        atual.presencas += 1;
      } else {
        atual.faltas += 1;
      }

      mapa.set(registro.alunoId, atual);
    });

    return Array.from(mapa.values()).sort((a, b) => b.presencas - a.presencas);
  }, [presencas]);

  const evolucoes = useMemo(
    () =>
      alunos
        .map((aluno) => ({ aluno, recomendacao: calculateNextStep(aluno) }))
        .filter((item) => Boolean(item.recomendacao)),
    [alunos]
  );

  const grausPendentes = evolucoes.filter((item) => item.recomendacao.tipo === 'Grau').length;
  const faixasPendentes = evolucoes.filter((item) => item.recomendacao.tipo === 'Faixa').length;

  const proximasCerimonias = graduacoes
    .filter((item) => item.status !== 'Concluído')
    .sort((a, b) => new Date(a.previsao) - new Date(b.previsao));

  const evolucoesEmDestaque = evolucoes.slice(0, 5);

  const mediaGraduacoesGeral = useMemo(() => {
    const medias = alunos
      .map((aluno) => calcularMediaEntreGraduacoes(aluno.historicoGraduacoes))
      .filter((valor) => Number.isFinite(valor));
    if (!medias.length) return null;
    const soma = medias.reduce((acc, valor) => acc + valor, 0);
    return soma / medias.length;
  }, [alunos]);

  const heroContent = useMemo(() => {
    if (activeView === 'presencas') {
      return {
        badge: 'Engajamento',
        title: 'Indicadores de frequência',
        subtitle: 'Acompanhe o comportamento diário antes de abrir a tela de presenças.',
        stats: [
          {
            label: 'Taxa de hoje',
            value: `${taxaDia}%`,
            helper: `${presentesDia} presenças · ${ausentesDia} faltas`
          },
          {
            label: 'Dias monitorados',
            value: diasAtivos,
            helper: 'Período recente com registros ativos'
          },
          {
            label: 'Aluno destaque',
            value: rankingPresenca[0]?.nome || 'Aguardando registros',
            helper: rankingPresenca[0]
              ? `${rankingPresenca[0].presencas} presenças registradas`
              : 'Sem ranking disponível'
          }
        ]
      };
    }

    if (activeView === 'graduacoes') {
      return {
        badge: 'Planejamento',
        title: 'Visão estratégica de graduações',
        subtitle: 'Priorize próximos graus, trocas de faixa e eventos planejados.',
        stats: [
          {
            label: 'Recomendações ativas',
            value: evolucoes.length,
            helper: `${grausPendentes} graus · ${faixasPendentes} faixas`
          },
          {
            label: 'Cerimônias planejadas',
            value: proximasCerimonias.length,
            helper: `${graduacoesPlanejadas} eventos totais`
          },
          {
            label: 'Tempo médio',
            value: mediaGraduacoesGeral
              ? `${Math.round(mediaGraduacoesGeral)} meses`
              : 'Sem histórico',
            helper: 'Entre graduações registradas'
          }
        ]
      };
    }

    return {
      badge: 'Visão geral',
      title: 'Painel principal da BJJ Academy',
      subtitle: 'Monitore os módulos críticos e escolha a visão detalhada desejada.',
      stats: [
        {
          label: 'Ativos na academia',
          value: ativos,
          helper: `${taxaAtivos}% da base (${inativos} em pausa)`
        },
        {
          label: 'Presenças na semana',
          value: presencasSemana,
          helper: `${presencas.length} registros no mês`
        },
        {
          label: 'Graduações a preparar',
          value: graduacoesPlanejadas,
          helper: `${faixasPendentes} faixas · ${grausPendentes} graus`
        },
        {
          label: 'Avaliações concluídas',
          value: avaliacoes,
          helper: 'Histórico estimado com base nos alunos ativos'
        }
      ]
    };
  }, [
    activeView,
    ativos,
    taxaAtivos,
    inativos,
    presencasSemana,
    presencas.length,
    graduacoesPlanejadas,
    faixasPendentes,
    grausPendentes,
    avaliacoes,
    taxaDia,
    presentesDia,
    ausentesDia,
    diasAtivos,
    rankingPresenca,
    evolucoes.length,
    proximasCerimonias.length,
    mediaGraduacoesGeral
  ]);

  if (isLoading) {
    return <LoadingState title="Carregando panorama" message="Conectando módulos de alunos, presenças e graduações." />;
  }

  return (
    <div className="space-y-6">
      <PageHero
        badge={heroContent.badge}
        title={heroContent.title}
        subtitle={heroContent.subtitle}
        stats={heroContent.stats}
      />

      <div className="flex flex-wrap gap-2">
        {VIEW_OPTIONS.map((option) => {
          const isActive = option.id === activeView;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setActiveView(option.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition ${
                isActive
                  ? 'border-bjj-red bg-bjj-red text-bjj-white shadow-focus'
                  : 'border-bjj-gray-800/80 bg-bjj-gray-900/60 text-bjj-gray-200 hover:border-bjj-red/50'
              }`}
            >
              {option.label}
              <span className="hidden text-[11px] text-bjj-gray-200/70 md:inline">{option.helper}</span>
            </button>
          );
        })}
      </div>

      {activeView === 'geral' && (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Card
              title="Alunos ativos"
              value={ativos}
              icon={Users}
              description="Mantenha cadastros atualizados para decisões rápidas."
            />
            <Card
              title="Graus em revisão"
              value={grausPendentes}
              icon={Award}
              description="Sugestões de próximos graus com base nas regras oficiais."
            />
            <Card
              title="Faixas em preparação"
              value={faixasPendentes}
              icon={Medal}
              description="Alunos prontos para avançar de faixa nos próximos meses."
            />
            <Card
              title="Presenças confirmadas"
              value={presencasSemana}
              icon={CalendarCheck}
              description="Entradas registradas nos últimos 7 dias de treino."
            />
          </div>

          <section className="grid grid-cols-1 gap-3 xl:grid-cols-[2fr,1fr]">
            <article className="card space-y-4">
              <header className="space-y-1.5">
                <h2 className="text-lg font-semibold text-bjj-white">Radar rápido</h2>
                <p className="text-sm text-bjj-gray-200/70">
                  Visualize quem está mais próximo da próxima evolução e direcione feedback durante as aulas.
                </p>
              </header>
              {evolucoesEmDestaque.length === 0 ? (
                <p className="text-sm text-bjj-gray-200/70">Nenhuma recomendação pendente para as próximas semanas.</p>
              ) : (
                <ul className="space-y-3">
                  {evolucoesEmDestaque.slice(0, 3).map(({ aluno, recomendacao }) => (
                    <li
                      key={aluno.id}
                      className="flex flex-col gap-2 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-bjj-white">{aluno.nome}</p>
                        <p className="text-xs text-bjj-gray-200/70">{recomendacao.descricao}</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-bjj-gray-700 px-3 py-1 text-xs text-bjj-gray-200/80">
                        {recomendacao.tipo === 'Grau' ? 'Próximo grau' : 'Próxima faixa'}
                        <span className="text-bjj-red font-semibold">
                          {recomendacao.tipo === 'Grau' ? `${recomendacao.grauAlvo}º` : recomendacao.proximaFaixa}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <aside className="card space-y-4">
              <header className="space-y-1.5">
                <h2 className="text-lg font-semibold text-bjj-white">Agenda curta</h2>
                <p className="text-sm text-bjj-gray-200/70">Principais compromissos dos próximos treinos e graduações.</p>
              </header>
              {proximasCerimonias.length === 0 ? (
                <p className="text-sm text-bjj-gray-200/70">Nenhuma cerimônia planejada para os próximos meses.</p>
              ) : (
                <ul className="space-y-2.5">
                  {proximasCerimonias.slice(0, 3).map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-semibold text-bjj-white">{item.alunoNome}</p>
                        <p className="text-xs text-bjj-gray-200/70">
                          {item.faixaAtual} → {item.proximaFaixa}
                        </p>
                      </div>
                      <span className="text-[11px] text-bjj-gray-200/60">{formatDate(item.previsao)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </aside>
          </section>
        </>
      )}

      {activeView === 'presencas' && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Card
              title="Presenças confirmadas"
              value={presentesDia}
              icon={CalendarPlus}
              description="Confirmações registradas hoje, incluindo marcações rápidas."
            />
            <Card
              title="Faltas registradas"
              value={ausentesDia}
              icon={Clock3}
              description="Alunos aguardando check-in ou faltantes."
            />
            <Card
              title="Dias monitorados"
              value={diasAtivos}
              icon={CalendarCheck}
              description="Total de dias acompanhados recentemente."
            />
          </div>

          <article className="card space-y-4">
            <header className="space-y-1.5">
              <h2 className="text-lg font-semibold text-bjj-white">Resumo do dia</h2>
              <p className="text-sm text-bjj-gray-200/70">Distribuição rápida das presenças registradas até o momento.</p>
            </header>
            <div className="grid grid-cols-2 gap-3 text-sm text-bjj-gray-200/80 md:grid-cols-4">
              <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3">
                <p className="text-xs uppercase tracking-wide text-bjj-gray-200/60">Total de alunos</p>
                <p className="mt-1 text-xl font-semibold text-bjj-white">{registrosDoDia.length}</p>
              </div>
              <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3">
                <p className="text-xs uppercase tracking-wide text-bjj-gray-200/60">Presenças</p>
                <p className="mt-1 text-xl font-semibold text-bjj-white">{presentesDia}</p>
                <p className="text-[11px] text-bjj-gray-200/60">{taxaDia}% da turma</p>
              </div>
              <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3">
                <p className="text-xs uppercase tracking-wide text-bjj-gray-200/60">Faltas</p>
                <p className="mt-1 text-xl font-semibold text-bjj-white">{ausentesDia}</p>
                <p className="text-[11px] text-bjj-gray-200/60">Aguardando registro</p>
              </div>
              <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3">
                <p className="text-xs uppercase tracking-wide text-bjj-gray-200/60">Atrasos</p>
                <p className="mt-1 text-xl font-semibold text-bjj-white">{atrasosDia}</p>
                <p className="text-[11px] text-bjj-gray-200/60">Chegadas após 10h</p>
              </div>
            </div>
          </article>

          <section className="card space-y-4">
            <header className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-bjj-white">Ranking de presença</h2>
                <p className="text-sm text-bjj-gray-200/70">
                  Top alunos com maior engajamento acumulado nas últimas sessões registradas.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-bjj-gray-700 px-3 py-1 text-xs text-bjj-gray-200/70">
                <Flame size={13} className="text-bjj-red" /> {rankingPresenca.slice(0, 5).length} destaque(s)
              </span>
            </header>

            {rankingPresenca.length === 0 ? (
              <p className="text-sm text-bjj-gray-200/70">Nenhum registro de presença para exibir o ranking.</p>
            ) : (
              <ul className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
                {rankingPresenca.slice(0, 8).map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-2 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-bjj-white">{item.nome}</p>
                      <p className="text-xs text-bjj-gray-200/70">
                        {item.faixa} · {item.graus}º grau
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-bjj-gray-200/70">
                      <span className="font-semibold text-bjj-white">{item.presencas} presenças</span>
                      <span>{item.faltas} falta(s)</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </section>
      )}

      {activeView === 'graduacoes' && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Card
              title="Recomendações ativas"
              value={evolucoes.length}
              icon={Activity}
              description="Total de alunos com sugestão automática de próximo passo."
            />
            <Card
              title="Graus pendentes"
              value={grausPendentes}
              icon={Award}
              description="Quantidade de faixas com grau recomendado para os próximos treinos."
            />
            <Card
              title="Faixas pendentes"
              value={faixasPendentes}
              icon={Medal}
              description="Alunos que já cumprem o requisito de troca de faixa."
            />
          </div>

          <section className="grid grid-cols-1 gap-3 xl:grid-cols-[2fr,1fr]">
            <article className="card space-y-4">
              <header className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-bjj-white">Radar de evolução</h2>
                  <p className="text-sm text-bjj-gray-200/70">
                    Priorize quem está pronto para avançar: acompanhe próximos graus e trocas de faixa sugeridas.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-bjj-gray-700 px-3 py-1 text-xs text-bjj-gray-200/70">
                  <Activity size={13} className="text-bjj-red" /> {evolucoes.length} recomendação(ões)
                </span>
              </header>
              {evolucoes.length === 0 ? (
                <p className="text-sm text-bjj-gray-200/70">Nenhuma recomendação pendente para as próximas semanas.</p>
              ) : (
                <ul className="space-y-3">
                  {evolucoes.map(({ aluno, recomendacao }) => (
                    <li
                      key={aluno.id}
                      className="flex flex-col gap-2 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-bjj-white">{aluno.nome}</p>
                        <p className="text-xs text-bjj-gray-200/70">{recomendacao.descricao}</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-bjj-gray-700 px-3 py-1 text-xs text-bjj-gray-200/80">
                        {recomendacao.tipo === 'Grau' ? 'Próximo grau' : 'Próxima faixa'}
                        <span className="text-bjj-red font-semibold">
                          {recomendacao.tipo === 'Grau' ? `${recomendacao.grauAlvo}º` : recomendacao.proximaFaixa}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <aside className="card space-y-4">
              <header className="space-y-1.5">
                <h2 className="text-lg font-semibold text-bjj-white">Próximas cerimônias</h2>
                <p className="text-sm text-bjj-gray-200/70">
                  Organize o cronograma e alinhe expectativa com alunos e responsáveis.
                </p>
              </header>
              {proximasCerimonias.length === 0 ? (
                <p className="text-sm text-bjj-gray-200/70">Nenhuma cerimônia planejada para os próximos meses.</p>
              ) : (
                <ul className="space-y-2.5">
                  {proximasCerimonias.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-col gap-2 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-bjj-white">{item.alunoNome}</p>
                        <span className="text-[11px] text-bjj-gray-200/60">{formatDate(item.previsao)}</span>
                      </div>
                      <p className="text-xs text-bjj-gray-200/70">
                        {item.faixaAtual} → {item.proximaFaixa}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-xs text-bjj-gray-200/60">
                        <Flame size={13} className="text-bjj-red" /> {item.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </aside>
          </section>
        </section>
      )}
    </div>
  );
}
