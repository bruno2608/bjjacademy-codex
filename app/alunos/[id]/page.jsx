'use client';

/**
 * Página de edição de aluno com o mesmo visual das demais telas gamificadas.
 */
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Crown, CalendarClock } from 'lucide-react';
import AlunoForm from '../../../components/alunos/AlunoForm';
import Card from '../../../components/ui/Card';
import LoadingState from '../../../components/ui/LoadingState';
import { BjjBeltStrip } from '@/components/bjj/BjjBeltStrip';
import { getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils';
import { getAlunos, updateAluno } from '../../../services/alunosService';
import { getMaxStripes, getRuleForBelt } from '../../../lib/graduationRules';

export default function EditarAlunoPage() {
  const router = useRouter();
  const params = useParams();
  const [aluno, setAluno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAlunos().then((list) => {
      const encontrado = list.find((item) => item.id === params.id);
      setAluno(encontrado || null);
      setLoading(false);
    });
  }, [params.id]);

  const heroStats = useMemo(() => {
    if (!aluno) return [];
    const regra = getRuleForBelt(aluno.faixa);
    const maxGraus = getMaxStripes(aluno.faixa);
    return [
      {
        label: 'Faixa atual',
        value: aluno.faixa,
        helper: `${aluno.graus} de ${maxGraus || 0} grau(s)`
      },
      {
        label: 'Meses dedicados',
        value: `${aluno.mesesNaFaixa || 0}`,
        helper: 'Tempo aproximado na faixa em curso'
      },
      {
        label: 'Última graduação',
        value: aluno.dataUltimaGraduacao ? new Date(aluno.dataUltimaGraduacao).toLocaleDateString('pt-BR') : 'Sem registro',
        helper: regra?.tempoMinimoMeses
          ? `Próxima meta: ${regra.tempoMinimoMeses} meses`
          : 'Regra personalizada conforme instrutor'
      }
    ];
  }, [aluno]);

  const handleSubmit = async (data) => {
    if (!aluno) return;
    setSaving(true);
    await updateAluno(aluno.id, data);
    setSaving(false);
    router.push('/alunos');
  };

  if (loading) {
    return <LoadingState title="Carregando cadastro" message="Sincronizando dados do aluno selecionado." />;
  }

  if (!aluno) {
    return <p className="text-sm text-bjj-red">Aluno não encontrado.</p>;
  }

  const faixaConfig =
    getFaixaConfigBySlug(aluno.faixaSlug) || getFaixaConfigBySlug('branca-adulto');

  return (
    <div className="space-y-6">
      <div className="relative">
        <section className="relative overflow-hidden rounded-2xl border border-bjj-gray-800/60 bg-gradient-to-br from-bjj-gray-900 via-bjj-black to-bjj-black p-6 shadow-[0_18px_35px_-18px_rgba(0,0,0,0.55)]">
          <div className="absolute right-[-30%] top-[-40%] h-56 w-56 rounded-full bg-bjj-red/10 blur-3xl" aria-hidden />
          <div className="absolute left-[-20%] bottom-[-40%] h-56 w-56 rounded-full bg-bjj-gray-800/40 blur-3xl" aria-hidden />
          <div className="relative flex flex-col gap-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl space-y-3">
                <span className="inline-flex items-center justify-center rounded-full border border-bjj-gray-700 bg-bjj-gray-900/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-bjj-gray-200/70">
                  Edição de cadastro
                </span>
                <div className="space-y-2.5">
                  <h1 className="text-2xl font-semibold text-bjj-white md:text-3xl">{aluno.nome}</h1>
                  <p className="text-sm text-bjj-gray-200/80 md:text-base">
                    Atualize graduações, contatos e status sem perder o contexto da jornada.
                  </p>
                </div>
              </div>
            </header>

            {faixaConfig && (
              <div className="flex justify-center">
                <div className="w-full max-w-md py-2">
                  <BjjBeltStrip
                    config={faixaConfig}
                    grauAtual={aluno.graus ?? faixaConfig.grausMaximos}
                    className="scale-[0.95] md:scale-100 origin-center"
                  />
                </div>
              </div>
            )}

            {heroStats.length > 0 && (
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {heroStats.map(({ label, value, helper }) => (
                  <div
                    key={label}
                    className="relative overflow-hidden rounded-xl border border-bjj-gray-800/80 bg-bjj-gray-900/70 px-4 py-3"
                  >
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-bjj-gray-200/60">{label}</span>
                    <p className="mt-1.5 text-xl font-semibold text-bjj-white">{value}</p>
                    {helper && <p className="mt-1 text-xs text-bjj-gray-200/70">{helper}</p>}
                    <div className="absolute right-0 top-0 h-16 w-16 translate-x-8 -translate-y-8 rounded-full bg-bjj-red/10 blur-2xl" aria-hidden />
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>

        <button
          type="button"
          className="btn btn-sm btn-ghost absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-bjj-gray-600/80 bg-bjj-gray-900/80 text-bjj-gray-100 shadow-lg transition hover:border-bjj-gray-400 hover:text-white"
          aria-label="Voltar para a lista de alunos"
          onClick={() => router.push('/alunos')}
        >
          <ArrowLeft size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2fr,1fr]">
        <section className="card space-y-3">
          <header className="space-y-1.5">
            <h2 className="text-lg font-semibold text-bjj-white">Informações gerais</h2>
            <p className="text-sm text-bjj-gray-200/70">
              Lembre-se de registrar data da última graduação para manter as recomendações atualizadas.
            </p>
          </header>
          <AlunoForm initialData={aluno} onSubmit={handleSubmit} isSubmitting={saving} submitLabel="Atualizar" />
          {saving && <p className="text-xs text-bjj-gray-200/70">Sincronizando dados...</p>}
        </section>

        <aside className="space-y-3">
          <Card
            title="Status na hierarquia"
            value={`${aluno.faixa} · ${aluno.graus}º grau`}
            icon={Crown}
            description="Visualização rápida do nível atual do praticante."
          />
          <Card
            title="Histórico recente"
            value={aluno.historicoGraduacoes?.[0]?.data ? new Date(aluno.historicoGraduacoes[0].data).toLocaleDateString('pt-BR') : 'Sem histórico'}
            icon={CalendarClock}
            description="Último registro documentado na jornada do aluno."
          />
        </aside>
      </div>
    </div>
  );
}
