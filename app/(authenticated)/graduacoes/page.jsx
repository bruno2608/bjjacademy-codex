'use client';

/**
 * Página de graduações acompanha o progresso dos alunos rumo às próximas etapas
 * (graus e faixas) com possibilidade de atualizar status e agendar novas cerimônias.
 */
import { useEffect, useMemo, useState } from 'react';
import GraduationList from '../../../components/ui/GraduationList';
import {
  getGraduacoes,
  scheduleGraduacao,
  updateGraduacao,
  getGraduationRecommendation
} from '../../../services/graduacoesService';
import useUserStore from '../../../store/userStore';
import { estimateGraduationDate, getMaxStripes, getRuleForBelt } from '../../../lib/graduationRules';

const initialForm = {
  alunoId: '',
  tipo: 'Grau',
  proximaFaixa: '',
  grauAlvo: '',
  previsao: '',
  criterioTempo: '',
  mesesRestantes: 0
};

export default function GraduacoesPage() {
  const [graduacoes, setGraduacoes] = useState([]);
  const alunos = useUserStore((state) => state.alunos);
  const [form, setForm] = useState(initialForm);
  const [recomendacao, setRecomendacao] = useState(null);

  useEffect(() => {
    getGraduacoes().then(setGraduacoes);
  }, []);

  useEffect(() => {
    if (!alunos.length) return;
    setForm((prev) => ({ ...prev, alunoId: prev.alunoId || alunos[0].id }));
  }, [alunos]);

  const alunoSelecionado = useMemo(
    () => alunos.find((aluno) => aluno.id === form.alunoId),
    [alunos, form.alunoId]
  );

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
        mesesRestantes: 0
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
      mesesRestantes: novaRecomendacao.mesesRestantes
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
    if (!alunoSelecionado) return;

    if (form.tipo === 'Grau' && (!form.grauAlvo || proximosGrausDisponiveis.length === 0)) {
      return;
    }

    if (form.tipo === 'Faixa' && (!form.proximaFaixa || proximasFaixasDisponiveis.length === 0)) {
      return;
    }

    const novaGraduacao = await scheduleGraduacao({
      alunoId: alunoSelecionado.id,
      tipo: form.tipo,
      proximaFaixa: form.tipo === 'Faixa' ? form.proximaFaixa : alunoSelecionado.faixa,
      grauAlvo: form.tipo === 'Grau' ? Number(form.grauAlvo) : null,
      previsao: form.previsao,
      criterioTempo: form.criterioTempo,
      mesesRestantes: form.mesesRestantes
    });

    setGraduacoes((prev) => [...prev, novaGraduacao]);
  };

  const handleStatusChange = async (graduacao, novoStatus) => {
    const atualizado = await updateGraduacao(graduacao.id, { status: novoStatus });
    setGraduacoes((prev) => prev.map((item) => (item.id === graduacao.id ? atualizado : item)));
  };

  const tipoDisponivel = {
    Grau: proximosGrausDisponiveis.length > 0,
    Faixa: proximasFaixasDisponiveis.length > 0
  };

  const podeSalvar =
    !!alunoSelecionado &&
    ((form.tipo === 'Grau' && tipoDisponivel.Grau && form.grauAlvo) ||
      (form.tipo === 'Faixa' && tipoDisponivel.Faixa && form.proximaFaixa));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">Linha do tempo de graduações</h2>
        <p className="text-sm text-bjj-gray-200/70">
          Visualize o caminho de evolução dos atletas, controle graduações por grau e faixa e mantenha o calendário
          organizado.
        </p>
      </header>
      <section className="card space-y-5">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Agendar nova graduação</h3>
          {recomendacao ? (
            <p className="text-xs text-bjj-gray-200/70">
              Próxima recomendação automática: <span className="text-bjj-red font-semibold">{recomendacao.descricao}</span>{' '}
              com previsão sugerida para {new Date(recomendacao.previsao).toLocaleDateString('pt-BR')}.
            </p>
          ) : (
            <p className="text-xs text-bjj-gray-200/70">
              Nenhuma recomendação automática encontrada para a faixa atual. Ajuste os campos manualmente.
            </p>
          )}
        </div>
        <form className="grid grid-cols-1 lg:grid-cols-6 gap-4" onSubmit={handleSubmit}>
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-2">Aluno</label>
            <select name="alunoId" value={form.alunoId} onChange={handleChange} className="input-field">
              {alunos.map((aluno) => (
                <option key={aluno.id} value={aluno.id}>
                  {aluno.nome} · {aluno.faixa} ({aluno.graus}º grau)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tipo de graduação</label>
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
            <label className="block text-sm font-medium mb-2">Graus atuais</label>
            <input className="input-field" value={alunoSelecionado?.graus ?? 0} disabled />
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
          <div className="lg:col-span-6">
            <label className="block text-sm font-medium mb-2">Critério de liberação</label>
            <input
              name="criterioTempo"
              value={form.criterioTempo}
              onChange={handleChange}
              className="input-field"
              placeholder="Descrição do critério (tempo mínimo, performance etc.)"
            />
          </div>
          <div className="lg:col-span-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <p className="text-xs text-bjj-gray-200/70">
              Meses restantes estimados: <span className="text-bjj-red font-semibold">{form.mesesRestantes}</span>
            </p>
            <button type="submit" className="btn-primary md:w-auto w-full" disabled={!podeSalvar}>
              Salvar agenda
            </button>
          </div>
        </form>
      </section>
      <GraduationList graduacoes={graduacoes} onStatusChange={handleStatusChange} />
    </div>
  );
}
