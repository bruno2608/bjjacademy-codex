'use client';

/**
 * Página de graduações acompanha o progresso dos alunos rumo às próximas faixas
 * com possibilidade de atualizar status e agendar novas cerimônias.
 */
import { useEffect, useState } from 'react';
import GraduationList from '../../../components/ui/GraduationList';
import { getGraduacoes, scheduleGraduacao, updateGraduacao } from '../../../services/graduacoesService';
import useUserStore from '../../../store/userStore';

export default function GraduacoesPage() {
  const [graduacoes, setGraduacoes] = useState([]);
  const alunos = useUserStore((state) => state.alunos);
  const [form, setForm] = useState({
    alunoId: '',
    faixaAtual: '',
    proximaFaixa: '',
    previsao: ''
  });

  useEffect(() => {
    getGraduacoes().then(setGraduacoes);
  }, []);

  useEffect(() => {
    if (!alunos.length) return;
    setForm((prev) => {
      if (prev.alunoId && alunos.some((aluno) => aluno.id === prev.alunoId)) {
        return prev;
      }
      return { ...prev, alunoId: alunos[0].id };
    });
  }, [alunos]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.alunoId || !form.faixaAtual || !form.proximaFaixa || !form.previsao) {
      return;
    }

    const alunoSelecionado = alunos.find((aluno) => aluno.id === form.alunoId);
    if (!alunoSelecionado) return;
    const novaGraduacao = await scheduleGraduacao({
      ...form,
      alunoNome: alunoSelecionado.nome,
      status: 'Planejado'
    });
    setGraduacoes((prev) => [...prev, novaGraduacao]);
    setForm({ alunoId: alunos[0]?.id || '', faixaAtual: '', proximaFaixa: '', previsao: '' });
  };

  const handleStatusChange = async (graduacao, novoStatus) => {
    const atualizado = await updateGraduacao(graduacao.id, { status: novoStatus });
    setGraduacoes((prev) => prev.map((item) => (item.id === graduacao.id ? atualizado : item)));
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">Linha do tempo de graduações</h2>
        <p className="text-sm text-bjj-gray-200/70">
          Visualize o caminho de evolução dos atletas e mantenha o calendário de cerimônias organizado.
        </p>
      </header>
      <section className="card space-y-4">
        <h3 className="text-lg font-semibold">Agendar nova graduação</h3>
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2">Aluno</label>
            <select
              name="alunoId"
              value={form.alunoId}
              onChange={handleChange}
              className="input-field"
            >
              {alunos.map((aluno) => (
                <option key={aluno.id} value={aluno.id}>
                  {aluno.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Faixa atual</label>
            <input
              name="faixaAtual"
              value={form.faixaAtual}
              onChange={handleChange}
              className="input-field"
              placeholder="Faixa atual"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Próxima faixa</label>
            <input
              name="proximaFaixa"
              value={form.proximaFaixa}
              onChange={handleChange}
              className="input-field"
              placeholder="Faixa alvo"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Previsão</label>
            <input
              type="date"
              name="previsao"
              value={form.previsao}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div className="md:col-span-4 flex justify-end">
            <button type="submit" className="btn-primary">Salvar agenda</button>
          </div>
        </form>
      </section>
      <GraduationList graduacoes={graduacoes} onStatusChange={handleStatusChange} />
    </div>
  );
}
