'use client';

/**
 * Dashboard exibe métricas principais com o mesmo visual gamificado da
 * tela de graduações, reforçando continuidade na experiência.
 */
import { useEffect, useMemo, useState } from 'react';
import { Users, Award, CalendarCheck, Medal, Activity, Flame } from 'lucide-react';
import Card from '../../../components/ui/Card';
import PageHero from '../../../components/ui/PageHero';
import LoadingState from '../../../components/ui/LoadingState';
import { getAlunos } from '../../../services/alunosService';
import { getPresencas } from '../../../services/presencasService';
import { getGraduacoes } from '../../../services/graduacoesService';
import { calculateNextStep } from '../../../lib/graduationRules';

const formatDate = (value) => {
  if (!value) return 'Sem data';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

export default function DashboardPage() {
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

  const totalAlunos = alunos.length || 1;
  const ativos = alunos.filter((aluno) => aluno.status === 'Ativo').length;
  const inativos = alunos.filter((aluno) => aluno.status !== 'Ativo').length;
  const taxaAtivos = Math.round((ativos / totalAlunos) * 100);

  const avaliacoes = Math.round(alunos.length * 0.5 + 5);
  const presencasSemana = presencas.filter((item) => {
    const data = new Date(item.data);
    const hoje = new Date();
    const diff = Math.abs(data - hoje) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;
  const graduacoesPlanejadas = graduacoes.filter((item) => item.status !== 'Concluído').length;

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
    .sort((a, b) => new Date(a.previsao) - new Date(b.previsao))
    .slice(0, 4);

  const evolucoesEmDestaque = evolucoes.slice(0, 5);

  const heroStats = [
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
  ];

  if (isLoading) {
    return <LoadingState title="Carregando panorama" message="Conectando módulos de alunos, presenças e graduações." />;
  }

  return (
    <div className="space-y-6">
      <PageHero
        badge="Visão geral"
        title="Painel de performance da BJJ Academy"
        subtitle="Acompanhe evolução de alunos, graduações e engajamento semanal sem sair desta tela."
        stats={heroStats}
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card
          title="Alunos ativos"
          value={ativos}
          icon={Users}
          description="Atualize cadastros e mantenha as informações de contato em dia."
        />
        <Card
          title="Graus em revisão"
          value={grausPendentes}
          icon={Award}
          description="Sugestões de graus pendentes com base no tempo mínimo de treino."
        />
        <Card
          title="Faixas em preparação"
          value={faixasPendentes}
          icon={Medal}
          description="Alunos com recomendação de troca de faixa nos próximos meses."
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
          <header className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-bjj-white">Radar de evolução</h2>
              <p className="text-sm text-bjj-gray-200/70">
                Priorize quem está pronto para avançar: acompanhe próximos graus e trocas de faixa sugeridas.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-bjj-gray-700 px-3 py-1 text-xs text-bjj-gray-200/70">
              <Activity size={13} className="text-bjj-red" /> {evolucoes.length} recomendações
            </span>
          </header>
          {evolucoesEmDestaque.length === 0 ? (
            <p className="text-sm text-bjj-gray-200/70">
              Nenhuma recomendação pendente para as próximas semanas.
            </p>
          ) : (
            <ul className="space-y-3">
              {evolucoesEmDestaque.map(({ aluno, recomendacao }) => (
                <li
                  key={aluno.id}
                  className="flex flex-col gap-2 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3.5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-bjj-white">{aluno.nome}</p>
                    <p className="text-xs text-bjj-gray-200/70">{recomendacao.descricao}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-bjj-gray-700 px-3 py-1 text-xs text-bjj-gray-200/80">
                    {recomendacao.tipo === 'Grau' ? 'Próximo grau' : 'Próxima faixa'}
                    <span className="text-bjj-red font-semibold">
                      {recomendacao.tipo === 'Grau'
                        ? `${recomendacao.grauAlvo}º`
                        : recomendacao.proximaFaixa}
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
                  className="flex flex-col gap-2 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3.5"
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
    </div>
  );
}
