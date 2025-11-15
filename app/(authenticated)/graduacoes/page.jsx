'use client';

/**
 * Página de graduações com visual gamificado inspirado no app mobile.
 * Mostra status atual, progresso até a próxima meta, linha do tempo e
 * permite agendar novas graduações sem sair da tela.
 */
import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import GraduationList from '../../../components/graduacoes/GraduationList';
import GraduationTimeline from '../../../components/graduacoes/GraduationTimeline';
import {
  getGraduacoes,
  scheduleGraduacao,
  updateGraduacao,
  getGraduationRecommendation
} from '../../../services/graduacoesService';
import { useAlunosStore } from '../../../store/alunosStore';
import { estimateGraduationDate, getMaxStripes, getRuleForBelt } from '../../../lib/graduationRules';
import LoadingState from '../../../components/ui/LoadingState';

const initialForm = {
  alunoId: '',
  tipo: 'Grau',
  proximaFaixa: '',
  grauAlvo: '',
  previsao: '',
  criterioTempo: '',
  mesesRestantes: 0,
  instrutor: 'Equipe BJJ Academy'
};

const formatMonths = (meses) => {
  if (!Number.isFinite(Number(meses))) return 'Sem registro';
  const value = Math.max(Number(meses), 0);
  const anos = Math.floor(value / 12);
  const restante = value % 12;
  if (anos === 0) {
    return `${value} mês${value === 1 ? '' : 'es'}`;
  }
  if (restante === 0) {
    return `${anos} ano${anos > 1 ? 's' : ''}`;
  }
  return `${anos} ano${anos > 1 ? 's' : ''} e ${restante} mês${restante > 1 ? 'es' : ''}`;
};

