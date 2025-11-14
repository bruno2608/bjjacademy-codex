'use client';

/**
 * Página de listagem de alunos atualizada com o mesmo visual gamificado
 * da seção de graduações. Todas as ações permanecem na mesma tela via modal.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserPlus2, Target, Sparkles } from 'lucide-react';
import Table from '../../../components/ui/Table';
import Modal from '../../../components/ui/Modal';
import AlunoForm from '../../../components/ui/AlunoForm';
import PageHero from '../../../components/ui/PageHero';
import Card from '../../../components/ui/Card';
import LoadingState from '../../../components/ui/LoadingState';
import { getAlunos, deleteAluno, createAluno } from '../../../services/alunosService';
import { calculateNextStep, BELT_ORDER } from '../../../lib/graduationRules';

const orderByBelt = (a, b) => BELT_ORDER.indexOf(a) - BELT_ORDER.indexOf(b);

export default function AlunosPage() {
  const router = useRouter();
  const [alunos, setAlunos] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let active = true;
    async function inicializar() {
      try {
        const lista = await getAlunos();
        if (!active) return;
        setAlunos(lista);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    inicializar();
    return () => {
      active = false;
    };
  }, []);

  const total = alunos.length;
  const ativos = alunos.filter((aluno) => aluno.status === 'Ativo').length;
  const inativos = total - ativos;
  const mediaMeses = total
    ? Math.round(alunos.reduce((acc, aluno) => acc + Number(aluno.mesesNaFaixa || 0), 0) / total)
    : 0;

  const proximosPassos = useMemo(
    () =>
      alunos
        .map((aluno) => ({ aluno, recomendacao: calculateNextStep(aluno) }))
        .filter((item) => Boolean(item.recomendacao)),
    [alunos]
  );

  const proximosPassosTop = proximosPassos.slice(0, 4);

  const beltDistribution = useMemo(() => {
    const mapa = new Map();
    alunos.forEach((aluno) => {
      const faixa = aluno.faixa || 'Sem faixa';
      mapa.set(faixa, (mapa.get(faixa) || 0) + 1);
    });
    return Array.from(mapa.entries())
      .sort(([faixaA], [faixaB]) => orderByBelt(faixaA, faixaB))
      .map(([faixa, quantidade]) => ({ faixa, quantidade, percentual: Math.round((quantidade / (total || 1)) * 100) }));
  }, [alunos, total]);

  const refreshList = useCallback(async () => {
    setIsRefreshing(true);
    const lista = await getAlunos();
    setAlunos(lista);
    setIsRefreshing(false);
  }, []);

  const handleDelete = async (aluno) => {
    await deleteAluno(aluno.id);
    await refreshList();
  };

  const handleEdit = (aluno) => {
    router.push(`/alunos/${aluno.id}`);
  };

  const handleCreate = async (data) => {
    setIsSaving(true);
    await createAluno(data);
    await refreshList();
    setIsSaving(false);
    setIsCreateOpen(false);
  };

  const heroStats = [
    {
      label: 'Total de alunos',
      value: total,
      helper: `${ativos} ativos · ${inativos} em pausa`
    },
    {
      label: 'Tempo médio na faixa',
      value: `${mediaMeses} meses`,
      helper: 'Considera todos os praticantes cadastrados'
    },
    {
      label: 'Prontos para evoluir',
      value: proximosPassos.length,
      helper: `${proximosPassos.filter((item) => item.recomendacao.tipo === 'Grau').length} graus · ${
        proximosPassos.filter((item) => item.recomendacao.tipo === 'Faixa').length
      } faixas`
    },
    {
      label: 'Cadastro completo',
      value: `${Math.max(100 - inativos * 5, 65)}%`,
      helper: 'Estimativa baseada em status e contatos atualizados'
    }
  ];

  if (isLoading) {
    return <LoadingState title="Preparando cadastro" message="Buscando a lista de alunos cadastrados." />;
  }

  return (
    <div className="space-y-6">
      <PageHero
        badge="Gestão de alunos"
        title="Mantenha a base organizada e pronta para a próxima graduação"
        subtitle="Visualize status, graduações e contatos em uma única visão. Cadastre ou edite sem sair da página."
        stats={heroStats}
        actions={
          <button type="button" className="btn-primary" onClick={() => setIsCreateOpen(true)}>
            <UserPlus2 size={16} /> Novo aluno
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[3fr,2fr]">
        <section className="space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Card
              title="Alunos ativos"
              value={ativos}
              icon={Users}
              description="Reflete quem participa atualmente das turmas."
            />
            <Card
              title="Em potencial de evolução"
              value={proximosPassos.length}
              icon={Target}
              description="Quantidade de alunos com recomendação automática para graduação."
            />
          </div>
          <div className="card space-y-3">
            <header>
              <h2 className="text-lg font-semibold text-bjj-white">Lista de alunos</h2>
              <p className="text-sm text-bjj-gray-200/70">
                Monitore faixa atual, tempo dedicado e status de cada membro da academia.
              </p>
            </header>
            <Table
              headers={['Aluno', 'Graduação', 'Plano', 'Status', 'Contato', 'Ações']}
              data={alunos}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isRefreshing}
            />
          </div>
        </section>

        <aside className="card space-y-4">
          <div className="space-y-2.5">
            <h2 className="text-lg font-semibold text-bjj-white">Distribuição de faixas</h2>
            <p className="text-sm text-bjj-gray-200/70">
              Tenha visibilidade de como está a pirâmide da academia e antecipe novas graduações.
            </p>
          </div>
          <ul className="space-y-2.5">
            {beltDistribution.map((item) => (
              <li key={item.faixa} className="space-y-1 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-bjj-white">{item.faixa}</span>
                  <span className="text-[11px] text-bjj-gray-200/60">{item.quantidade} aluno(s)</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-bjj-gray-800">
                  <div className="h-full rounded-full bg-bjj-red" style={{ width: `${item.percentual}%` }} />
                </div>
                <p className="text-xs text-bjj-gray-200/70">{item.percentual}% da base</p>
              </li>
            ))}
          </ul>

          <div className="space-y-2.5">
            <h3 className="text-base font-semibold text-bjj-white">Próximos destaques</h3>
            <p className="text-xs text-bjj-gray-200/70">
              Alunos com mais tempo dedicado na faixa atual ou recomendação imediata.
            </p>
          </div>
          {proximosPassosTop.length === 0 ? (
            <p className="text-sm text-bjj-gray-200/70">Sem recomendações por enquanto. Continue monitorando presenças.</p>
          ) : (
            <ul className="space-y-3">
              {proximosPassosTop.map(({ aluno, recomendacao }) => (
                <li
                  key={aluno.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-bjj-white">{aluno.nome}</p>
                    <p className="text-xs text-bjj-gray-200/70">
                      {recomendacao.descricao}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs text-bjj-gray-200/70">
                    <Sparkles size={14} className="text-bjj-red" />
                    {recomendacao.tipo === 'Grau'
                      ? `${recomendacao.grauAlvo}º grau`
                      : recomendacao.proximaFaixa}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      <Modal isOpen={isCreateOpen} title="Cadastrar novo aluno" onClose={() => setIsCreateOpen(false)}>
        <AlunoForm onSubmit={handleCreate} isSubmitting={isSaving} submitLabel="Salvar cadastro" />
        {isSaving && <p className="text-xs text-bjj-gray-200/70 mt-3">Armazenando aluno na base...</p>}
      </Modal>
    </div>
  );
}
