'use client';

/**
 * Dashboard exibe métricas principais com alternância entre visões
 * gerais, de presenças e de graduações. Assim o operador consegue
 * focar em cada módulo antes de acessar as telas específicas.
 */
import { useEffect, useMemo, useState } from 'react';
import StudentDashboard from '../../../components/dashboards/StudentDashboard';
import InstructorDashboard from '../../../components/dashboards/InstructorDashboard';
import useRole from '../../../hooks/useRole';
import {
  Users,
  Award,
  CalendarCheck,
  Medal,
  Activity,
  Flame,
  Clock3,
  UserPlus,
  UserMinus,
  Layers,
  PieChart,
  Cake
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import PageHero from '../../../components/ui/PageHero';
import LoadingState from '../../../components/ui/LoadingState';
import ToggleTag from '../../../components/ui/ToggleTag';
import Badge from '../../../components/ui/Badge';
import { getAlunos } from '../../../services/alunosService';
import { getPresencas } from '../../../services/presencasService';
import { getGraduacoes } from '../../../services/graduacoesService';
import { calculateNextStep } from '../../../lib/graduationRules';

const VIEW_OPTIONS = [
  { id: 'geral', label: 'Visão geral', helper: 'Panorama da academia' },
  { id: 'alunos', label: 'Alunos', helper: 'Cadastros e atenção' },
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

const differenceInDays = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  const hoje = new Date();
  const diffMs = hoje.getTime() - parsed.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

export default function DashboardPage() {
  const { roles } = useRole();
  const hasStudentOnly = roles.length === 1 && roles.includes('student');
  const isInstructor = roles.some((role) => ['instructor', 'teacher'].includes(role));

  if (hasStudentOnly) {
    return <StudentDashboard />;
  }

  if (isInstructor && !roles.includes('admin') && !roles.includes('ti')) {
    return <InstructorDashboard />;
  }

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
  const mesAtualLabel = useMemo(() => {
    const label = new Date().toLocaleString('pt-BR', { month: 'long' });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }, []);

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

  const aniversariantesDoMes = useMemo(() => {
    const hojeData = new Date();
    const mesAtual = hojeData.getMonth();
    const anoAtual = hojeData.getFullYear();

    return alunos
      .map((aluno) => {
        if (!aluno.dataNascimento) return null;
        const nascimento = new Date(aluno.dataNascimento);
        if (Number.isNaN(nascimento.getTime()) || nascimento.getMonth() !== mesAtual) return null;
        const dia = nascimento.getDate();
        const proximoAniversario = new Date(anoAtual, mesAtual, dia);
        return {
          id: aluno.id,
          nome: aluno.nome,
          faixa: aluno.faixa,
          graus: aluno.graus,
          status: aluno.status,
          dataLabel: proximoAniversario.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
          idade: Math.max(anoAtual - nascimento.getFullYear(), 0),
          dia
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.dia - b.dia);
  }, [alunos]);
  const aniversariantesDestaque = useMemo(() => aniversariantesDoMes.slice(0, 6), [aniversariantesDoMes]);
  const totalAniversariantesMes = aniversariantesDoMes.length;

  const registrosDoDia = useMemo(() => {
    const registros = presencas.filter((item) => item.data === hoje);
    const alunosComRegistro = new Set(registros.map((item) => item.alunoId));
    const placeholders = alunosAtivos
      .filter((aluno) => !alunosComRegistro.has(aluno.id))
      .map((aluno) => ({
        id: `placeholder-${aluno.id}`,
        alunoId: aluno.id,
        alunoNome: aluno.nome,
        faixa: aluno.faixa,
        graus: aluno.graus,
        data: hoje,
        status: 'Ausente',
        hora: null
      }));
    return [...registros, ...placeholders];
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
        .map((aluno) => ({ aluno, recomendacao: calculateNextStep(aluno, { presencas }) }))
        .filter((item) => Boolean(item.recomendacao)),
    [alunos, presencas]
  );

  const grausPendentes = evolucoes.filter((item) => item.recomendacao.tipo === 'Grau').length;
  const faixasPendentes = evolucoes.filter((item) => item.recomendacao.tipo === 'Faixa').length;

  const proximasCerimonias = graduacoes
    .filter((item) => item.status !== 'Concluído')
    .sort((a, b) => new Date(a.previsao) - new Date(b.previsao));

  const evolucoesEmDestaque = evolucoes.slice(0, 5);

  const novos30Dias = useMemo(
    () =>
      alunos
        .map((aluno) => ({ aluno, diasDesdeEntrada: differenceInDays(aluno.dataInicio) }))
        .filter((item) => item.diasDesdeEntrada !== null && item.diasDesdeEntrada <= 30)
        .sort((a, b) => a.diasDesdeEntrada - b.diasDesdeEntrada),
    [alunos]
  );

  const presencasUltimoMes = useMemo(() => {
    const corte = new Date();
    corte.setDate(corte.getDate() - 30);
    return presencas.filter((item) => {
      const data = new Date(item.data);
      return !Number.isNaN(data.getTime()) && data >= corte;
    });
  }, [presencas]);

  const frequenciaUltimoMes = useMemo(() => {
    const mapa = new Map();
    presencasUltimoMes.forEach((item) => {
      if (item.status !== 'Presente') return;
      mapa.set(item.alunoId, (mapa.get(item.alunoId) || 0) + 1);
    });
    return mapa;
  }, [presencasUltimoMes]);

  const alunosEmAtencao = useMemo(
    () =>
      alunosAtivos
        .map((aluno) => ({ aluno, presencasNoPeriodo: frequenciaUltimoMes.get(aluno.id) || 0 }))
        .filter((item) => item.presencasNoPeriodo <= 2)
        .sort((a, b) => a.presencasNoPeriodo - b.presencasNoPeriodo || a.aluno.nome.localeCompare(b.aluno.nome, 'pt-BR'))
        .slice(0, 6),
    [alunosAtivos, frequenciaUltimoMes]
  );

  const distribuicaoFaixas = useMemo(() => {
    const mapa = new Map();
    alunos.forEach((aluno) => {
      const faixa = aluno.faixa || 'Sem faixa';
      mapa.set(faixa, (mapa.get(faixa) || 0) + 1);
    });
    return Array.from(mapa.entries())
      .map(([label, total]) => ({ label, total }))
      .sort((a, b) => b.total - a.total);
  }, [alunos]);

  const distribuicaoPlanos = useMemo(() => {
    const mapa = new Map();
    alunos.forEach((aluno) => {
      const plano = aluno.plano || 'Sem plano';
      mapa.set(plano, (mapa.get(plano) || 0) + 1);
    });
    return Array.from(mapa.entries())
      .map(([label, total]) => ({ label, total }))
      .sort((a, b) => b.total - a.total);
  }, [alunos]);

  const faixaMaisPopular = distribuicaoFaixas[0];
  const planoPopular = distribuicaoPlanos[0];

  const mediaGraduacoesGeral = useMemo(() => {
    const medias = alunos
      .map((aluno) => calcularMediaEntreGraduacoes(aluno.historicoGraduacoes))
      .filter((valor) => Number.isFinite(valor));
    if (!medias.length) return null;
    const soma = medias.reduce((acc, valor) => acc + valor, 0);
    return soma / medias.length;
  }, [alunos]);

  const heroContent = useMemo(() => {
    if (activeView === 'alunos') {
      return {
        badge: 'Cadastros',
        title: 'Panorama de alunos',
        subtitle: 'Identifique novos cadastros, planos populares e quem precisa de atenção.',
        stats: [
          {
            label: 'Alunos ativos',
            value: ativos,
            helper: `${novos30Dias.length} novos · ${alunosEmAtencao.length} em atenção`
          },
          {
            label: 'Novos (30 dias)',
            value: novos30Dias.length,
            helper: 'Revise fichas de integração recentes'
          },
          {
            label: 'Plano favorito',
            value: planoPopular ? planoPopular.label : 'Sem dados',
            helper: `${planoPopular ? planoPopular.total : 0} aluno(s)`
          },
          {
            label: 'Faixa predominante',
            value: faixaMaisPopular ? faixaMaisPopular.label : 'Sem registros',
            helper: `${faixaMaisPopular ? faixaMaisPopular.total : 0} atleta(s)`
          }
        ]
      };
    }

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
    mediaGraduacoesGeral,
    novos30Dias.length,
    alunosEmAtencao.length,
    planoPopular?.label,
    faixaMaisPopular?.label
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
            <ToggleTag key={option.id} active={isActive} onClick={() => setActiveView(option.id)}>
              {option.label}
              <span className="hidden text-[11px] text-bjj-gray-200/70 md:inline">{option.helper}</span>
            </ToggleTag>
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
            title={`Aniversários (${mesAtualLabel})`}
            value={totalAniversariantesMes}
            icon={Cake}
            description="Planeje ações personalizadas para os aniversariantes do mês."
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

          <section className="card space-y-4">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-bjj-white">Aniversariantes de {mesAtualLabel}</h2>
                <p className="text-sm text-bjj-gray-200/70">
                  Antecipe mensagens e ações especiais para quem celebra o próximo ciclo este mês.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-bjj-gray-700 px-3 py-1 text-xs text-bjj-gray-200/70">
                <Cake size={13} className="text-bjj-red" /> {totalAniversariantesMes || 0} no mês
              </span>
            </header>

            {aniversariantesDestaque.length === 0 ? (
              <p className="text-sm text-bjj-gray-200/70">Nenhum aniversário neste mês. Aproveite para revisar cadastros.</p>
            ) : (
              <ul className="space-y-2">
                {aniversariantesDestaque.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-2 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-bjj-white">{item.nome}</p>
                        <Badge variant={item.status === 'Ativo' ? 'success' : 'neutral'}>{item.status}</Badge>
                      </div>
                      <p className="text-xs text-bjj-gray-200/70">
                        {item.faixa} · {item.graus}º grau
                      </p>
                    </div>
                    <div className="text-sm text-bjj-gray-200/80 md:text-right">
                      <p className="font-semibold text-bjj-white">{item.dataLabel}</p>
                      <p className="text-xs text-bjj-gray-200/70">Completa {item.idade} anos</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {activeView === 'alunos' && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <Card
              title="Novos no mês"
              value={novos30Dias.length}
              icon={UserPlus}
              description="Cadastros realizados nos últimos 30 dias."
            />
            <Card
              title="Em atenção"
              value={alunosEmAtencao.length}
              icon={UserMinus}
              description="Alunos com até duas presenças no período recente."
            />
            <Card
              title="Plano destaque"
              value={planoPopular ? planoPopular.label : 'Sem dados'}
              icon={Layers}
              description={planoPopular ? `${planoPopular.total} participante(s)` : 'Cadastre planos para acompanhar.'}
            />
            <Card
              title="Faixa líder"
              value={faixaMaisPopular ? faixaMaisPopular.label : 'N/A'}
              icon={PieChart}
              description={faixaMaisPopular ? `${faixaMaisPopular.total} atleta(s)` : 'Atualize faixas dos cadastros.'}
            />
          </div>

          <section className="grid grid-cols-1 gap-3 xl:grid-cols-[2fr,1fr]">
            <article className="card space-y-4">
              <header className="space-y-1.5">
                <h2 className="text-lg font-semibold text-bjj-white">Integração recente</h2>
                <p className="text-sm text-bjj-gray-200/70">
                  Cadastros concluídos nas últimas semanas para organizar apresentações, kits e contratos.
                </p>
              </header>
              {novos30Dias.length === 0 ? (
                <p className="text-sm text-bjj-gray-200/70">Nenhum aluno novo nos últimos 30 dias.</p>
              ) : (
                <ul className="space-y-2.5">
                  {novos30Dias.slice(0, 6).map(({ aluno, diasDesdeEntrada }) => (
                    <li
                      key={aluno.id}
                      className="flex flex-col gap-2 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-bjj-white">{aluno.nome}</p>
                        <p className="text-xs text-bjj-gray-200/70">
                          {aluno.faixa} · {aluno.graus}º grau · Plano {aluno.plano}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-bjj-gray-700 px-3 py-1 text-xs text-bjj-gray-200/80">
                        {diasDesdeEntrada === 0
                          ? 'Hoje'
                          : `Há ${diasDesdeEntrada} dia${diasDesdeEntrada > 1 ? 's' : ''}`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <aside className="card space-y-4">
              <header className="space-y-1.5">
                <h2 className="text-lg font-semibold text-bjj-white">Distribuição por faixa</h2>
                <p className="text-sm text-bjj-gray-200/70">Entenda a composição atual para planejar turmas e graduações.</p>
              </header>
              {distribuicaoFaixas.length === 0 ? (
                <p className="text-sm text-bjj-gray-200/70">Atualize a faixa dos alunos para visualizar a distribuição.</p>
              ) : (
                <ul className="space-y-2">
                  {distribuicaoFaixas.map((item) => (
                    <li key={item.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-bjj-gray-200/70">
                        <span className="font-semibold text-bjj-white">{item.label}</span>
                        <span>{item.total} aluno(s)</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-bjj-gray-800">
                        <div
                          className="h-full rounded-full bg-bjj-red"
                          style={{ width: `${Math.max(8, Math.round((item.total / (totalAlunos || 1)) * 100))}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </aside>
          </section>

          <section className="card space-y-4">
            <header className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-bjj-white">Frequência em atenção</h2>
                <p className="text-sm text-bjj-gray-200/70">
                  Alunos com participação baixa nas últimas quatro semanas para contato proativo.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-bjj-gray-700 px-3 py-1 text-xs text-bjj-gray-200/70">
                {presencasUltimoMes.length} registro(s) analisado(s)
              </span>
            </header>
            {alunosEmAtencao.length === 0 ? (
              <p className="text-sm text-bjj-gray-200/70">Sem alunos em atenção neste período.</p>
            ) : (
              <ul className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {alunosEmAtencao.map(({ aluno, presencasNoPeriodo }) => (
                  <li
                    key={aluno.id}
                    className="flex flex-col gap-2 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-bjj-white">{aluno.nome}</p>
                      <p className="text-xs text-bjj-gray-200/70">
                        {aluno.faixa} · {aluno.plano}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-bjj-gray-200/70">
                      <span className="font-semibold text-bjj-white">{presencasNoPeriodo} presença(s)</span>
                      <span>Meta: 4+</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </section>
      )}

      {activeView === 'presencas' && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Card
              title="Taxa de presença (dia)"
              value={`${taxaDia}%`}
              icon={Activity}
              description="Percentual de confirmações registradas hoje."
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