const formatDate = (value) => {
  if (!value) return 'Sem data';
  const data = new Date(value);
  if (Number.isNaN(data.getTime())) return value;
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const getInitials = (nome) => {
  if (!nome) return 'BJJ';
  const partes = nome.trim().split(' ');
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
};

const buildStripes = (total, conquistados) => {
  const limite = Math.max(Number(total) || 0, 0);
  const ganhos = Math.max(Number(conquistados) || 0, 0);
  return Array.from({ length: limite || 4 }, (_, index) => index < ganhos);
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

export default function GraduacoesPage() {
  const [graduacoes, setGraduacoes] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [recomendacao, setRecomendacao] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const alunos = useAlunosStore((state) => state.alunos);

  useEffect(() => {
    let active = true;
    async function carregarGraduacoes() {
      try {
        const lista = await getGraduacoes();
        if (!active) return;
        setGraduacoes(lista);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    carregarGraduacoes();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!alunos.length) return;
    setForm((prev) => ({ ...prev, alunoId: prev.alunoId || alunos[0].id }));
  }, [alunos]);

  const alunoSelecionado = useMemo(
    () => alunos.find((aluno) => aluno.id === form.alunoId),
    [alunos, form.alunoId]
  );

  const alunoLookup = useMemo(() => {
    const map = {};
    alunos.forEach((aluno) => {
      map[aluno.id] = aluno;
    });
    return map;
  }, [alunos]);

  const regraFaixaAtual = useMemo(() => getRuleForBelt(alunoSelecionado?.faixa), [alunoSelecionado]);
  const proximasFaixasDisponiveis = useMemo(() => {
    if (!regraFaixaAtual?.proximaFaixa) return [];
    return [regraFaixaAtual.proximaFaixa];
  }, [regraFaixaAtual]);

  const proximosGrausDisponiveis = useMemo(() => {
    if (!alunoSelecionado) return [];
    const max = getMaxStripes(alunoSelecionado.faixa);
    if (!max) return [];
    const atual = Number(alunoSelecionado.graus || 0);
    return Array.from({ length: max - atual }, (_, index) => atual + index + 1);
  }, [alunoSelecionado]);

  useEffect(() => {
    if (!alunoSelecionado) return;
    const novaRecomendacao = getGraduationRecommendation(alunoSelecionado);
    setRecomendacao(novaRecomendacao);

    if (!novaRecomendacao) {
      setForm((prev) => ({
        ...prev,
        alunoId: alunoSelecionado.id,
        tipo: proximasFaixasDisponiveis.length ? 'Faixa' : 'Grau',
        proximaFaixa: proximasFaixasDisponiveis[0] || alunoSelecionado.faixa,
        grauAlvo: proximosGrausDisponiveis[0] || '',
        previsao: alunoSelecionado.dataUltimaGraduacao || '',
        criterioTempo: 'Sem recomendação automática para esta faixa.',
        mesesRestantes: 0,
        instrutor: 'Equipe BJJ Academy'
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      alunoId: alunoSelecionado.id,
      tipo: novaRecomendacao.tipo,
      proximaFaixa:
        novaRecomendacao.tipo === 'Faixa'
          ? novaRecomendacao.proximaFaixa
          : proximasFaixasDisponiveis[0] || alunoSelecionado.faixa,
      grauAlvo: novaRecomendacao.tipo === 'Grau' ? novaRecomendacao.grauAlvo : '',
      previsao: novaRecomendacao.previsao,
      criterioTempo: `Tempo mínimo: ${novaRecomendacao.tempoNecessario} meses`,
      mesesRestantes: novaRecomendacao.mesesRestantes,
      instrutor: 'Equipe BJJ Academy'
    }));
  }, [alunoSelecionado, proximasFaixasDisponiveis, proximosGrausDisponiveis]);

  const atualizarCamposPorTipo = (tipoSelecionado, override = {}) => {
    if (!alunoSelecionado) return;
    if (tipoSelecionado === 'Grau') {
      const alvo = override.grauAlvo || proximosGrausDisponiveis[0] || '';
      const regra = regraFaixaAtual?.graus?.find((item) => item.numero === Number(alvo));
      const tempoNecessario = regra?.tempoMinimoMeses || 0;
      const mesesRestantes = Math.max(tempoNecessario - Number(alunoSelecionado.mesesNaFaixa || 0), 0);
      const previsao = estimateGraduationDate(alunoSelecionado, mesesRestantes);
      setForm((prev) => ({
        ...prev,
        tipo: 'Grau',
        grauAlvo: alvo,
        proximaFaixa: alunoSelecionado.faixa,
        previsao,
        criterioTempo: tempoNecessario
          ? `Tempo mínimo: ${tempoNecessario} meses`
          : 'Defina manualmente o prazo de graduação.',
        mesesRestantes
      }));
      return;
    }

    const proximaFaixa = override.proximaFaixa || proximasFaixasDisponiveis[0] || alunoSelecionado.faixa;
    const tempoNecessario = regraFaixaAtual?.tempoFaixaMeses || 0;
    const mesesRestantes = Math.max(tempoNecessario - Number(alunoSelecionado.mesesNaFaixa || 0), 0);
    const previsao = estimateGraduationDate(alunoSelecionado, mesesRestantes);
    setForm((prev) => ({
      ...prev,
      tipo: 'Faixa',
      proximaFaixa,
      grauAlvo: '',
      previsao,
      criterioTempo: tempoNecessario
        ? `Tempo mínimo: ${tempoNecessario} meses`
        : 'Defina manualmente o prazo de graduação.',
      mesesRestantes
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'tipo') {
      atualizarCamposPorTipo(value);
      return;
    }
    if (name === 'grauAlvo') {
      atualizarCamposPorTipo('Grau', { grauAlvo: Number(value) });
      return;
    }
    if (name === 'proximaFaixa') {
      atualizarCamposPorTipo('Faixa', { proximaFaixa: value });
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!alunoSelecionado || salvando) return;

    if (form.tipo === 'Grau' && (!form.grauAlvo || proximosGrausDisponiveis.length === 0)) {
      return;
    }
    if (form.tipo === 'Faixa' && (!form.proximaFaixa || proximasFaixasDisponiveis.length === 0)) {
      return;
    }

    setSalvando(true);
    setIsRefreshing(true);
    try {
      await scheduleGraduacao({
        alunoId: alunoSelecionado.id,
        tipo: form.tipo,
        proximaFaixa: form.tipo === 'Faixa' ? form.proximaFaixa : alunoSelecionado.faixa,
        grauAlvo: form.tipo === 'Grau' ? Number(form.grauAlvo) : null,
        previsao: form.previsao,
        criterioTempo: form.criterioTempo,
        mesesRestantes: form.mesesRestantes,
        instrutor: form.instrutor
      });
      const atualizadas = await getGraduacoes();
      setGraduacoes(atualizadas);
    } finally {
      setSalvando(false);
      setIsRefreshing(false);
    }
  };

  const handleStatusChange = async (graduacao, novoStatus) => {
    setIsRefreshing(true);
    try {
      const atualizado = await updateGraduacao(graduacao.id, { status: novoStatus });
      const atualizadas = graduacoes.map((item) => (item.id === graduacao.id ? atualizado : item));
      setGraduacoes(atualizadas);
    } finally {
      setIsRefreshing(false);
    }
  };

  const tipoDisponivel = {
    Grau: proximosGrausDisponiveis.length > 0,
    Faixa: proximasFaixasDisponiveis.length > 0
  };

  const podeSalvar =
    !!alunoSelecionado &&
    ((form.tipo === 'Grau' && tipoDisponivel.Grau && form.grauAlvo) ||
      (form.tipo === 'Faixa' && tipoDisponivel.Faixa && form.proximaFaixa));

  const totalStripes = getMaxStripes(alunoSelecionado?.faixa);
  const stripes = buildStripes(totalStripes, alunoSelecionado?.graus ?? 0);
  const progressoPercentual = useMemo(() => {
    if (!recomendacao) return 0;
    const tempoNecessario = recomendacao.tempoNecessario || 0;
    const mesesRestantes = recomendacao.mesesRestantes || 0;
    if (!tempoNecessario) return 0;
    const cumpridos = Math.max(tempoNecessario - mesesRestantes, 0);
    return Math.min(Math.round((cumpridos / tempoNecessario) * 100), 100);
  }, [recomendacao]);

  const tempoNaFaixaLabel = formatMonths(alunoSelecionado?.mesesNaFaixa ?? 0);
  const tempoRestanteLabel = recomendacao ? formatMonths(recomendacao.mesesRestantes || 0) : null;
  const mediaEntreGraduacoes = useMemo(
    () => calcularMediaEntreGraduacoes(alunoSelecionado?.historicoGraduacoes),
    [alunoSelecionado]
  );

  const graduacoesDoAluno = useMemo(
    () => graduacoes.filter((item) => item.alunoId === form.alunoId),
    [graduacoes, form.alunoId]
  );

  if (isLoading) {
    return <LoadingState title="Mapeando graduações" message="Buscando histórico e recomendações dos atletas." />;
  }

  return (
    <div className="space-y-6" aria-busy={isRefreshing}>
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Jornada de graduações</h2>
          <p className="text-sm text-bjj-gray-200/70">
            Visualize a evolução completa dos atletas, acompanhe recomendações automáticas e
            conduza as cerimônias no tempo certo.
          </p>
        </div>
        <div className="flex flex-col gap-1.5 text-sm">
          <label htmlFor="alunoId" className="font-medium text-bjj-gray-200/80">
            Selecionar aluno
          </label>
          <select
            id="alunoId"
            name="alunoId"
            value={form.alunoId}
            onChange={handleChange}
            className="input-field min-w-[220px]"
          >
            {alunos.map((aluno) => (
              <option key={aluno.id} value={aluno.id}>
                {aluno.nome} · {aluno.faixa} ({aluno.graus}º grau)
              </option>
            ))}
          </select>
          {isRefreshing && (
            <span className="inline-flex items-center gap-2 text-xs text-bjj-gray-200/70">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-bjj-red" /> Sincronizando atualizações
            </span>
          )}
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[340px,1fr]">
        <section className="relative overflow-hidden rounded-2xl border border-bjj-gray-800 bg-gradient-to-br from-bjj-black via-bjj-gray-900 to-bjj-black p-6 shadow-[0_18px_35px_-18px_rgba(0,0,0,0.55)]">
          <div className="absolute right-0 top-0 h-36 w-36 -translate-y-10 translate-x-8 rounded-full bg-bjj-red/20 blur-3xl" />
          <div className="relative flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-bjj-red/60 bg-bjj-gray-900 text-base font-semibold text-bjj-white">
                {getInitials(alunoSelecionado?.nome)}
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-bjj-gray-200/60">Status atual</p>
                <h3 className="text-xl font-semibold text-bjj-white">
                  {alunoSelecionado?.nome || 'Selecione um aluno'}
                </h3>
                <p className="text-xs text-bjj-gray-200/70">
                  Treinando desde {formatDate(alunoSelecionado?.dataInicio)}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-bjj-gray-800/80 bg-bjj-gray-900/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <span className="text-sm font-medium text-bjj-gray-200/80">{alunoSelecionado?.faixa}</span>
                <div className="flex items-center gap-1">
                  {stripes.map((preenchida, index) => (
                    <span
                      key={index}
                      className={`h-2 w-8 rounded-full ${
                        preenchida ? 'bg-bjj-red' : 'bg-bjj-gray-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-3.5">
                <div className="flex items-center justify-between text-xs text-bjj-gray-200/70">
                  <span>Próxima meta</span>
                  <span>{progressoPercentual}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-bjj-gray-800">
                  <div
                    className="h-full rounded-full bg-bjj-red transition-all"
                    style={{ width: `${progressoPercentual}%` }}
                  />
                </div>
                <p className="mt-2.5 text-xs text-bjj-gray-200/70">
                  {recomendacao
                    ? `${recomendacao.descricao} · próxima janela ${formatDate(recomendacao.previsao)}`
                    : 'Defina uma recomendação para liberar a próxima graduação.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 text-sm text-bjj-gray-200/80 sm:grid-cols-2">
              <div className="rounded-xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-3.5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-bjj-gray-200/60">Tempo na faixa</p>
                <p className="mt-1.5 text-lg font-semibold text-bjj-white">{tempoNaFaixaLabel}</p>
              </div>
              <div className="rounded-xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-3.5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-bjj-gray-200/60">Até a próxima</p>
                <p className="mt-1.5 text-lg font-semibold text-bjj-white">
                  {tempoRestanteLabel || 'Sem restrições'}
                </p>
              </div>
              <div className="rounded-xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-3.5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-bjj-gray-200/60">Última graduação</p>
                <p className="mt-1.5 text-lg font-semibold text-bjj-white">
                  {formatDate(alunoSelecionado?.dataUltimaGraduacao)}
                </p>
              </div>
              <div className="rounded-xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-3.5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-bjj-gray-200/60">Média entre graduações</p>
                <p className="mt-1.5 text-lg font-semibold text-bjj-white">
                  {mediaEntreGraduacoes ? formatMonths(mediaEntreGraduacoes) : 'Ainda em formação'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/60 p-5">
            <header className="space-y-1.5">
              <h3 className="text-base font-semibold">Agendar nova graduação</h3>
              {recomendacao ? (
                <p className="text-xs text-bjj-gray-200/70">
                  Recomendação automática: <span className="font-semibold text-bjj-red">{recomendacao.descricao}</span> ·
                  sugerido para {formatDate(recomendacao.previsao)}.
                </p>
              ) : (
                <p className="text-xs text-bjj-gray-200/70">
                  Ajuste manualmente os campos abaixo para criar um novo marco de evolução.
                </p>
              )}
            </header>

            <form className="mt-3.5 grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select name="tipo" value={form.tipo} onChange={handleChange} className="input-field">
                  <option value="Grau" disabled={!tipoDisponivel.Grau}>
                    Grau
                  </option>
                  <option value="Faixa" disabled={!tipoDisponivel.Faixa}>
                    Faixa
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Faixa atual</label>
                <input className="input-field" value={alunoSelecionado?.faixa || ''} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Meta</label>
                {form.tipo === 'Grau' ? (
                  <select
                    name="grauAlvo"
                    value={form.grauAlvo}
                    onChange={handleChange}
                    className="input-field"
                    disabled={!tipoDisponivel.Grau}
                  >
                    {proximosGrausDisponiveis.length === 0 && <option value="">Sem graus disponíveis</option>}
                    {proximosGrausDisponiveis.map((grau) => (
                      <option key={grau} value={grau}>
                        {grau}º grau
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    name="proximaFaixa"
                    value={form.proximaFaixa}
                    onChange={handleChange}
                    className="input-field"
                    disabled={!tipoDisponivel.Faixa}
                  >
                    {proximasFaixasDisponiveis.length === 0 && <option value="">Sem faixa cadastrada</option>}
                    {proximasFaixasDisponiveis.map((faixa) => (
                      <option key={faixa} value={faixa}>
                        {faixa}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Previsão</label>
                <input type="date" name="previsao" value={form.previsao} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Instrutor responsável</label>
                <input
                  name="instrutor"
                  value={form.instrutor}
                  onChange={handleChange}
                  placeholder="Profissional que conduzirá a cerimônia"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Critério de liberação</label>
                <input
                  name="criterioTempo"
                  value={form.criterioTempo}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Tempo mínimo, performance ou feedback do professor"
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-2 text-xs text-bjj-gray-200/70">
                <span>
                  Meses restantes estimados:{' '}
                  <strong className="text-bjj-red">{form.mesesRestantes}</strong>
                </span>
                <button
                  type="submit"
                  className="btn-primary md:self-start"
                  disabled={!podeSalvar || salvando}
                >
                  {salvando ? 'Salvando...' : 'Agendar graduação'}
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/60 p-5">
            <h3 className="mb-3 text-base font-semibold">Linha do tempo</h3>
            <GraduationTimeline itens={alunoSelecionado?.historicoGraduacoes || []} />
          </div>
        </section>
      </div>

      <section className="space-y-3.5">
        <div>
          <h3 className="text-lg font-semibold">Próximas graduações</h3>
          <p className="text-xs text-bjj-gray-200/70">
            Atualize o status conforme as avaliações aconteçam para manter a linha do tempo sempre fiel à realidade.
          </p>
        </div>
        <GraduationList
          graduacoes={graduacoesDoAluno}
          alunoLookup={alunoLookup}
          onStatusChange={handleStatusChange}
        />
      </section>
    </div>
  );
}
